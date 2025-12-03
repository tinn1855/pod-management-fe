import Cookies from "js-cookie";
import { Role } from "@/type/user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_URL_API || "https://pod-management.onrender.com/api";

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = Cookies.get("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Roles Service
export const rolesService = {
  // Get all roles
  getAll: async (): Promise<Role[]> => {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to fetch roles: ${response.statusText}`
      );
    }

    const data = await response.json();
    
    // Helper to normalize role data from API
    const normalizeRole = (role: any): Role => {
      return {
        id: String(role.id || role._id || ""),
        name: role.name || "",
        description: role.description || undefined,
        permissions: Array.isArray(role.permissions) ? role.permissions : [],
        color: role.color || undefined,
        createdAt: role.createdAt || role.created_at || new Date().toISOString(),
        updatedAt: role.updatedAt || role.updated_at || new Date().toISOString(),
      };
    };
    
    // Handle different response formats
    let rolesArray: Role[] = [];
    
    // Check if response has rolesData array
    if (data.rolesData && Array.isArray(data.rolesData)) {
      rolesArray = data.rolesData.map(normalizeRole);
    }
    // Check if response has data array
    else if (data.data && Array.isArray(data.data)) {
      rolesArray = data.data.map(normalizeRole);
    }
    // Check if response is direct array
    else if (Array.isArray(data)) {
      rolesArray = data.map(normalizeRole);
    }
    
    return rolesArray;
  },
};

