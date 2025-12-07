import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ideasService } from "@/lib/services/ideas.service";
import { Idea, IdeaStatus } from "@/type/idea";
import { toast } from "sonner";

// Types
interface UpdateStatusParams {
  id: string;
  newStatus: IdeaStatus;
}

interface MutationContext {
  previousData: Array<[string[], any]>; // Store [queryKey, data] pairs
}

// Global map to track pending debounced updates per Idea ID
// We use a global/module-level map so that even if the hook re-renders, the debounce persists.
// In a real large app, you might want this in a Context or Singleton service, but this works for hooks.
const pendingUpdates = new Map<
  string,
  {
    timeout: NodeJS.Timeout;
    resolve: (value: any) => void;
  }
>();

/**
 * Custom hook for optimistic, debounced idea status updates
 */
export function useIdeaStatusUpdate() {
  const queryClient = useQueryClient();

  const {
    mutate: updateStatus,
    isPending: isLoading,
    error,
  } = useMutation<
    Idea | { skipped: boolean },
    Error,
    UpdateStatusParams,
    MutationContext
  >({
    // 1. The Mutation Function with Debounce
    mutationFn: async ({ id, newStatus }) => {
      // Return a promise that handles the debounce logic
      return new Promise((resolve, reject) => {
        // If there's a pending update for this ID, cancel it
        if (pendingUpdates.has(id)) {
          const pending = pendingUpdates.get(id)!;
          clearTimeout(pending.timeout);
          // Resolve the previous promise as "skipped" so React Query considers it a success
          // This prevents the previous mutation from triggering onError (rollback)
          pending.resolve({ skipped: true });
        }

        // Set a new timeout for the API call
        const timeout = setTimeout(async () => {
          pendingUpdates.delete(id);
          try {
            // Perform the actual API call
            const result = await ideasService.update(id, { status: newStatus });
            resolve(result);
          } catch (err) {
            reject(err);
          }
        }, 300); // 300ms debounce

        // Store the new pending update
        pendingUpdates.set(id, { timeout, resolve });
      });
    },

    // 2. Optimistic Update (runs immediately)
    onMutate: async ({ id, newStatus }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["ideas"] });

      // Snapshot the previous value
      // We get ALL queries that match the 'ideas' key (e.g., different filters/pages)
      const previousData = queryClient.getQueriesData({ queryKey: ["ideas"] });

      // Optimistically update to the new value
      queryClient.setQueriesData({ queryKey: ["ideas"] }, (old: any) => {
        if (!old) return old;

        // Handle PaginatedResponse format ({ data: Idea[], total: number, ... })
        if (old.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((idea: Idea) =>
              idea.id === id
                ? {
                    ...idea,
                    status: newStatus,
                    updatedAt: new Date().toISOString(),
                  }
                : idea
            ),
          };
        }

        // Handle direct array format if used anywhere
        if (Array.isArray(old)) {
          return old.map((idea: Idea) =>
            idea.id === id
              ? {
                  ...idea,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                }
              : idea
          );
        }

        return old;
      });

      // Return context with previous data for rollback
      return { previousData };
    },

    // 3. Error Handling (Rollback)
    onError: (err, variables, context) => {
      toast.error("Failed to update status");
      // If the mutation fails, rollback to the previous state using the context
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // 4. Success / Settle
    onSettled: (data, error, variables) => {
      // We only invalidate if the request actually completed (wasn't skipped)
      // and wasn't an error.
      // 'data' might be { skipped: true } from our debounce logic.
      const wasSkipped = data && "skipped" in data && data.skipped;

      if (!wasSkipped && !error) {
        // Invalidate to refetch fresh data from server eventually
        // We can use a delay or just let the next focus trigger refetch
        // For smooth Kanban, we might NOT want to invalidate immediately to avoid jumps
        // queryClient.invalidateQueries({ queryKey: ["ideas"] });
        // Only invalidate if we want to ensure server consistency
        // For now, let's trust our optimistic update and only invalidate on error
      }
    },
  });

  return {
    updateStatus: (id: string, newStatus: IdeaStatus) =>
      updateStatus({ id, newStatus }),
    loading: isLoading,
    error,
  };
}
