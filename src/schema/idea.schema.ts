import { z } from "zod";
import { PRIORITY_ORDER } from "@/type/idea";

export const ideaFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(PRIORITY_ORDER),
  assigneeId: z.string().optional(),
  tags: z.string().min(1, "Please enter at least one tag"),
  deadline: z.string().optional(),
});

export type IdeaFormValues = z.infer<typeof ideaFormSchema>;

// Schema for adding comments
export const ideaCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

export type IdeaCommentValues = z.infer<typeof ideaCommentSchema>;
