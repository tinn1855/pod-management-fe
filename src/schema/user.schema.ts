import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.string().min(1, "Please select a role"),
  teamId: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
});

export const userEditFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(), // Optional for edit
  roleId: z.string().min(1, "Please select a role"),
  teamId: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
export type UserEditFormValues = z.infer<typeof userEditFormSchema>;
