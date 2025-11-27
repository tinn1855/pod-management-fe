export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  team?: Team;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  module: string;
  actions: PermissionAction[];
}

export type PermissionAction = "create" | "read" | "update" | "delete";

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: User[];
  leader?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionModule {
  module: string;
  permissions: Permission[];
}
