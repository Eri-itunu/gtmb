import { useAuthStore } from "@/store/authStore";
import { redactSensitiveData, safeLog } from "@/lib/security";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY ?? "";
const IS_DEV = process.env.NODE_ENV === "development";
const DEFAULT_TIMEOUT_MS = 15_000;
const GET_RETRY_COUNT = 2;

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

export class ApiError extends Error {
  status?: number;
  code: ApiErrorCode;
  details?: unknown;
  retryable: boolean;

  constructor({
    message,
    code,
    status,
    details,
    retryable,
  }: {
    message: string;
    code: ApiErrorCode;
    status?: number;
    details?: unknown;
    retryable: boolean;
  }) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
    this.retryable = retryable;
  }
}

export const isApiError = (err: unknown): err is ApiError => err instanceof ApiError;

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  timeoutMs?: number;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions extends ApiRequestConfig {
  method: HttpMethod;
  data?: unknown;
  retriedAuth?: boolean;
}

interface ServerErrorBody {
  message?: string;
  error?: { errorType?: string; message?: string };
  details?: unknown;
  data?: unknown;
}

//For now these routes dont exist but I use them as an example
const PUBLIC_ROUTES = ["/login", "/register"];
//ER002 is also another example of assuming the backend error for auth is ER002
const AUTH_ERROR_TYPES = new Set(["ER002"]);

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

const enqueueRefresh = (cb: (token: string) => void) => {
  refreshQueue.push(cb);
};

const drainRefreshQueue = (token: string) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const retryDelay = (attempt: number) => {
  const delay = Math.pow(2, attempt - 1) * 1_000;
  const jitter = Math.random() * 400 - 200;
  return delay + jitter;
};

const buildUrl = (url: string) => {
  if (/^https?:\/\//i.test(url)) return url;
  return `${BASE_URL}${url}`;
};

const isPublicRoute = (url: string) => PUBLIC_ROUTES.some((route) => url.includes(route));

const parseJsonSafely = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const createApiErrorFromResponse = async (response: Response): Promise<ApiError> => {
  const body = (await parseJsonSafely(response)) as ServerErrorBody | undefined;
  return createApiErrorFromBody(response.status, body);
};

const createApiErrorFromBody = (status: number, body?: ServerErrorBody): ApiError => {
  const serverMessage = body?.error?.message ?? body?.message;
  const details = redactSensitiveData(body?.details ?? body?.error);

  if (status === 401) {
    return new ApiError({
      message: "Your session has expired. Please log in again.",
      code: "UNAUTHORIZED",
      status,
      details,
      retryable: false,
    });
  }

  if (status === 403) {
    return new ApiError({
      message: "You do not have permission to perform this action.",
      code: "FORBIDDEN",
      status,
      details,
      retryable: false,
    });
  }

  if (status === 404) {
    return new ApiError({
      message: serverMessage ?? "The requested resource was not found.",
      code: "NOT_FOUND",
      status,
      details,
      retryable: false,
    });
  }

  if (status >= 400 && status < 500) {
    return new ApiError({
      message: serverMessage ?? "Please check your input and try again.",
      code: "VALIDATION_ERROR",
      status,
      details,
      retryable: false,
    });
  }

  if (status >= 500) {
    return new ApiError({
      message: serverMessage ?? "Something went wrong on our end. Please try again shortly.",
      code: "SERVER_ERROR",
      status,
      details,
      retryable: true,
    });
  }

  return new ApiError({
    message: serverMessage ?? "An unexpected error occurred.",
    code: "UNKNOWN",
    status,
    details,
    retryable: false,
  });
};

const createNetworkError = (error: unknown): ApiError => {
  if (error instanceof Error && error.name === "AbortError") {
    return new ApiError({
      message: "The request timed out. Please check your connection and try again.",
      code: "TIMEOUT",
      retryable: true,
    });
  }

  return new ApiError({
    message: "Unable to reach the server. Please check your internet connection.",
    code: "NETWORK_ERROR",
    retryable: true,
    details: IS_DEV && error instanceof Error ? error.message : undefined,
  });
};

const isAuthErrorBody = (body: unknown) => {
  const data = body as { success?: boolean; error?: { errorType?: string } } | undefined;
  return data?.success === false && !!data.error?.errorType && AUTH_ERROR_TYPES.has(data.error.errorType);
};

const refreshAccessToken = async () => {
  const { refreshToken, setAccessToken, logOut } = useAuthStore.getState();

  if (!refreshToken) {
    logOut();
    throw new ApiError({
      message: "Your session has expired. Please log in again.",
      code: "UNAUTHORIZED",
      retryable: false,
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(buildUrl("/refresh"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
        "X-Api-Key": API_KEY,
      },
      signal: controller.signal,
    });

    const body = (await parseJsonSafely(response)) as
      | { data?: { accessToken?: string | { token?: string } } }
      | undefined;

    if (!response.ok) {
      throw createApiErrorFromBody(response.status, body as ServerErrorBody | undefined);
    }

    const newToken =
      typeof body?.data?.accessToken === "string"
        ? body.data.accessToken
        : body?.data?.accessToken?.token;

    if (!newToken) {
      throw new ApiError({
        message: "Refresh response contained no access token.",
        code: "UNKNOWN",
        retryable: false,
      });
    }

    setAccessToken(newToken);
    return newToken;
  } catch (error) {
    if (isApiError(error)) throw error;
    throw createNetworkError(error);
  } finally {
    clearTimeout(timer);
  }
};

const withTimeout = async (url: string, init: RequestInit, timeoutMs: number) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const requestOnce = async <T>(url: string, options: RequestOptions): Promise<T> => {
  const { accessToken } = useAuthStore.getState();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const requestUrl = buildUrl(url);
  const body = options.data === undefined ? undefined : JSON.stringify(options.data);

  safeLog(`→ [${options.method}] ${url}`, redactSensitiveData(options.data));

  let response: Response;
  let parsedBody: unknown;

  try {
    response = await withTimeout(
      requestUrl,
      {
        method: options.method,
        headers,
        body,
      },
      options.timeoutMs ?? DEFAULT_TIMEOUT_MS
    );
    parsedBody = await parseJsonSafely(response);
  } catch (error) {
    throw createNetworkError(error);
  }

  safeLog(`← [${response.status}] ${url}`);

  const authErrorFromBody = isAuthErrorBody(parsedBody);
  const authErrorFromStatus = response.status === 401;
  const shouldTryRefresh =
    (authErrorFromStatus || authErrorFromBody) && !options.retriedAuth && !isPublicRoute(url);

  if (shouldTryRefresh) {
    if (isRefreshing) {
      const token = await new Promise<string>((resolve) => {
        enqueueRefresh(resolve);
      });
      return requestOnce<T>(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` },
        retriedAuth: true,
      });
    }

    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      drainRefreshQueue(newToken);
      return requestOnce<T>(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
        retriedAuth: true,
      });
    } catch (error) {
      refreshQueue = [];
      useAuthStore.getState().logOut();
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    throw await createApiErrorFromResponse(
      new Response(JSON.stringify(parsedBody), {
        status: response.status,
        statusText: response.statusText,
      })
    );
  }

  return parsedBody as T;
};

const shouldRetry = (method: HttpMethod, error: ApiError) =>
  method === "GET" && error.retryable && (error.status === undefined || error.status >= 500);

const request = async <T>(url: string, options: RequestOptions): Promise<T> => {
  const maxAttempts = options.method === "GET" ? GET_RETRY_COUNT + 1 : 1;
  let lastError: ApiError | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await requestOnce<T>(url, options);
    } catch (error) {
      const apiError = isApiError(error) ? error : createNetworkError(error);
      lastError = apiError;

      if (attempt >= maxAttempts || !shouldRetry(options.method, apiError)) {
        throw apiError;
      }

      safeLog(`[API] Retry attempt ${attempt} for ${url} - ${apiError.message}`);
      await wait(retryDelay(attempt));
    }
  }

  throw lastError;
};

export const api = {
  get: <T>(url: string, config?: ApiRequestConfig): Promise<T> =>
    request<T>(url, { ...config, method: "GET" }),

  post: <T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> =>
    request<T>(url, { ...config, method: "POST", data }),

  put: <T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> =>
    request<T>(url, { ...config, method: "PUT", data }),

  patch: <T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> =>
    request<T>(url, { ...config, method: "PATCH", data }),

  delete: <T>(url: string, config?: ApiRequestConfig): Promise<T> =>
    request<T>(url, { ...config, method: "DELETE" }),
};

export default api;
