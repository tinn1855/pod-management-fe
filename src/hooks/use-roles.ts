import { useState, useEffect } from "react";
import { Role } from "@/type/user";
import { rolesService } from "@/lib/services/roles.service";

export function useRoles(shouldFetch: boolean = true) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }

    const fetchRoles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await rolesService.getAll();
        setRoles(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch roles";
        setError(errorMessage);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [shouldFetch]);

  return { roles, loading, error };
}

