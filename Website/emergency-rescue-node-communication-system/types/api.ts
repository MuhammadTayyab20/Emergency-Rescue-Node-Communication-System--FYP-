/*export interface UserEntryRequest {
  name: string;
  emergency_number?: string | null;
}

export interface UserRecord {
  id: string;
  name: string;
  emergency_number: string | null;
  created_at: string;
}

export interface UserEntryResponse {
  inserted: boolean;
  user: UserRecord;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminInfo {
  id: string;
  email: string;
}

export interface AdminLoginResponse {
  access_token: string;
  token_type: string;
  admin: AdminInfo;
}

export interface AdminUsersResponse {
  users: UserRecord[];
}

export interface AdminStatsResponse {
  total_users: number;
  users_with_emergency_number: number;
  users_without_emergency_number: number;
}*/

export interface UserEntryRequest {
  name: string;
  emergency_number?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface UserRecord {
  id: string;
  name: string;
  emergency_number: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export interface UserEntryResponse {
  inserted: boolean;
  user: UserRecord;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminInfo {
  id: string;
  email: string;
}

export interface AdminLoginResponse {
  access_token: string;
  token_type: string;
  admin: AdminInfo;
}

export interface AdminUsersResponse {
  users: UserRecord[];
}

export interface AdminStatsResponse {
  total_users: number;
  users_with_emergency_number: number;
  users_without_emergency_number: number;
}
