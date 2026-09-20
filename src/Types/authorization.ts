export interface AuthorizationArgs {
  accessRoles?: string[];
}

export interface UserRole {
  name: string;
  [key: string]: unknown;
}
