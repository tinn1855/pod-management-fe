import { useState, useEffect, useCallback } from "react";
import { Content, ContentStatus } from "@/type/content";
import { contentService } from "@/lib/services/content.service";
import { toast } from "sonner";

interface UseContentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  platform?: string;
  designId?: string;
}

interface UseContentsReturn {
  contents: Content[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  createContent: (contentData: Partial<Content>) => Promise<Content | null>;
  updateContent: (
    id: string,
    contentData: Partial<Content>
  ) => Promise<Content | null>;
  updateContentStatus: (
    id: string,
    status: ContentStatus
  ) => Promise<Content | null>;
  deleteContent: (id: string) => Promise<boolean>;
}

export function useContents(params?: UseContentsParams): UseContentsReturn {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  const fetchContents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentService.getAll(params);
      setContents(response.data);
      setTotal(response.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch contents";
      setError(errorMessage);
      toast.error(errorMessage);
      setContents([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [
    params?.page,
    params?.limit,
    params?.search,
    params?.status,
    params?.platform,
    params?.designId,
  ]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const createContent = useCallback(
    async (contentData: Partial<Content>): Promise<Content | null> => {
      try {
        const newContent = await contentService.create(contentData);
        await fetchContents();
        toast.success("Content created successfully");
        return newContent;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create content";
        toast.error(errorMessage);
        return null;
      }
    },
    [fetchContents]
  );

  const updateContent = useCallback(
    async (
      id: string,
      contentData: Partial<Content>
    ): Promise<Content | null> => {
      try {
        const updatedContent = await contentService.update(id, contentData);
        await fetchContents();
        toast.success("Content updated successfully");
        return updatedContent;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update content";
        toast.error(errorMessage);
        return null;
      }
    },
    [fetchContents]
  );

  const updateContentStatus = useCallback(
    async (id: string, status: ContentStatus): Promise<Content | null> => {
      try {
        const updatedContent = await contentService.update(id, { status });
        await fetchContents();
        toast.success("Content status updated successfully");
        return updatedContent;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update content status";
        toast.error(errorMessage);
        return null;
      }
    },
    [fetchContents]
  );

  const deleteContent = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await contentService.delete(id);
        await fetchContents();
        toast.success("Content deleted successfully");
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete content";
        toast.error(errorMessage);
        return false;
      }
    },
    [fetchContents]
  );

  return {
    contents,
    loading,
    error,
    total,
    refetch: fetchContents,
    createContent,
    updateContent,
    updateContentStatus,
    deleteContent,
  };
}

