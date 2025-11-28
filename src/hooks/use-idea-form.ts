import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn } from "react-hook-form";
import { ideaFormSchema, IdeaFormValues } from "@/schema/idea.schema";

interface UseIdeaFormReturn {
  form: UseFormReturn<IdeaFormValues>;
  resetForm: () => void;
}

export function useIdeaForm(): UseIdeaFormReturn {
  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      assigneeId: undefined,
      tags: "",
      deadline: "",
    },
  });

  const resetForm = () => {
    form.reset({
      title: "",
      description: "",
      priority: "medium",
      assigneeId: undefined,
      tags: "",
      deadline: "",
    });
  };

  return {
    form,
    resetForm,
  };
}

