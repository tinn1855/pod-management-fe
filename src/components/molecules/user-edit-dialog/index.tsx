"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Role, Team } from "@/type/user";
import { userEditFormSchema, UserEditFormValues } from "@/schema/user.schema";
import { Spinner } from "@/components/ui/spinner";

interface EditUserDialogProps {
  user?: User;
  roles: Role[];
  teams: Team[];
  rolesLoading?: boolean;
  teamsLoading?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (
    id: string,
    userData: {
      name?: string;
      email?: string;
      password?: string;
      roleId?: string;
      teamId?: string | null;
      status?: "active" | "inactive" | "pending";
    }
  ) => Promise<void>;
}

export function EditUserDialog({
  user,
  roles,
  teams,
  rolesLoading = false,
  teamsLoading = false,
  open,
  onOpenChange,
  onUpdate,
}: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserEditFormValues>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: "",
      teamId: undefined,
      status: "pending",
    },
  });

  useEffect(() => {
    if (user) {
      const normalizeStatus = (
        status: string
      ): "active" | "inactive" | "pending" => {
        if (!status) return "pending";
        const normalized = status.toLowerCase();
        // Handle SUSPENDING from API
        if (normalized === "suspending") return "inactive";
        if (
          normalized === "pending" ||
          normalized === "active" ||
          normalized === "inactive"
        ) {
          return normalized as "active" | "inactive" | "pending";
        }
        return "pending"; // default
      };

      // Normalize roleId - ensure it's a string (handle both number and string from API)
      const roleId = user.role?.id ? String(user.role.id) : "";

      // Normalize teamId - ensure it's a string or undefined (handle both number and string from API)
      const teamId = user.team?.id ? String(user.team.id) : undefined;

      form.reset({
        name: user.name || "",
        email: user.email || "",
        password: "", // Don't show password in edit
        roleId: roleId,
        teamId: teamId || undefined,
        status: normalizeStatus(user.status || "pending"),
      });
    }
  }, [user, form]);

  const handleSubmit = async (values: UserEditFormValues) => {
    if (!user) {
      console.error("No user provided to edit");
      return;
    }

    try {
      setIsSubmitting(true);
      const updateData: {
        name?: string;
        email?: string;
        password?: string;
        roleId?: string;
        teamId?: string | null;
        status?: "active" | "inactive" | "pending";
      } = {
        name: values.name,
        email: values.email,
        roleId: values.roleId,
        teamId: values.teamId || null,
        status: values.status,
      };

      // Only include password if it's provided (not empty)
      if (values.password && values.password.trim() !== "") {
        updateData.password = values.password;
      }

      await onUpdate(user.id, updateData);

      onOpenChange(false);
    } catch (error) {
      console.error("Error updating user:", error);
      // Don't close dialog on error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information. Make changes and click save.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Leave blank to keep current password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rolesLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <Spinner />
                          </div>
                        ) : roles.length === 0 ? (
                          <div className="py-4 text-center text-sm text-muted-foreground">
                            No roles available
                          </div>
                        ) : (
                          roles.map((role) => (
                            <SelectItem
                              key={role.id || role.name}
                              value={role.id}
                            >
                              {role.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => {
                  // Ensure value is string and handle undefined/empty
                  const currentValue = field.value
                    ? String(field.value)
                    : "none";

                  return (
                    <FormItem>
                      <FormLabel>Team (Optional)</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value === "none" ? undefined : value);
                        }}
                        value={currentValue}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No Team</SelectItem>
                          {teamsLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <Spinner />
                            </div>
                          ) : teams.length === 0 ? (
                            <div className="py-4 text-center text-sm text-muted-foreground">
                              No teams available
                            </div>
                          ) : (
                            teams.map((team) => (
                              <SelectItem
                                key={String(team.id) || team.name}
                                value={String(team.id)}
                              >
                                {team.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "pending"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  rolesLoading ||
                  teamsLoading ||
                  roles.length === 0
                }
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
