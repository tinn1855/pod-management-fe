import { z } from "zod";

export const teamFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  leaderId: z.string().optional(),
  memberIds: z.array(z.string()),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;
