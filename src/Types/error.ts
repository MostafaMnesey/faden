export interface AppError extends Error {
  status?: number;
  statusCode?: number;
  cause?: number | unknown;
  details?: unknown;
  meta?: unknown;
  code?: string;
}

export interface FirebaseError extends Error {
  code?: string;
}
