import Cookies from "js-cookie";
import { Team, User } from "@/type/user";

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

// API Team Response type (raw data from backend)
interface ApiTeamResponse {
  id: number | string;
  _id?: string;
  name: string;
  description?: string;
  members?: ApiTeamMember[] | string[];
  users?: ApiTeamMember[] | string[]; // Alternative field name from API
  leader?: ApiTeamMember | string;
  _count?: {
    users?: number;
    members?: number;
  };
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

interface ApiTeamMember {
  id: number | string;
  name: string;
  email: string;
  avatar?: string;
  role?: {
    id: number | string;
    name: string;
  };
}

// Error response from API
interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

// Teams Service
export const teamsService = {
  // Get all teams
  getAll: async (): Promise<Team[]> => {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json().catch(() => ({}));
      const errorMessage = Array.isArray(error.message)
        ? error.message.join(", ")
        : error.message || `Failed to fetch teams: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Helper to normalize team member from API
    const normalizeMember = (member: ApiTeamMember | string): User => {
      // If member is just a string (ID), return minimal user object
      if (typeof member === "string") {
        return {
          id: member,
          name: "Unknown",
          email: "",
          role: {
            id: "",
            name: "",
            permissions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      // Full member object
      return {
        id: String(member.id),
        name: member.name || "",
        email: member.email || "",
        avatar: member.avatar,
        role: {
          id: String(member.role?.id || ""),
          name: member.role?.name || "",
          permissions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    };

    // Helper to normalize team data from API
    const normalizeTeam = (team: ApiTeamResponse): Team => {
      // Get members from either 'members' or 'users' field
      const membersData = team.members || team.users || [];
      const normalizedMembers = Array.isArray(membersData)
        ? membersData.map(normalizeMember)
        : [];

      // Get member count from _count.users or _count.members, or calculate from array
      const memberCount =
        team._count?.users ?? team._count?.members ?? normalizedMembers.length;

      return {
        id: String(team.id || team._id || ""),
        name: team.name || "",
        description: team.description || undefined,
        members: normalizedMembers,
        leader: team.leader ? normalizeMember(team.leader) : undefined,
        memberCount: memberCount,
        createdAt:
          team.createdAt || team.created_at || new Date().toISOString(),
        updatedAt:
          team.updatedAt || team.updated_at || new Date().toISOString(),
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

  // Create new team
  create: async (teamData: {
    name: string;
    description?: string;
    memberIds?: string[];
  }): Promise<Team> => {
    // Prepare data for API
    const apiData: {
      name: string;
      description?: string;
      memberIds?: number[];
    } = {
      name: teamData.name,
    };

    if (teamData.description) {
      apiData.description = teamData.description;
    }

    if (teamData.memberIds && teamData.memberIds.length > 0) {
      apiData.memberIds = teamData.memberIds.map((id) => Number(id));
    }

    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json().catch(() => ({}));
      console.error("Create team API error:", error);

      let errorMessage =
        error.error || `Failed to create team: ${response.statusText}`;
      if (Array.isArray(error.message)) {
        errorMessage = error.message.join(", ");
      } else if (error.message && typeof error.message === "string") {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Helper to normalize (reuse from getAll)
    const normalizeMember = (member: ApiTeamMember | string): User => {
      if (typeof member === "string") {
        return {
          id: member,
          name: "Unknown",
          email: "",
          role: {
            id: "",
            name: "",
            permissions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      return {
        id: String(member.id),
        name: member.name || "",
        email: member.email || "",
        avatar: member.avatar,
        role: {
          id: String(member.role?.id || ""),
          name: member.role?.name || "",
          permissions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    };

    const normalizeTeam = (team: ApiTeamResponse): Team => {
      const membersData = team.members || team.users || [];
      const normalizedMembers = Array.isArray(membersData)
        ? membersData.map(normalizeMember)
        : [];

      const memberCount =
        team._count?.users ?? team._count?.members ?? normalizedMembers.length;

      return {
        id: String(team.id || team._id || ""),
        name: team.name || "",
        description: team.description || undefined,
        members: normalizedMembers,
        leader: team.leader ? normalizeMember(team.leader) : undefined,
        memberCount: memberCount,
        createdAt:
          team.createdAt || team.created_at || new Date().toISOString(),
        updatedAt:
          team.updatedAt || team.updated_at || new Date().toISOString(),
      };
    };

    const rawTeam = data.data || data;
    return normalizeTeam(rawTeam);
  },

  // Update team
  update: async (
    id: string,
    teamData: {
      name?: string;
      description?: string;
      memberIds?: string[];
    }
  ): Promise<Team> => {
    // Prepare data for API
    const apiData: {
      name?: string;
      description?: string;
      memberIds?: number[];
    } = {};

    if (teamData.name !== undefined) apiData.name = teamData.name;
    if (teamData.description !== undefined)
      apiData.description = teamData.description;

    if (teamData.memberIds !== undefined) {
      apiData.memberIds = teamData.memberIds.map((id) => Number(id));
    }

    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json().catch(() => ({}));
      console.error("Update team API error:", error);

      // Handle 403 Forbidden
      if (response.status === 403) {
        const errorMessage = Array.isArray(error.message)
          ? error.message.join(", ")
          : error.message || error.error || "Forbidden resource";
        const forbiddenError = new Error(`403: ${errorMessage}`) as Error & {
          status: number;
        };
        forbiddenError.status = 403;
        throw forbiddenError;
      }

      let errorMessage =
        error.error || `Failed to update team: ${response.statusText}`;
      if (Array.isArray(error.message)) {
        errorMessage = error.message.join(", ");
      } else if (error.message && typeof error.message === "string") {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Helper to normalize (reuse)
    const normalizeMember = (member: ApiTeamMember | string): User => {
      if (typeof member === "string") {
        return {
          id: member,
          name: "Unknown",
          email: "",
          role: {
            id: "",
            name: "",
            permissions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      return {
        id: String(member.id),
        name: member.name || "",
        email: member.email || "",
        avatar: member.avatar,
        role: {
          id: String(member.role?.id || ""),
          name: member.role?.name || "",
          permissions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    };

    const normalizeTeam = (team: ApiTeamResponse): Team => {
      return {
        id: String(team.id || team._id || ""),
        name: team.name || "",
        description: team.description || undefined,
        members: Array.isArray(team.members)
          ? team.members.map(normalizeMember)
          : [],
        leader: team.leader ? normalizeMember(team.leader) : undefined,
        createdAt:
          team.createdAt || team.created_at || new Date().toISOString(),
        updatedAt:
          team.updatedAt || team.updated_at || new Date().toISOString(),
      };
    };

    const rawTeam = data.data || data;
    return normalizeTeam(rawTeam);
  },

  // Delete team
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json().catch(() => ({}));
      console.error("Delete team API error:", error);

      // Handle 403 Forbidden
      if (response.status === 403) {
        const errorMessage = Array.isArray(error.message)
          ? error.message.join(", ")
          : error.message || error.error || "Forbidden resource";
        const forbiddenError = new Error(`403: ${errorMessage}`) as Error & {
          status: number;
        };
        forbiddenError.status = 403;
        throw forbiddenError;
      }

      let errorMessage =
        error.error || `Failed to delete team: ${response.statusText}`;
      if (Array.isArray(error.message)) {
        errorMessage = error.message.join(", ");
      } else if (error.message && typeof error.message === "string") {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
};
