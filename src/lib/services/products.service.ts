import Cookies from "js-cookie";
import { Product } from "@/type/product";

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

// Helper to normalize category (handle both string and object)
const normalizeCategory = (category: any): string => {
  if (!category) return "uncategorized";
  if (typeof category === "string") return category;
  if (typeof category === "object") {
    // Handle object with {id, name} structure
    return (
      (category as { id?: string; name?: string })?.name ||
      (category as { id?: string; name?: string })?.id ||
      "uncategorized"
    );
  }
  return "uncategorized";
};

// Helper to normalize date (handle string, Date, or object)
const normalizeDate = (dateValue: any): string => {
  if (!dateValue) return new Date().toISOString();
  if (typeof dateValue === "string") return dateValue;
  if (dateValue instanceof Date) return dateValue.toISOString();
  if (typeof dateValue === "object") {
    // Handle object with date properties
    const dateStr =
      (dateValue as { date?: string; value?: string; updatedAt?: string })
        ?.date ||
      (dateValue as { date?: string; value?: string; updatedAt?: string })
        ?.value ||
      (dateValue as { date?: string; value?: string; updatedAt?: string })
        ?.updatedAt;
    if (dateStr) return dateStr;
  }
  return new Date().toISOString();
};

// Normalize product from API response
const normalizeProduct = (product: any): Product => {
  // Normalize category
  const category = normalizeCategory(product.category);

  // Normalize updatedAt
  const updatedAt = normalizeDate(product.updatedAt || product.updated_at);

  // Normalize thumbnail (ensure it's not empty string)
  const thumbnail = product.thumbnail || product.image || "";

  return {
    id: String(product.id || product._id || ""),
    thumbnail,
    name: product.name || "",
    sku: product.sku || undefined,
    category,
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    colors: Array.isArray(product.colors) ? product.colors : [],
    price: Number(product.price) || 0,
    variants: Array.isArray(product.variants)
      ? product.variants.map((v: any) => ({
          id: String(v.id || ""),
          size: v.size || "",
          color: v.color || "",
          price: Number(v.price) || 0,
          stock: v.stock !== undefined ? Number(v.stock) : undefined,
        }))
      : undefined,
    images: Array.isArray(product.images)
      ? product.images.map((img: any) => ({
          id: String(img.id || ""),
          url: img.url || "",
          alt: img.alt || undefined,
          isPrimary: img.isPrimary || false,
        }))
      : undefined,
    mockups: Array.isArray(product.mockups)
      ? product.mockups.map((m: any) => ({
          id: String(m.id || ""),
          url: m.url || "",
          name: m.name || "",
          type: m.type || undefined,
        }))
      : undefined,
    status:
      (product.status?.toLowerCase() as
        | "in stock"
        | "out of stock"
        | "discontinued") || "in stock",
    updatedAt,
    description: product.description || undefined,
  };
};

// Products Service
export const productsService = {
  // Get all products
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  }): Promise<PaginatedResponse<Product>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    // Handle category filter - support both ID and name
    if (params?.category && params.category !== "all") {
      queryParams.append("category", params.category);
    }
    if (params?.status && params.status !== "all") {
      queryParams.append("status", params.status);
    }

    const url = `${API_BASE_URL}/products${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to fetch products: ${response.statusText}`
      );
    }

    const data = await response.json().catch(() => ({}));

    // Handle different response formats
    let productsArray: Product[] = [];
    let total = 0;

    if (data.data && Array.isArray(data.data)) {
      productsArray = data.data.map(normalizeProduct);
      total =
        data.total || data.count || data.totalCount || productsArray.length;
    } else if (Array.isArray(data)) {
      productsArray = data.map(normalizeProduct);
      total = productsArray.length;
    } else if (data.products && Array.isArray(data.products)) {
      // Handle alternative response format
      productsArray = data.products.map(normalizeProduct);
      total = data.total || data.count || productsArray.length;
    }

    return {
      data: productsArray,
      total,
      page: data.page || params?.page || 1,
      limit: data.limit || params?.limit || 10,
    };
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to fetch product: ${response.statusText}`
      );
    }

    const data = await response.json();
    return normalizeProduct(data);
  },

  // Create product
  create: async (productData: Partial<Product>): Promise<Product> => {
    // Prepare data for API - ensure category is string
    const apiData = {
      ...productData,
      category: normalizeCategory(productData.category),
    };

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to create product: ${response.statusText}`
      );
    }

    const data = await response.json();
    return normalizeProduct(data);
  },

  // Update product
  update: async (
    id: string,
    productData: Partial<Product>
  ): Promise<Product> => {
    // Prepare data for API - ensure category is string if provided
    const apiData: Partial<Product> = { ...productData };
    if (productData.category !== undefined) {
      apiData.category = normalizeCategory(productData.category);
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to update product: ${response.statusText}`
      );
    }

    const data = await response.json();
    return normalizeProduct(data);
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to delete product: ${response.statusText}`
      );
    }
  },
};
