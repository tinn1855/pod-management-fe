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
import { mockUsers, mockRoles, mockTeams } from "@/data/user";
import { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CreateUserDialog } from "@/components/molecules/user-create-dialog";
import { User } from "@/type/user";
import { ITEMS_PER_PAGE } from "@/constants";

export default function UsersPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role.id === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredUsers, currentPage]);

  const handleCreate = (
    newUser: Omit<User, "id" | "createdAt" | "updatedAt">
  ) => {
    const user: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [user, ...prev]);
  };

  const handleEdit = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const handleDelete = (user: User) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <CreateUserDialog
          roles={mockRoles}
          teams={mockTeams}
          onSubmit={handleCreate}
        />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search users..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {mockRoles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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
        Showing {paginatedUsers.length} of {filteredUsers.length} users
      </div>

      <UsersTable
        users={paginatedUsers}
        roles={mockRoles}
        teams={mockTeams}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {totalPages > 1 && (
        <Suspense fallback={<div>Loading...</div>}>
          <AppPagination totalPages={totalPages} />
        </Suspense>
      )}
    </section>
  );
}
