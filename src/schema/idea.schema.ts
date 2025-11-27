import { z } from "zod";

export const ideaFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assigneeId: z.string().optional(),
  tags: z.string().min(1, "Please enter at least one tag"),
});

export type IdeaFormValues = z.infer<typeof ideaFormSchema>;
