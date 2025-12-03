import { useState, useEffect, useCallback } from "react";
import { User } from "@/type/user";
import { usersService } from "@/lib/services/users.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface UseUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  roleId?: string;
}

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  createUser: (userData: {
    name: string;
    email: string;
    password: string;
    roleId: string;
    teamId?: string;
    status: "active" | "inactive" | "pending";
  }) => Promise<User | null>;
  updateUser: (
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
  ) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
}

export function useUsers(params?: UseUsersParams): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersService.getAll(params);
      setUsers(response.data);
      setTotal(response.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      toast.error(errorMessage);
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit, params?.search, params?.status, params?.roleId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(
    async (userData: {
      name: string;
      email: string;
      password: string;
      roleId: string;
      teamId?: string;
      status: "active" | "inactive" | "pending";
    }): Promise<User | null> => {
      try {
        const newUser = await usersService.register(userData);
        await fetchUsers(); // Refetch to get updated list
        toast.success("User created successfully");
        return newUser;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create user";
        toast.error(errorMessage);
        return null;
      }
    },
    [fetchUsers]
  );

  const updateUser = useCallback(
    async (
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
    ): Promise<User | null> => {
      try {
        const updatedUser = await usersService.update(id, userData);
        await fetchUsers(); // Refetch to get updated list
        toast.success("User updated successfully");
        return updatedUser;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update user";
        
        // Handle 401 Unauthorized - token expired or invalid
        if (errorMessage.includes("401") || errorMessage.toLowerCase().includes("unauthorized")) {
          Cookies.remove("token");
          toast.error("Session expired. Please login again.");
          router.push("/login");
          return null;
        }
        
        // Handle 403 Forbidden - permission denied
        if (errorMessage.includes("403") || errorMessage.toLowerCase().includes("forbidden")) {
          toast.error("You don't have permission to update users. Only administrators can update user information.");
          return null;
        }
        
        toast.error(errorMessage);
        return null;
      }
    },
    [fetchUsers, router]
  );

  const deleteUser = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await usersService.delete(id);
        await fetchUsers(); // Refetch to get updated list
        toast.success("User deleted successfully");
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete user";
        
        // Handle 401 Unauthorized - token expired or invalid
        if (errorMessage.includes("401") || errorMessage.toLowerCase().includes("unauthorized")) {
          Cookies.remove("token");
          toast.error("Session expired. Please login again.");
          router.push("/login");
          return false;
        }
        
        // Handle 403 Forbidden - permission denied
        if (errorMessage.includes("403") || errorMessage.toLowerCase().includes("forbidden")) {
          toast.error("You don't have permission to delete users. Only administrators can delete users.");
          return false;
        }
        
        toast.error(errorMessage);
        return false;
      }
    },
    [fetchUsers, router]
  );

  return {
    users,
    loading,
    error,
    total,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}

