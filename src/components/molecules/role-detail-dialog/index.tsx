"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Role } from "@/type/user";
import { Check, Shield } from "lucide-react";

interface RoleDetailDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleDetailDialog({
  role,
  open,
  onOpenChange,
}: RoleDetailDialogProps) {
  if (!role) return null;

  // Group permissions by module
  const permissionsByModule = role.permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, typeof role.permissions>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Role Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Role Header */}
          <div className="flex items-center gap-4">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${role.color}20` }}
            >
              <Shield className="h-7 w-7" style={{ color: role.color }} />
            </div>
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                {role.name}
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: role.color }}
                />
              </h3>
              <p className="text-muted-foreground">
                {role.description || "No description"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Role Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Permissions</p>
              <p className="text-2xl font-bold">{role.permissions.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{role.createdAt}</p>
            </div>
          </div>

          <Separator />

          {/* Permissions by Module */}
          <div>
            <p className="text-sm text-muted-foreground mb-4">Permissions by Module</p>
            <div className="space-y-4">
              {Object.entries(permissionsByModule).map(([module, perms]) => (
                <div key={module} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="font-medium">{module}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {perms.length} permissions
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {perms.map((perm) => (
                      <div
                        key={perm.id}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{perm.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

