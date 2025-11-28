import { useState, useCallback } from "react";
import { IdeaReference } from "@/type/idea";
import { toast } from "sonner";

interface UseReferencesReturn {
  references: IdeaReference[];
  addReference: () => void;
  removeReference: (refId: string) => void;
  resetReferences: () => void;
}

export function useReferences(): UseReferencesReturn {
  const [references, setReferences] = useState<IdeaReference[]>([]);

  const addReference = useCallback(() => {
    toast.info("Reference upload feature coming soon", {
      description: "You can paste image URLs for now",
    });
  }, []);

  const removeReference = useCallback((refId: string) => {
    setReferences((prev) => prev.filter((r) => r.id !== refId));
  }, []);

  const resetReferences = useCallback(() => {
    setReferences([]);
  }, []);

  return {
    references,
    addReference,
    removeReference,
    resetReferences,
  };
}

