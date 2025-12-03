import Cookies from "js-cookie";
import { Team } from "@/type/user";

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

// Teams Service
export const teamsService = {
  // Get all teams
  getAll: async (): Promise<Team[]> => {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to fetch teams: ${response.statusText}`
      );
    }

    const data = await response.json();
    
    // Helper to normalize team data from API
    const normalizeTeam = (team: any): Team => {
      return {
        id: String(team.id || team._id || ""),
        name: team.name || "",
        description: team.description || undefined,
        members: Array.isArray(team.members) ? team.members : [],
        leader: team.leader || undefined,
        createdAt: team.createdAt || team.created_at || new Date().toISOString(),
        updatedAt: team.updatedAt || team.updated_at || new Date().toISOString(),
      };
    };
    
    // Handle different response formats
    let teamsArray: Team[] = [];
    
    if (Array.isArray(data)) {
      teamsArray = data.map(normalizeTeam);
      return teamsArray;
    }
    if (data.data && Array.isArray(data.data)) {
      teamsArray = data.data.map(normalizeTeam);
      return teamsArray;
    }
    return [];
  },
};

