"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPermissionModules, mockRoles, mockPermissions } from "@/data/user";
import { Role, Permission, PermissionModule } from "@/type/user";
import { Check, Shield, X, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ROLE_BADGE_OUTLINE_VARIANTS } from "@/constants/badge-variants";
import { getColorClasses } from "@/constants";
import { cn } from "@/lib/utils";

export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const filteredModules = mockPermissionModules.filter(
    (module) =>
      module.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.permissions.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const hasPermission = (role: Role, permissionId: string) => {
    return role.permissions.some((p) => p.id === permissionId);
  };

  const togglePermission = (roleId: string, permission: Permission) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) return role;

        const hasP = hasPermission(role, permission.id);
        const newPermissions = hasP
          ? role.permissions.filter((p) => p.id !== permission.id)
          : [...role.permissions, permission];

        return { ...role, permissions: newPermissions };
      })
    );
    setHasChanges(true);
  };

  const toggleModulePermissions = (
    roleId: string,
    module: PermissionModule,
    checked: boolean
  ) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) return role;

        let newPermissions: Permission[];
        if (checked) {
          // Add all module permissions
          const existingIds = role.permissions.map((p) => p.id);
          const newModulePerms = module.permissions.filter(
            (p) => !existingIds.includes(p.id)
          );
          newPermissions = [...role.permissions, ...newModulePerms];
        } else {
          // Remove all module permissions
          const modulePermIds = module.permissions.map((p) => p.id);
          newPermissions = role.permissions.filter(
            (p) => !modulePermIds.includes(p.id)
          );
        }

        return { ...role, permissions: newPermissions };
      })
    );
    setHasChanges(true);
  };

  const getModuleStatus = (role: Role, module: PermissionModule) => {
    const modulePermIds = module.permissions.map((p) => p.id);
    const rolePermIds = role.permissions.map((p) => p.id);
    const selectedCount = modulePermIds.filter((id) =>
      rolePermIds.includes(id)
    ).length;

    if (selectedCount === 0) return "none";
    if (selectedCount === modulePermIds.length) return "all";
    return "partial";
  };

  const handleSave = () => {
    // Here you would typically save to an API
    toast.success("Permissions saved successfully!");
    setHasChanges(false);
  };

  const getRoleBadgeVariant = (roleName: string) => {
    const normalizedRole = roleName.toLowerCase();
    return ROLE_BADGE_OUTLINE_VARIANTS[normalizedRole] || "outline";
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Permission Editor</h1>
          <p className="text-muted-foreground">
            Manage role permissions across all modules
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>

      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList>
          <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
          <TabsTrigger value="by-role">By Role</TabsTrigger>
          <TabsTrigger value="by-module">By Module</TabsTrigger>
        </TabsList>

        {/* Permission Matrix View */}
        <TabsContent value="matrix" className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search modules or permissions..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] sticky left-0 bg-background">
                    Module / Permission
                  </TableHead>
                  {roles.map((role) => {
                    const colorClasses = getColorClasses(role.color);
                    return (
                      <TableHead
                        key={role.id}
                        className="text-center min-w-[120px]"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={cn("w-3 h-3 rounded-full", colorClasses.bg)}
                          />
                          <span>{role.name}</span>
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModules.map((module) => (
                  <>
                    {/* Module Row */}
                    <TableRow key={module.module} className="bg-muted/50">
                      <TableCell className="font-medium sticky left-0 bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          {module.module}
                        </div>
                      </TableCell>
                      {roles.map((role) => {
                        const status = getModuleStatus(role, module);
                        return (
                          <TableCell key={role.id} className="text-center">
                            <Checkbox
                              checked={status === "all"}
                              ref={(el) => {
                                if (el) {
                                  (
                                    el as HTMLButtonElement & {
                                      indeterminate: boolean;
                                    }
                                  ).indeterminate = status === "partial";
                                }
                              }}
                              onCheckedChange={(checked) =>
                                toggleModulePermissions(
                                  role.id,
                                  module,
                                  checked as boolean
                                )
                              }
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    {/* Permission Rows */}
                    {module.permissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className="pl-8 sticky left-0 bg-background">
                          <span className="text-sm text-muted-foreground">
                            {permission.actions.join(", ")}
                          </span>
                        </TableCell>
                        {roles.map((role) => (
                          <TableCell key={role.id} className="text-center">
                            <Checkbox
                              checked={hasPermission(role, permission.id)}
                              onCheckedChange={() =>
                                togglePermission(role.id, permission)
                              }
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* By Role View */}
        <TabsContent value="by-role" className="space-y-4">
          <div className="flex gap-2">
            <Select
              value={selectedRole?.id || ""}
              onValueChange={(value) =>
                setSelectedRole(roles.find((r) => r.id === value) || null)
              }
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a role to edit" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => {
                  const colorClasses = getColorClasses(role.color);
                  return (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn("w-3 h-3 rounded-full", colorClasses.bg)}
                        />
                        {role.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedRole ? (
            <div className="grid gap-4">
              {mockPermissionModules.map((module) => (
                <Card key={module.module}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        <CardTitle className="text-lg">{module.module}</CardTitle>
                      </div>
                      <Checkbox
                        checked={getModuleStatus(selectedRole, module) === "all"}
                        ref={(el) => {
                          if (el) {
                            (
                              el as HTMLButtonElement & {
                                indeterminate: boolean;
                              }
                            ).indeterminate =
                              getModuleStatus(selectedRole, module) === "partial";
                          }
                        }}
                        onCheckedChange={(checked) =>
                          toggleModulePermissions(
                            selectedRole.id,
                            module,
                            checked as boolean
                          )
                        }
                      />
                    </div>
                    <CardDescription>
                      {
                        selectedRole.permissions.filter((p) =>
                          module.permissions.some((mp) => mp.id === p.id)
                        ).length
                      }{" "}
                      of {module.permissions.length} permissions enabled
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {module.permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={hasPermission(selectedRole, permission.id)}
                            onCheckedChange={() =>
                              togglePermission(selectedRole.id, permission)
                            }
                          />
                          <label
                            htmlFor={permission.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.actions.join(", ")}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Select a role to view and edit its permissions
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* By Module View */}
        <TabsContent value="by-module" className="space-y-4">
          <div className="grid gap-4">
            {mockPermissionModules.map((module) => (
              <Card key={module.module}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <CardTitle className="text-lg">{module.module}</CardTitle>
                  </div>
                  <CardDescription>
                    {module.permissions.length} permissions in this module
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Permission</TableHead>
                        {roles.map((role) => (
                          <TableHead key={role.id} className="text-center">
                            <Badge variant={getRoleBadgeVariant(role.name)}>
                              {role.name}
                            </Badge>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {module.permissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell>
                            <div>
                              <span className="font-medium">
                                {permission.name}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </TableCell>
                          {roles.map((role) => (
                            <TableCell key={role.id} className="text-center">
                              {hasPermission(role, permission.id) ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
