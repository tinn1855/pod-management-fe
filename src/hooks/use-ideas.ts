import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Idea } from "@/type/idea";
import { ideasService } from "@/lib/services/ideas.service";
import { toast } from "sonner";
import { useMemo } from "react";

interface UseIdeasParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  enabled?: boolean;
}

export function useIdeas(params?: UseIdeasParams) {
  const queryClient = useQueryClient();
  const { enabled = true, ...queryParams } = params || {};

  const queryKey = useMemo(() => ["ideas", queryParams], [queryParams]);

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => ideasService.getAll(queryParams),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: (previousData) => previousData,
  });

  const ideas = data?.data || [];
  const total = data?.total || 0;

  const createMutation = useMutation({
    mutationFn: ideasService.create,
    onSuccess: () => {
      toast.success("Idea created successfully");
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create idea");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Idea> }) =>
      ideasService.update(id, data),
    onSuccess: () => {
      toast.success("Idea updated successfully");
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update idea");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ideasService.delete,
    onSuccess: () => {
      toast.success("Idea deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete idea");
    },
  });

  const createIdea = useMemo(
    () => createMutation.mutateAsync,
    [createMutation]
  );
  const updateIdea = useMemo(
    () => (id: string, data: Partial<Idea>) =>
      updateMutation.mutateAsync({ id, data }),
    [updateMutation]
  );
  const deleteIdea = useMemo(
    () => deleteMutation.mutateAsync,
    [deleteMutation]
  );

  return useMemo(
    () => ({
      ideas,
      total,
      loading,
      error,
      createIdea,
      updateIdea,
      deleteIdea,
    }),
    [ideas, total, loading, error, createIdea, updateIdea, deleteIdea]
  );
}
