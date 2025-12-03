import { useState, useEffect } from "react";
import { Team } from "@/type/user";
import { teamsService } from "@/lib/services/teams.service";

export function useTeams(shouldFetch: boolean = true) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }

    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await teamsService.getAll();
        setTeams(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch teams";
        setError(errorMessage);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [shouldFetch]);

  return { teams, loading, error };
}

