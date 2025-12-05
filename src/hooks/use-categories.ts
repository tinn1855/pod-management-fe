import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "@/type/category";
import { categoriesService } from "@/lib/services/categories.service";
import { toast } from "sonner";
import { useMemo } from "react";

interface UseCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export function useCategories(params?: UseCategoriesParams) {
  const queryClient = useQueryClient();
  const { enabled = true, ...queryParams } = params || {};

  const queryKey = useMemo(() => ["categories", queryParams], [queryParams]);

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => categoriesService.getAll(queryParams),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: (previousData) => previousData,
  });

  const categories = data?.data || [];
  const total = data?.total || 0;

  const createMutation = useMutation({
    mutationFn: categoriesService.create,
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to create category"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoriesService.update(id, data),
    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to update category"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesService.delete,
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    },
  });

  const createCategory = useMemo(
    () => createMutation.mutateAsync,
    [createMutation]
  );
  const updateCategory = useMemo(
    () => updateMutation.mutateAsync,
    [updateMutation]
  );
  const deleteCategory = useMemo(
    () => deleteMutation.mutateAsync,
    [deleteMutation]
  );

  return useMemo(
    () => ({
      categories,
      total,
      loading,
      error,
      createCategory,
      updateCategory,
      deleteCategory,
    }),
    [
      categories,
      total,
      loading,
      error,
      createCategory,
      updateCategory,
      deleteCategory,
    ]
  );
}
