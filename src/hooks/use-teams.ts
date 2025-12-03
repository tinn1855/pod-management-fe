import { useState, useEffect, useCallback } from "react";
import { Team } from "@/type/user";
import { teamsService } from "@/lib/services/teams.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useTeams(shouldFetch: boolean = true) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teamsService.getAll();
      setTeams(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch teams";
      setError(errorMessage);
      setTeams([]);

      // Handle 401 Unauthorized - auto logout
      if (err instanceof Error && err.message.includes("401")) {
        toast.error("Session expired. Please login again.");
        Cookies.remove("token");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }

    fetchTeams();
  }, [shouldFetch, fetchTeams]);

  // Create team
  const createTeam = useCallback(
    async (teamData: {
      name: string;
      description?: string;
      memberIds?: string[];
    }): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const newTeam = await teamsService.create(teamData);
        setTeams((prev) => [newTeam, ...prev]);
        toast.success("Team created successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create team";
        setError(errorMessage);
        toast.error(errorMessage);

        // Handle 401 Unauthorized
        if (err instanceof Error && err.message.includes("401")) {
          Cookies.remove("token");
          router.push("/login");
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Update team
  const updateTeam = useCallback(
    async (
      id: string,
      teamData: {
        name?: string;
        description?: string;
        memberIds?: string[];
      }
    ): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const updatedTeam = await teamsService.update(id, teamData);
        setTeams((prev) =>
          prev.map((team) => (team.id === id ? updatedTeam : team))
        );
        toast.success("Team updated successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update team";
        setError(errorMessage);

        // Handle specific errors
        if (err instanceof Error) {
          if (err.message.includes("401")) {
            toast.error("Session expired. Please login again.");
            Cookies.remove("token");
            router.push("/login");
          } else if (err.message.includes("403")) {
            toast.error("You don't have permission to update this team");
          } else {
            toast.error(errorMessage);
          }
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Delete team
  const deleteTeam = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        await teamsService.delete(id);
        setTeams((prev) => prev.filter((team) => team.id !== id));
        toast.success("Team deleted successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete team";
        setError(errorMessage);

        // Handle specific errors
        if (err instanceof Error) {
          if (err.message.includes("401")) {
            toast.error("Session expired. Please login again.");
            Cookies.remove("token");
            router.push("/login");
          } else if (err.message.includes("403")) {
            toast.error("You don't have permission to delete this team");
          } else {
            toast.error(errorMessage);
          }
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return {
    teams,
    loading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    refetch: fetchTeams,
  };
}
