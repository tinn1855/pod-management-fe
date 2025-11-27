"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, SquarePen, Trash2 } from "lucide-react";
import { Role, Permission } from "@/type/user";
import { useState } from "react";
import { EditRoleDialog } from "../role-edit-dialog";
import { RoleDetailDialog } from "../role-detail-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ROLE_BADGE_OUTLINE_VARIANTS } from "@/constants/badge-variants";

interface RolesTableProps {
  roles: Role[];
  permissions: Permission[];
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
}

export function RolesTable({
  roles,
  permissions,
  onEdit,
  onDelete,
}: RolesTableProps) {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [viewingRole, setViewingRole] = useState<Role | null>(null);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
  };

  const handleUpdate = (updatedRole: Role) => {
    onEdit?.(updatedRole);
    setEditingRole(null);
  };

  const handleViewDetail = (role: Role) => {
    setViewingRole(role);
  };

  const getRoleBadgeVariant = (roleName: string) => {
    const normalizedRole = roleName.toLowerCase();
    return ROLE_BADGE_OUTLINE_VARIANTS[normalizedRole] || "outline";
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Role Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {roles?.map((role, index) => (
            <TableRow
              key={role.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleViewDetail(role)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={getRoleBadgeVariant(role.name)}
                    className="h-9 w-9 rounded-full p-0 flex items-center justify-center"
                  >
                    <Shield className="h-4 w-4" />
                  </Badge>
                  <span className="font-medium">{role.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground max-w-[200px] truncate">
                {role.description || "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {role.permissions.length} permissions
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {role.createdAt}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(role);
                    }}
                  >
                    <SquarePen size={16} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button size="icon" variant="outline" className="text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Role</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{role.name}&quot;? Users with
                          this role will need to be reassigned.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => onDelete?.(role)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditRoleDialog
        role={editingRole || undefined}
        permissions={permissions}
        open={!!editingRole}
        onOpenChange={(open) => !open && setEditingRole(null)}
        onUpdate={handleUpdate}
      />

      <RoleDetailDialog
        role={viewingRole}
        open={!!viewingRole}
        onOpenChange={(open) => !open && setViewingRole(null)}
      />
    </>
  );
}
