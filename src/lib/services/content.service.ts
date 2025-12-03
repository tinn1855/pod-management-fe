import Cookies from "js-cookie";
import { Content } from "@/type/content";

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
  }

  return headers;
};

// API Response types
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

// Normalize content from API response
const normalizeContent = (content: any): Content => {
  return {
    id: String(content.id || content._id || ""),
    title: content.title || "",
    description: content.description || "",
    status: (content.status?.toLowerCase() as Content["status"]) || "new",
    platform: (content.platform?.toLowerCase() as Content["platform"]) || "other",
    platforms: Array.isArray(content.platforms)
      ? content.platforms.map((p: string) => p.toLowerCase() as Content["platform"])
      : undefined,
    designId: content.designId || content.design_id || undefined,
    design: content.design && (content.design.id || content.design._id) 
      ? normalizeDesign(content.design) 
      : undefined,
    listingId: content.listingId || content.listing_id || undefined,
    crawledListingId: content.crawledListingId || content.crawled_listing_id || undefined,
    crawledFrom: content.crawledFrom
      ? (content.crawledFrom.toLowerCase() as Content["platform"])
      : undefined,
    tags: Array.isArray(content.tags) ? content.tags : [],
    mockups: Array.isArray(content.mockups)
      ? content.mockups.map((m: any) => ({
          id: String(m.id || ""),
          url: m.url || "",
          name: m.name || "",
          type: (m.type as "image" | "video") || "image",
        }))
      : [],
    video: content.video || undefined,
    metadata: {
      seoTitle: content.metadata?.seoTitle || content.seo_title || undefined,
      seoDescription:
        content.metadata?.seoDescription || content.seo_description || undefined,
      keywords: (() => {
        const keywordsData = content.metadata?.keywords || content.keywords;
        if (Array.isArray(keywordsData)) {
          return keywordsData;
        }
        if (typeof keywordsData === 'string') {
          return keywordsData.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);
        }
        return undefined;
      })(),
      category: content.metadata?.category || content.category || undefined,
      priceRange:
        content.metadata?.priceRange || content.price_range
          ? {
              min:
                content.metadata?.priceRange?.min ||
                content.price_range?.min ||
                0,
              max:
                content.metadata?.priceRange?.max ||
                content.price_range?.max ||
                0,
            }
          : undefined,
    },
    autoPostEnabled: content.autoPostEnabled || content.auto_post_enabled || false,
    createdBy: normalizeUser(content.createdBy),
    assignedTo: content.assignedTo ? normalizeUser(content.assignedTo) : undefined,
    createdAt: content.createdAt || content.created_at || new Date().toISOString(),
    updatedAt: content.updatedAt || content.updated_at || new Date().toISOString(),
    listedAt: content.listedAt || content.listed_at || undefined,
    platformListings: Array.isArray(content.platformListings)
      ? content.platformListings.map((pl: any) => ({
          platform: (pl.platform?.toLowerCase() as Content["platform"]) || "other",
          listingId: pl.listingId || pl.listing_id || undefined,
          listedAt: pl.listedAt || pl.listed_at || undefined,
          autoPosted: pl.autoPosted || pl.auto_posted || false,
          extensionName: pl.extensionName || pl.extension_name || undefined,
        }))
      : undefined,
  };
};

// Helper to normalize user (simplified)
const normalizeUser = (user: any): any => {
  if (!user) {
    return {
      id: "",
      name: "Unknown",
      email: "",
      avatar: undefined,
      role: {
        id: "",
        name: "USER",
        description: undefined,
      },
    };
  }
  
  return {
    id: String(user.id || user._id || ""),
    name: user.name || "Unknown",
    email: user.email || "",
    avatar: user.avatar || undefined,
    role: user.role
      ? {
          id: String(user.role.id || ""),
          name: user.role.name || "USER",
          description: user.role.description || undefined,
        }
      : {
          id: "",
          name: "USER",
          description: undefined,
        },
  };
};

// Helper to normalize design (simplified)
const normalizeDesign = (design: any): any => {
  if (!design || !design.id) {
    return undefined;
  }
  return {
    id: String(design.id || ""),
    title: design.title || "",
    description: design.description || undefined,
  };
};

// Content Service
export const contentService = {
  // Get all contents
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    platform?: string;
    designId?: string;
  }): Promise<PaginatedResponse<Content>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.platform) queryParams.append("platform", params.platform);
    if (params?.designId) queryParams.append("designId", params.designId);

    const url = `${API_BASE_URL}/content${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to fetch contents: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Handle different response formats
    let contentsArray: Content[] = [];
    let total = 0;

    if (data.data && Array.isArray(data.data)) {
      contentsArray = data.data.map(normalizeContent);
      total = data.total || data.count || contentsArray.length;
    } else if (Array.isArray(data)) {
      contentsArray = data.map(normalizeContent);
      total = contentsArray.length;
    }

    return {
      data: contentsArray,
      total,
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
  },

  // Get content by ID
  getById: async (id: string): Promise<Content> => {
    const response = await fetch(`${API_BASE_URL}/content/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to fetch content: ${response.statusText}`
      );
    }

    const data = await response.json();
    return normalizeContent(data);
  },

  // Create content
  create: async (contentData: Partial<Content>): Promise<Content> => {
    const response = await fetch(`${API_BASE_URL}/content`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(contentData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to create content: ${response.statusText}`
      );
    }

    const data = await response.json();
    return normalizeContent(data);
  },

  // Update content
  update: async (id: string, contentData: Partial<Content>): Promise<Content> => {
    const response = await fetch(`${API_BASE_URL}/content/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(contentData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to update content: ${response.statusText}`
      );
    }

    const data = await response.json();
    return normalizeContent(data);
  },

  // Delete content
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/content/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to delete content: ${response.statusText}`
      );
    }
  },
};

