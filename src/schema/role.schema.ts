import { z } from "zod";

export const roleFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  color: z.string().optional(),
  permissionIds: z.array(z.string()),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
