"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppPagination } from "@/components/molecules/pagination";
import { UsersTable } from "@/components/molecules/user-table";
import { useState, Suspense, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CreateUserDialog } from "@/components/molecules/user-create-dialog";
import { User } from "@/type/user";
import { ITEMS_PER_PAGE } from "@/constants";
import { useUsers } from "@/hooks/use-users";
import { useRoles } from "@/hooks/use-roles";
import { useTeams } from "@/hooks/use-teams";
import { Loader2 } from "lucide-react";

export default function UsersPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // State to control when to load roles and teams
  const [shouldLoadRolesAndTeams, setShouldLoadRolesAndTeams] = useState(false);

  // Debounce search query - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Use API hooks - roles and teams only load when needed
  const { roles, loading: rolesLoading } = useRoles(shouldLoadRolesAndTeams);
  const { teams, loading: teamsLoading } = useTeams(shouldLoadRolesAndTeams);
  const {
    users,
    loading,
    error,
    total,
    createUser: apiCreateUser,
    updateUser: apiUpdateUser,
    deleteUser: apiDeleteUser,
  } = useUsers({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    roleId: roleFilter !== "all" ? roleFilter : undefined,
  });

  // Trigger roles and teams loading when create dialog is opened
  function handleOpenCreateDialog(): void {
    setShouldLoadRolesAndTeams(true);
  }

  const filteredUsers = useMemo(() => {
    if (
      statusFilter === "all" &&
      roleFilter === "all" &&
      !debouncedSearchQuery
    ) {
      return users;
    }
    return users.filter((user) => {
      const matchesSearch =
        !debouncedSearchQuery ||
        (user.name?.toLowerCase() || "").includes(
          debouncedSearchQuery.toLowerCase()
        ) ||
        (user.email?.toLowerCase() || "").includes(
          debouncedSearchQuery.toLowerCase()
        );
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesRole =
        roleFilter === "all" || (user.role?.id && user.role.id === roleFilter);
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, debouncedSearchQuery, statusFilter, roleFilter]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredUsers, currentPage]);

  async function handleCreateUser(newUser: {
    name: string;
    email: string;
    password: string;
    roleId: string;
    teamId?: string;
    status: "active" | "inactive" | "pending";
  }): Promise<void> {
    try {
      await apiCreateUser(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      // Error is already handled in the hook
    }
  }

  async function handleEditUser(
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
      await apiUpdateUser(id, userData);
    } catch (error) {
      console.error("Error updating user:", error);
      // Error is already handled in the hook
    }
  }

  async function handleDeleteUser(user: User): Promise<void> {
    try {
      await apiDeleteUser(user.id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  function handleStatusFilterChange(value: string): void {
    setStatusFilter(value);
  }

  function handleRoleFilterChange(value: string): void {
    setRoleFilter(value);
  }

  function handleSearchQueryChange(value: string): void {
    setSearchQuery(value);
  }

  if (loading && users.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Loading users...</p>
        </div>
      </section>
    );
  }

  if (error && users.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <CreateUserDialog
          roles={roles}
          teams={teams}
          rolesLoading={rolesLoading}
          teamsLoading={teamsLoading}
          onOpen={handleOpenCreateDialog}
          onSubmit={handleCreateUser}
        />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search users..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => handleSearchQueryChange(e.target.value)}
        />
        <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id || role.name} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {paginatedUsers.length} of {total} users
      </div>

      <UsersTable
        users={paginatedUsers}
        roles={roles}
        teams={teams}
        rolesLoading={rolesLoading}
        teamsLoading={teamsLoading}
        onEditOpen={handleOpenCreateDialog}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {totalPages > 1 && (
        <Suspense fallback={<div>Loading...</div>}>
          <AppPagination totalPages={totalPages} />
        </Suspense>
      )}
    </section>
  );
}
