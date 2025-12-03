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
import { SquarePen, Trash2 } from "lucide-react";
import { User, Role, Team } from "@/type/user";
import { useState } from "react";
import { EditUserDialog } from "../user-edit-dialog";
import { UserDetailDialog } from "../user-detail-dialog";
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
import {
  ROLE_BADGE_OUTLINE_VARIANTS,
  USER_STATUS_BADGE_VARIANTS,
} from "@/constants/badge-variants";

interface UsersTableProps {
  users: User[];
  roles: Role[];
  teams: Team[];
  rolesLoading?: boolean;
  teamsLoading?: boolean;
  onEditOpen?: () => void;
  onEdit?: (
    id: string,
    userData: {
      name?: string;
      email?: string;
      roleId?: string;
      teamId?: string | null;
      status?: "active" | "inactive" | "pending";
    }
  ) => Promise<void>;
  onDelete?: (user: User) => Promise<void>;
}

function getRoleBadgeVariant(roleName: string) {
  const normalizedRole = roleName.toLowerCase();
  return ROLE_BADGE_OUTLINE_VARIANTS[normalizedRole] || "outline";
}

export function UsersTable({
  users,
  roles,
  teams,
  rolesLoading = false,
  teamsLoading = false,
  onEditOpen,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  function handleEditClick(user: User): void {
    setEditingUser(user);
    if (onEditOpen) {
      onEditOpen();
    }
  }

  function handleEditDialogOpenChange(open: boolean): void {
    if (!open) {
      setEditingUser(null);
    }
  }

  async function handleUserUpdate(
    id: string,
    userData: {
      name?: string;
      email?: string;
      roleId?: string;
      teamId?: string | null;
      status?: "active" | "inactive" | "pending";
    }
  ): Promise<void> {
    try {
      await onEdit?.(id, userData);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user in table:", error);
    }
  }

  async function handleUserDelete(user: User): Promise<void> {
    if (onDelete) {
      await onDelete(user);
    }
  }

  function handleViewDetail(user: User): void {
    setViewingUser(user);
  }

  function handleViewDialogOpenChange(open: boolean): void {
    if (!open) {
      setViewingUser(null);
    }
  }

  function handleEditButtonClick(event: React.MouseEvent, user: User): void {
    event.stopPropagation();
    handleEditClick(user);
  }

  function handleAlertDialogClick(event: React.MouseEvent): void {
    event.stopPropagation();
  }

  function handleDeleteConfirm(event: React.MouseEvent, user: User): void {
    event.stopPropagation();
    handleUserDelete(user);
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.map((user, index) => (
            <TableRow
              key={user.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleViewDetail(user)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <span className="font-medium">{user.name}</span>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role.name)}>
                  {user.role.name}
                </Badge>
              </TableCell>
              <TableCell>{user.team?.name || "-"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    USER_STATUS_BADGE_VARIANTS[user.status] || "secondary"
                  }
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={(e) => handleEditButtonClick(e, user)}
                  >
                    <SquarePen />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger
                      asChild
                      onClick={handleAlertDialogClick}
                    >
                      <Button
                        size="icon"
                        variant="outline"
                        className="text-destructive"
                      >
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={handleAlertDialogClick}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete{" "}
                          <span className="font-medium">{user.name}?</span> This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={(e) => handleDeleteConfirm(e, user)}
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

      <EditUserDialog
        user={editingUser || undefined}
        roles={roles}
        teams={teams}
        rolesLoading={rolesLoading}
        teamsLoading={teamsLoading}
        open={!!editingUser}
        onOpenChange={handleEditDialogOpenChange}
        onUpdate={handleUserUpdate}
      />

      <UserDetailDialog
        user={viewingUser}
        open={!!viewingUser}
        onOpenChange={handleViewDialogOpenChange}
      />
    </>
  );
}
