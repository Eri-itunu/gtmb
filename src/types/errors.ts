export type AppError =
  | { kind: "network"; message: string }
  | { kind: "timeout"; message: string }
  | { kind: "server"; status: number; message: string }
  | { kind: "auth"; message: string }
  | { kind: "validation"; fields: Record<string, string> };
