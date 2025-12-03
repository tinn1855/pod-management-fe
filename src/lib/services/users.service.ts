import Cookies from "js-cookie";
import { User } from "@/type/user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_URL_API || "https://pod-management.onrender.com/api";

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = Cookies.get("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("No token found in cookies");
  }

  return headers;
};

// API Response types
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// User Service
export const usersService = {
  // Get all users
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    roleId?: string;
  }): Promise<PaginatedResponse<User>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.roleId) queryParams.append("roleId", params.roleId);

    const url = `${API_BASE_URL}/users${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to fetch users: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Helper to normalize user data from API
    const normalizeUser = (user: any): User => {
      // Normalize status from API format to our format
      const normalizeStatus = (
        status: string
      ): "active" | "inactive" | "pending" => {
        const normalized = status?.toLowerCase() || "pending";
        // Handle SUSPENDING from API
        if (normalized === "suspending") return "inactive";
        if (
          normalized === "pending" ||
          normalized === "active" ||
          normalized === "inactive"
        ) {
          return normalized as "active" | "inactive" | "pending";
        }
        return "pending";
      };

      return {
        id: String(user.id || user._id || ""),
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || undefined,
        role: {
          id: String(user.role?.id || user.roleId || ""),
          name: user.role?.name || "",
          description: user.role?.description || undefined,
          permissions: user.role?.permissions || [],
          color: user.role?.color || undefined,
          createdAt:
            user.role?.createdAt || user.createdAt || new Date().toISOString(),
          updatedAt:
            user.role?.updatedAt || user.updatedAt || new Date().toISOString(),
        },
        team: user.team
          ? {
              id: String(user.team.id || ""),
              name: user.team.name || "",
              description: user.team.description || undefined,
              members: user.team.members || [],
              leader: user.team.leader || undefined,
              createdAt: user.team.createdAt || new Date().toISOString(),
              updatedAt: user.team.updatedAt || new Date().toISOString(),
            }
          : undefined,
        status: normalizeStatus(user.status),
        createdAt:
          user.createdAt || user.created_at || new Date().toISOString(),
        updatedAt:
          user.updatedAt || user.updated_at || new Date().toISOString(),
      };
    };

    // Handle different response formats
    let usersArray: User[] = [];

    if (Array.isArray(data)) {
      usersArray = data.map(normalizeUser);
      return {
        data: usersArray,
        total: usersArray.length,
        page: params?.page || 1,
        limit: params?.limit || usersArray.length,
      };
    }
    if (data.data && Array.isArray(data.data)) {
      usersArray = data.data.map(normalizeUser);
      return {
        data: usersArray,
        total: data.total || usersArray.length,
        page: data.page || params?.page || 1,
        limit: data.limit || params?.limit || usersArray.length,
      };
    }
    return {
      data: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to fetch user: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Helper to normalize user data from API
    const normalizeUser = (user: any): User => {
      // Normalize status from API format to our format
      const normalizeStatus = (
        status: string
      ): "active" | "inactive" | "pending" => {
        const normalized = status?.toLowerCase() || "pending";
        // Handle SUSPENDING from API
        if (normalized === "suspending") return "inactive";
        if (
          normalized === "pending" ||
          normalized === "active" ||
          normalized === "inactive"
        ) {
          return normalized as "active" | "inactive" | "pending";
        }
        return "pending";
      };

      return {
        id: String(user.id || user._id || ""),
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || undefined,
        role: {
          id: String(user.role?.id || user.roleId || ""),
          name: user.role?.name || "",
          description: user.role?.description || undefined,
          permissions: user.role?.permissions || [],
          color: user.role?.color || undefined,
          createdAt:
            user.role?.createdAt || user.createdAt || new Date().toISOString(),
          updatedAt:
            user.role?.updatedAt || user.updatedAt || new Date().toISOString(),
        },
        team: user.team
          ? {
              id: String(user.team.id || ""),
              name: user.team.name || "",
              description: user.team.description || undefined,
              members: user.team.members || [],
              leader: user.team.leader || undefined,
              createdAt: user.team.createdAt || new Date().toISOString(),
              updatedAt: user.team.updatedAt || new Date().toISOString(),
            }
          : undefined,
        status: normalizeStatus(user.status),
        createdAt:
          user.createdAt || user.created_at || new Date().toISOString(),
        updatedAt:
          user.updatedAt || user.updated_at || new Date().toISOString(),
      };
    };

    const rawUser = data.data || data;
    return normalizeUser(rawUser);
  },

  // Register new user (create account)
  register: async (userData: {
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    roleId: string;
    teamId?: string;
    status?: "active" | "inactive" | "pending";
  }): Promise<User> => {
    // Map status to uppercase format required by API
    const statusMap: Record<string, string> = {
      pending: "PENDING",
      active: "ACTIVE",
      inactive: "SUSPENDING", // API uses SUSPENDING instead of inactive
    };

    // Prepare data for API
    const apiData: any = {
      name: userData.name,
      email: userData.email,
      roleId: Number(userData.roleId), // Convert to number
      status: userData.status
        ? statusMap[userData.status] || userData.status.toUpperCase()
        : "PENDING",
    };

    // Add password if provided
    if (userData.password) {
      apiData.password = userData.password;
    }

    // Add teamId if provided (convert to number)
    if (userData.teamId) {
      apiData.teamId = Number(userData.teamId);
    }

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("Register API error:", error);

      // Handle error message array
      let errorMessage =
        error.error || `Failed to register user: ${response.statusText}`;
      if (Array.isArray(error.message)) {
        errorMessage = error.message.join(", ");
      } else if (error.message && typeof error.message === "string") {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.data || data;
  },

  // Create new user (admin endpoint - kept for backward compatibility)
  create: async (userData: {
    name: string;
    email: string;
    avatar?: string;
    roleId: string;
    teamId?: string;
    status: "active" | "inactive" | "pending";
  }): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to create user: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data || data;
  },

  // Update user
  update: async (
    id: string,
    userData: {
      name?: string;
      email?: string;
      password?: string;
      avatar?: string;
      roleId?: string;
      teamId?: string | null;
      status?: "active" | "inactive" | "pending";
    }
  ): Promise<User> => {
    // Map status to uppercase format required by API
    const statusMap: Record<string, string> = {
      pending: "PENDING",
      active: "ACTIVE",
      inactive: "SUSPENDING", // API uses SUSPENDING instead of inactive
    };

    // Prepare data for API
    const apiData: any = {};

    if (userData.name !== undefined) apiData.name = userData.name;
    if (userData.email !== undefined) apiData.email = userData.email;
    if (userData.password !== undefined && userData.password.trim() !== "") {
      apiData.password = userData.password;
    }
    if (userData.avatar !== undefined) apiData.avatar = userData.avatar;

    // Convert roleId to number if provided
    if (userData.roleId !== undefined) {
      apiData.roleId = Number(userData.roleId);
    }

    // Convert teamId to number if provided, or null if empty
    if (userData.teamId !== undefined) {
      apiData.teamId = userData.teamId ? Number(userData.teamId) : null;
    }

    // Convert status to uppercase
    if (userData.status !== undefined) {
      apiData.status =
        statusMap[userData.status] || userData.status.toUpperCase();
    }

    const headers = getAuthHeaders();
    const token = Cookies.get("token");

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("Update API error:", error);

      // Handle 403 Forbidden - permission issue
      if (response.status === 403) {
        const errorMessage =
          error.message || error.error || "Forbidden resource";
        // Throw with status code included for easier detection
        const forbiddenError = new Error(`403: ${errorMessage}`);
        (forbiddenError as any).status = 403;
        throw forbiddenError;
      }

      // Handle error message array
      let errorMessage =
        error.error || `Failed to update user: ${response.statusText}`;
      if (Array.isArray(error.message)) {
        errorMessage = error.message.join(", ");
      } else if (error.message && typeof error.message === "string") {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Normalize the updated user data
    const normalizeUser = (user: any): User => {
      const normalizeStatus = (
        status: string
      ): "active" | "inactive" | "pending" => {
        const normalized = status?.toLowerCase() || "pending";
        if (normalized === "suspending") return "inactive";
        if (
          normalized === "pending" ||
          normalized === "active" ||
          normalized === "inactive"
        ) {
          return normalized as "active" | "inactive" | "pending";
        }
        return "pending";
      };

      return {
        id: String(user.id || user._id || ""),
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || undefined,
        role: {
          id: String(user.role?.id || user.roleId || ""),
          name: user.role?.name || "",
          description: user.role?.description || undefined,
          permissions: user.role?.permissions || [],
          color: user.role?.color || undefined,
          createdAt:
            user.role?.createdAt || user.createdAt || new Date().toISOString(),
          updatedAt:
            user.role?.updatedAt || user.updatedAt || new Date().toISOString(),
        },
        team: user.team
          ? {
              id: String(user.team.id || ""),
              name: user.team.name || "",
              description: user.team.description || undefined,
              members: user.team.members || [],
              leader: user.team.leader || undefined,
              createdAt: user.team.createdAt || new Date().toISOString(),
              updatedAt: user.team.updatedAt || new Date().toISOString(),
            }
          : undefined,
        status: normalizeStatus(user.status),
        createdAt:
          user.createdAt || user.created_at || new Date().toISOString(),
        updatedAt:
          user.updatedAt || user.updated_at || new Date().toISOString(),
      };
    };

    const rawUser = data.data || data;
    return normalizeUser(rawUser);
  },

  // Delete user
  delete: async (id: string): Promise<void> => {
    const headers = getAuthHeaders();
    const token = Cookies.get("token");

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("Delete API error:", error);

      // Handle 403 Forbidden - permission issue
      if (response.status === 403) {
        const errorMessage =
          error.message || error.error || "Forbidden resource";
        // Throw with status code included for easier detection
        const forbiddenError = new Error(`403: ${errorMessage}`);
        (forbiddenError as any).status = 403;
        throw forbiddenError;
      }

      // Handle error message array
      let errorMessage =
        error.error || `Failed to delete user: ${response.statusText}`;
      if (Array.isArray(error.message)) {
        errorMessage = error.message.join(", ");
      } else if (error.message && typeof error.message === "string") {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
};
