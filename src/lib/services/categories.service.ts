import Cookies from "js-cookie";
import { Category } from "@/type/category";

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

interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface CategoriesResponse {
  data: Category[];
  total: number;
}

export const categoriesService = {
  getAll: async (params?: GetCategoriesParams): Promise<CategoriesResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const url = `${API_BASE_URL}/categories${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to fetch categories: ${response.statusText}`
      );
    }

    const data = await response.json();
    
    // Handle different response formats
    let categories: Category[] = [];
    let total = 0;

    if (Array.isArray(data)) {
      total = data.length;
      // If the API returns all items as an array, we manually paginate on the client
      if (params?.page && params?.limit) {
        const start = (params.page - 1) * params.limit;
        const end = start + params.limit;
        categories = data.slice(start, end);
      } else {
        categories = data;
      }
    } else if (data.data && Array.isArray(data.data)) {
      categories = data.data;
      total = data.total || data.count || categories.length;
    }

    return { data: categories, total };
  },

  create: async (category: Partial<Category>): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to create category: ${response.statusText}`
      );
    }

    return await response.json();
  },

  update: async (id: string, category: Partial<Category>): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to update category: ${response.statusText}`
      );
    }

    return await response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to delete category: ${response.statusText}`
      );
    }
  },
};
