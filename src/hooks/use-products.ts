import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/type/product";
import { productsService } from "@/lib/services/products.service";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";

interface UseProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  enabled?: boolean;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<any>;
  createProduct: (productData: Partial<Product>) => Promise<Product | null>;
  updateProduct: (
    id: string,
    productData: Partial<Product>
  ) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
}

export function useProducts(params?: UseProductsParams): UseProductsReturn {
  const queryClient = useQueryClient();
  const { enabled = true, ...queryParams } = params || {};

  // Query Key includes all params so it refetches when they change
  const queryKey = [
    "products",
    queryParams.page ?? 1,
    queryParams.limit ?? 10,
    queryParams.search ?? "",
    queryParams.category ?? "",
    queryParams.status ?? "",
  ];

  const {
    data,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => productsService.getAll(queryParams),
    // Keep previous data while fetching new data for better UX (no flicker)
    placeholderData: (previousData) => previousData,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const products = data?.data || [];
  const total = data?.total || 0;
  const error =
    queryError instanceof Error
      ? queryError.message
      : queryError
      ? String(queryError)
      : null;

  // Prefetch next page
  useEffect(() => {
    if (!data?.data || !queryParams.page || !queryParams.limit) return;

    const nextPage = queryParams.page + 1;
    const maxPages = Math.ceil(total / queryParams.limit);

    if (nextPage <= maxPages) {
      const nextQueryParams = { ...queryParams, page: nextPage };
      // Check if we already have this data in the cache to avoid unnecessary calls
      const existingData = queryClient.getQueryData([
        "products",
        nextQueryParams,
      ]);
      if (!existingData) {
        queryClient.prefetchQuery({
          queryKey: [
            "products",
            nextPage,
            queryParams.limit,
            queryParams.search,
            queryParams.category,
            queryParams.status,
          ],
          queryFn: () =>
            productsService.getAll({ ...queryParams, page: nextPage }),
        });
      }
    }
  }, [data, queryParams, queryClient, total]);

  // Mutation for creating product
  const createMutation = useMutation({
    mutationFn: (productData: Partial<Product>) =>
      productsService.create(productData),
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create product";
      toast.error(errorMessage);
    },
  });

  // Mutation for updating product
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productsService.update(id, data),
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update product";
      toast.error(errorMessage);
    },
  });

  // Mutation for deleting product
  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete product";
      toast.error(errorMessage);
    },
  });

  // Memoize create/update/delete functions to avoid unnecessary re-renders
  const createProduct = useMemo(
    () =>
      async (productData: Partial<Product>): Promise<Product | null> => {
        try {
          return await createMutation.mutateAsync(productData);
        } catch {
          return null;
        }
      },
    [createMutation]
  );

  const updateProduct = useMemo(
    () =>
      async (
        id: string,
        productData: Partial<Product>
      ): Promise<Product | null> => {
        try {
          return await updateMutation.mutateAsync({ id, data: productData });
        } catch {
          return null;
        }
      },
    [updateMutation]
  );

  const deleteProduct = useMemo(
    () =>
      async (id: string): Promise<boolean> => {
        try {
          await deleteMutation.mutateAsync(id);
          return true;
        } catch {
          return false;
        }
      },
    [deleteMutation]
  );

  // Memoize return value to prevent unnecessary re-renders in parent components
  return useMemo(
    () => ({
      products,
      loading,
      error,
      total,
      refetch,
      createProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      products,
      loading,
      error,
      total,
      refetch,
      createProduct,
      updateProduct,
      deleteProduct,
    ]
  );
}
