const SENSITIVE_KEY_PATTERNS = [
  /bvn/i,
  /nin/i,
  /password/i,
  /pin/i,
  /otp/i,
  /token/i,
  /secret/i,
  /income/i,
  /salary/i,
  /employer/i,
  /address/i,
  /dateofbirth/i,
  /dob/i,
];

export const isSensitiveKey = (key: string) => {
  const normalized = key.replace(/[_\-\s]/g, "");
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(normalized));
};

export const redactSensitiveData = (data: unknown, depth = 0): unknown => {
  if (depth > 6 || data === null || data === undefined) return data;
  if (typeof data !== "object") return data;
  if (Array.isArray(data)) return data.map((item) => redactSensitiveData(item, depth + 1));

  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).map(([key, value]) => [
      key,
      isSensitiveKey(key) ? "[REDACTED]" : redactSensitiveData(value, depth + 1),
    ])
  );
};

export const safeLog = (message: string, data?: unknown) => {
  if (process.env.NODE_ENV !== "development") return;
  if (data === undefined) {
    console.log(message);
    return;
  }
  console.log(message, redactSensitiveData(data));
};
