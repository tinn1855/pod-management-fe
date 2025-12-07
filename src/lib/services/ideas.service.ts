import Cookies from "js-cookie";
import { Idea, IdeaStatus, Priority } from "@/type/idea";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_URL_API || "https://pod-management.onrender.com/api";

const getAuthHeaders = (): HeadersInit => {
  const token = Cookies.get("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

// Helper to get API priority from string
const getApiPriority = (p: string): number => {
  const map: Record<string, number> = { low: 1, medium: 2, high: 3, urgent: 4 };
  return map[p.toLowerCase()] || 2;
};

// Helper to get frontend priority from number
const getFrontendPriority = (p: number): Priority => {
  const map: Record<number, Priority> = {
    1: "low",
    2: "medium",
    3: "high",
    4: "urgent",
    5: "urgent",
  };
  return map[p] || "medium";
};

// Normalize idea from API response
const normalizeIdea = (idea: any): Idea => {
  // Helper to safely lowercase status
  let status = idea.status ? String(idea.status).toLowerCase() : "new";
  // Map common variations if needed, or just ensure it's one of the valid types
  // If strictly enforcing types:
  const validStatuses: IdeaStatus[] = [
    "new",
    "check_design",
    "check_content",
    "done_idea",
    "fix_design",
    "done",
  ];
  if (!validStatuses.includes(status as IdeaStatus)) {
    // console.warn(`Unknown status: ${idea.status}, defaulting to 'new'`);
    status = "new";
  }

  return {
    id: String(idea.id || idea._id || ""),
    title: idea.title || "",
    description: idea.description || "",
    status: status as IdeaStatus,
    priority:
      typeof idea.priority === "number"
        ? getFrontendPriority(idea.priority)
        : (idea.priority as Priority) || "medium",
    references: Array.isArray(idea.references) ? idea.references : [],
    comments: Array.isArray(idea.comments) ? idea.comments : [],
    assignee: idea.assignee || undefined,
    createdBy: idea.createdBy ||
      idea.author || { id: "unknown", name: "Unknown" },
    tags: Array.isArray(idea.tags) ? idea.tags : [],
    deadline: idea.deadline || undefined,
    createdAt: idea.createdAt || new Date().toISOString(),
    updatedAt: idea.updatedAt || new Date().toISOString(),
  };
};

export const ideasService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
  }): Promise<PaginatedResponse<Idea>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status && params.status !== "all") {
      queryParams.append("status", params.status);
    }
    if (params?.priority && params.priority !== "all") {
      queryParams.append("priority", params.priority);
    }

    const url = `${API_BASE_URL}/ideas?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to fetch ideas: ${response.statusText}`
      );
    }

    const data = await response.json().catch(() => ({}));
    const totalCount =
      response.headers.get("X-Total-Count") ||
      response.headers.get("x-total-count");

    let ideasArray: Idea[] = [];
    let total = 0;

    if (data.meta && data.data && Array.isArray(data.data)) {
      ideasArray = data.data.map(normalizeIdea);
      total =
        data.meta.total ||
        (totalCount ? parseInt(totalCount) : ideasArray.length);
    } else if (data.data && Array.isArray(data.data)) {
      ideasArray = data.data.map(normalizeIdea);
      total =
        data.total ||
        data.count ||
        (totalCount ? parseInt(totalCount) : ideasArray.length);
    } else if (Array.isArray(data)) {
      ideasArray = data.map(normalizeIdea);
      total = totalCount ? parseInt(totalCount) : ideasArray.length;
    } else if (data.ideas && Array.isArray(data.ideas)) {
      // Handle { ideas: [...] } format just in case
      ideasArray = data.ideas.map(normalizeIdea);
      total =
        data.total ||
        data.count ||
        (totalCount ? parseInt(totalCount) : ideasArray.length);
    }

    return {
      data: ideasArray,
      total,
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
  },

  getById: async (id: string): Promise<Idea> => {
    const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to fetch idea: ${response.statusText}`
      );
    }

    const data = await response.json();
    return normalizeIdea(data);
  },

  create: async (ideaData: Partial<Idea>): Promise<Idea> => {
    const payload: any = { ...ideaData };

    // Transform objects to IDs for API
    if (ideaData.assignee && typeof ideaData.assignee === "object") {
      payload.assignee = ideaData.assignee.id;
    }

    // Remove createdBy to let backend infer from token
    if (payload.createdBy) {
      delete payload.createdBy;
    }

    // Remove unsupported fields
    if (payload.references) delete payload.references;
    if (payload.deadline) delete payload.deadline;

    // Transform status to uppercase
    if (payload.status) {
      payload.status = payload.status.toUpperCase();
    } else {
      payload.status = "NEW";
    }

    // Transform priority to number
    if (payload.priority) {
      payload.priority = getApiPriority(payload.priority);
    }

    const response = await fetch(`${API_BASE_URL}/ideas`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to create idea: ${response.statusText}`
      );
    }

    const data = await response.json();
    return normalizeIdea(data);
  },

  update: async (id: string, ideaData: Partial<Idea>): Promise<Idea> => {
    // Remove id and createdAt from payload if present
    const { id: _, createdAt: __, ...cleanData } = ideaData;
    const payload: any = { ...cleanData };

    // Transform objects to IDs for API
    if (ideaData.assignee && typeof ideaData.assignee === "object") {
      payload.assignee = ideaData.assignee.id;
    }

    // Remove unsupported fields
    if (payload.references) delete payload.references;
    if (payload.deadline) delete payload.deadline;

    // Transform status to uppercase
    if (payload.status) {
      payload.status = payload.status.toUpperCase();
    }

    // Transform priority to number
    if (payload.priority && typeof payload.priority === "string") {
      payload.priority = getApiPriority(payload.priority);
    }

    const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to update idea: ${response.statusText}`
      );
    }

    const data = await response.json();
    return normalizeIdea(data);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to delete idea: ${response.statusText}`
      );
    }
  },
};
