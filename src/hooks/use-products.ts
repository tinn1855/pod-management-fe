import { useState, useEffect, useCallback } from "react";
import { Product } from "@/type/product";
import { productsService } from "@/lib/services/products.service";
import { toast } from "sonner";

interface UseProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  createProduct: (productData: Partial<Product>) => Promise<Product | null>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
}

export function useProducts(params?: UseProductsParams): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsService.getAll(params);
      setProducts(response.data);
      setTotal(response.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
      toast.error(errorMessage);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit, params?.search, params?.category, params?.status]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = useCallback(
    async (productData: Partial<Product>): Promise<Product | null> => {
      try {
        const newProduct = await productsService.create(productData);
        await fetchProducts();
        toast.success("Product created successfully");
        return newProduct;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create product";
        toast.error(errorMessage);
        return null;
      }
    },
    [fetchProducts]
  );

  const updateProduct = useCallback(
    async (id: string, productData: Partial<Product>): Promise<Product | null> => {
      try {
        const updatedProduct = await productsService.update(id, productData);
        await fetchProducts();
        toast.success("Product updated successfully");
        return updatedProduct;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update product";
        toast.error(errorMessage);
        return null;
      }
    },
    [fetchProducts]
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await productsService.delete(id);
        await fetchProducts();
        toast.success("Product deleted successfully");
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete product";
        toast.error(errorMessage);
        return false;
      }
    },
    [fetchProducts]
  );

  return {
    products,
    loading,
    error,
    total,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

