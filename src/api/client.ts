
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  create,
} from "axios";
import axiosRetry, { isNetworkError } from "axios-retry";
import { useAuthStore } from "@/store/authStore";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY ?? "";
const IS_DEV = process.env.NODE_ENV === "development";
const DEFAULT_TIMEOUT_MS = 15_000;

if (!BASE_URL && IS_DEV) {
  console.warn("[API] EXPO_PUBLIC_API_URL is not set.");
}

export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "UNKNOWN";

export interface ApiError {
  message: string;
  code: ApiErrorCode;
  status?: number;
  serverErrorType?: string;
  retryable: boolean;
}

/** Type-guard so callers can distinguish ApiError from unknown throws */
export const isApiError = (err: unknown): err is ApiError =>
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  "retryable" in err;

const SENSITIVE_KEYS = new Set([
  "bvn",
  "nin",
  "password",
  "pin",
  "otp",
  "accountnumber",
  "accountno",
  "cardnumber",
  "cvv",
  "income",
  "salary",
  "token",
  "accesstoken",
  "refreshtoken",
  "secret",
]);

const redact = (data: unknown, depth = 0): unknown => {
  if (depth > 5 || data === null || data === undefined) return data;
  if (typeof data !== "object") return data;
  if (Array.isArray(data)) return data.map((item) => redact(item, depth + 1));

  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).map(([key, value]) => {
      const normalised = key.toLowerCase().replace(/[_-]/g, "");
      if (SENSITIVE_KEYS.has(normalised)) return [key, "[REDACTED]"];
      return [key, redact(value, depth + 1)];
    })
  );
};

// ---------------------------------------------------------------------------
// Error normalisation
// ---------------------------------------------------------------------------

const normaliseError = (error: AxiosError): ApiError => {
  // Pure network failure (no response received)
  if (!error.response) {
    const isTimeout = error.code === "ECONNABORTED" || error.code === "ERR_CANCELED";
    return {
      message: isTimeout
        ? "The request timed out. Please check your connection and try again."
        : "Unable to reach the server. Please check your internet connection.",
      code: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
      retryable: true,
    };
  }

  const { status, data } = error.response as {
    status: number;
    data?: { message?: string; error?: { errorType?: string; message?: string } };
  };

  const serverMessage =
    data?.error?.message ?? data?.message ?? undefined;
  const serverErrorType = data?.error?.errorType;

  switch (true) {
    case status === 401:
      return {
        message: "Your session has expired. Please log in again.",
        code: "UNAUTHORIZED",
        status,
        serverErrorType,
        retryable: false,
      };
    case status === 403:
      return {
        message: "You do not have permission to perform this action.",
        code: "FORBIDDEN",
        status,
        serverErrorType,
        retryable: false,
      };
    case status === 404:
      return {
        message: serverMessage ?? "The requested resource was not found.",
        code: "NOT_FOUND",
        status,
        serverErrorType,
        retryable: false,
      };
    case status === 422:
      return {
        message: serverMessage ?? "Please check your input and try again.",
        code: "VALIDATION_ERROR",
        status,
        serverErrorType,
        retryable: false,
      };
    case status >= 500:
      return {
        message:
          serverMessage ?? "Something went wrong on our end. Please try again shortly.",
        code: "SERVER_ERROR",
        status,
        serverErrorType,
        retryable: true,
      };
    default:
      return {
        message: serverMessage ?? "An unexpected error occurred.",
        code: "UNKNOWN",
        status,
        serverErrorType,
        retryable: false,
      };
  }
};


const client: AxiosInstance = create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": API_KEY,
  },
});


axiosRetry(client, {
  retries: 3,
  retryDelay: (retryCount) => {
    // Exponential back-off: 1 s, 2 s, 4 s
    const delay = Math.pow(2, retryCount - 1) * 1_000;
    const jitter = Math.random() * 400 - 200;
    return delay + jitter;
  },
  retryCondition: (error: AxiosError) => {
    if (isNetworkError(error)) return true;
    const status = error.response?.status ?? 0;
    return status >= 500 && status <= 599;
  },
  onRetry: (retryCount, error) => {
    if (IS_DEV) {
      console.warn(
        `[API] Retry attempt ${retryCount} for ${error.config?.url ?? "unknown"} — ${error.message}`
      );
    }
  },
});


const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/refresh",
  "/forgot-password",
  "/reset-password",
];

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

const enqueueRefresh = (cb: (token: string) => void) => {
  refreshQueue.push(cb);
};

const drainRefreshQueue = (token: string) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

const isPublicRoute = (url?: string): boolean =>
  PUBLIC_ROUTES.some((route) => url?.includes(route));

const AUTH_ERROR_TYPES = new Set(["ER002"]);

const isAuthError = (error: AxiosError): boolean => {
  if (error.response?.status === 401) return true;
  const data = error.response?.data as
    | { success?: boolean; error?: { errorType?: string } }
    | undefined;
  return (
    data?.success === false &&
    !!data?.error?.errorType &&
    AUTH_ERROR_TYPES.has(data.error.errorType)
  );
};

// ---------------------------------------------------------------------------
// Request interceptor — attach auth header
// ---------------------------------------------------------------------------

client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (IS_DEV) {
      const safeData = config.data ? redact(JSON.parse(JSON.stringify(config.data))) : undefined;
      console.log(
        `→ [${config.method?.toUpperCase()}] ${config.url}`,
        safeData ?? ""
      );
    }

    return config;
  },
  (error: AxiosError) => {
    if (IS_DEV) console.error("[API] Request setup error:", error.message);
    return Promise.reject(normaliseError(error));
  }
);

// ---------------------------------------------------------------------------
// Response interceptor — normalise errors + handle token refresh
// ---------------------------------------------------------------------------

client.interceptors.response.use(
  (response) => {
    if (IS_DEV) {
      console.log(`← [${response.status}] ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retried?: boolean;
    };

    // Not an auth error — normalise and reject immediately
    if (!isAuthError(error)) {
      return Promise.reject(normaliseError(error));
    }

    // Auth error on a public route — reject immediately (e.g. wrong password)
    if (isPublicRoute(originalRequest?.url)) {
      return Promise.reject(normaliseError(error));
    }

    // Prevent infinite loops on the refresh endpoint itself
    if (originalRequest._retried) {
      const { logOut } = useAuthStore.getState();
      logOut?.();
      return Promise.reject(normaliseError(error));
    }

    // Another refresh is already in-flight — queue this request
    if (isRefreshing) {
      return new Promise((resolve) => {
        enqueueRefresh((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(client(originalRequest));
        });
      });
    }

    // Mark as refreshing and prevent retry loops
    isRefreshing = true;
    originalRequest._retried = true;

    const { refreshToken, setAccessToken, logOut } = useAuthStore.getState();

    if (!refreshToken) {
      isRefreshing = false;
      logOut?.();
      return Promise.reject(normaliseError(error));
    }

    try {
      const refreshResponse = await axios.post(
        `${BASE_URL}/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "X-Api-Key": API_KEY,
            "Content-Type": "application/json",
          },
          timeout: DEFAULT_TIMEOUT_MS,
        }
      );

      const newToken: string | undefined =
        refreshResponse.data?.data?.accessToken?.token ??
        refreshResponse.data?.data?.accessToken;

      if (!newToken) throw new Error("Refresh response contained no access token.");

      setAccessToken(newToken);
      drainRefreshQueue(newToken);
      isRefreshing = false;

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return client(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      refreshQueue = []; // Clear queue — all pending requests will also fail
      logOut?.();
      return Promise.reject(
        isApiError(refreshError)
          ? refreshError
          : normaliseError(refreshError as AxiosError)
      );
    }
  }
);

// ---------------------------------------------------------------------------
// Typed request helpers
// ---------------------------------------------------------------------------

/**
 * Wrapper around the axios instance that always resolves to `T` or throws
 * a typed `ApiError`. Use these in your api/* modules rather than calling
 * `client` directly.
 */
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await client.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await client.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await client.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await client.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await client.delete<T>(url, config);
    return response.data;
  },
};

export default client;
