"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Role, Permission } from "@/type/user";

const roleFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  color: z.string().optional(),
  permissionIds: z.array(z.string()),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface EditRoleDialogProps {
  role?: Role;
  permissions: Permission[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (role: Role) => void;
}

const colorOptions = [
  { name: "Red", value: "red" },
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Purple", value: "purple" },
  { name: "Orange", value: "orange" },
  { name: "Gray", value: "gray" },
];

export function EditRoleDialog({
  role,
  permissions,
  open,
  onOpenChange,
  onUpdate,
}: EditRoleDialogProps) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "blue",
      permissionIds: [],
    },
  });

  const selectedPermissionIds = form.watch("permissionIds");

  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description || "",
        color: role.color || "blue",
        permissionIds: role.permissions.map((p) => p.id),
      });
    }
  }, [role, form]);

  const handleSubmit = (values: RoleFormValues) => {
    if (!role) return;

    const selectedPermissions = permissions.filter((p) =>
      values.permissionIds.includes(p.id)
    );

    onUpdate({
      ...role,
      name: values.name,
      description: values.description,
      color: values.color,
      permissions: selectedPermissions,
      updatedAt: new Date().toISOString().split("T")[0],
    });

    onOpenChange(false);
  };

  const toggleModule = (module: string, checked: boolean) => {
    const modulePermissionIds = permissionsByModule[module].map((p) => p.id);
    const currentIds = form.getValues("permissionIds");

    if (checked) {
      form.setValue("permissionIds", [
        ...new Set([...currentIds, ...modulePermissionIds]),
      ]);
    } else {
      form.setValue(
        "permissionIds",
        currentIds.filter((id) => !modulePermissionIds.includes(id))
      );
    }
  };

  const isModuleSelected = (module: string) => {
    const modulePermissionIds = permissionsByModule[module].map((p) => p.id);
    return modulePermissionIds.every((id) => selectedPermissionIds.includes(id));
  };

  const isModulePartiallySelected = (module: string) => {
    const modulePermissionIds = permissionsByModule[module].map((p) => p.id);
    const selectedCount = modulePermissionIds.filter((id) =>
      selectedPermissionIds.includes(id)
    ).length;
    return selectedCount > 0 && selectedCount < modulePermissionIds.length;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update role information and permissions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <div className="flex gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            field.value === color.value
                              ? "border-foreground scale-110"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => field.onChange(color.value)}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the role..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permission Selection */}
            <FormField
              control={form.control}
              name="permissionIds"
              render={() => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <div className="border rounded-md p-4 space-y-4">
                    {Object.entries(permissionsByModule).map(([module, modulePerms]) => (
                      <div key={module} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={isModuleSelected(module)}
                            ref={(el) => {
                              if (el) {
                                (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate =
                                  isModulePartiallySelected(module);
                              }
                            }}
                            onCheckedChange={(checked) =>
                              toggleModule(module, checked as boolean)
                            }
                          />
                          <span className="font-medium flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            {module}
                          </span>
                        </div>
                        <div className="ml-6 grid grid-cols-2 gap-2">
                          {modulePerms.map((permission) => (
                            <FormField
                              key={permission.id}
                              control={form.control}
                              name="permissionIds"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(permission.id)}
                                      onCheckedChange={(checked) => {
                                        const value = field.value || [];
                                        if (checked) {
                                          field.onChange([...value, permission.id]);
                                        } else {
                                          field.onChange(
                                            value.filter((id) => id !== permission.id)
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <span className="text-sm">
                                    {permission.actions.join(", ")}
                                  </span>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedPermissionIds.length} permission(s) selected
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

