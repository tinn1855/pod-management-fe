import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  avatar: z.string().optional(),
  roleId: z.string().min(1, "Please select a role"),
  teamId: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
