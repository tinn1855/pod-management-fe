"use client";

import { Input } from "@/components/ui/input";
import { AppPagination } from "@/components/molecules/pagination";
import { RolesTable } from "@/components/molecules/role-table";
import { mockRoles, mockPermissions } from "@/data/user";
import { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CreateRoleDialog } from "@/components/molecules/role-create-dialog";
import { Role } from "@/type/user";
import { ITEMS_PER_PAGE } from "@/constants";

function RolesPageContent() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoles = useMemo(() => {
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [roles, searchQuery]);

  const totalPages = Math.ceil(filteredRoles.length / ITEMS_PER_PAGE);

  const paginatedRoles = useMemo(() => {
    return filteredRoles.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredRoles, currentPage]);

  const handleCreate = (
    newRole: Omit<Role, "id" | "createdAt" | "updatedAt">
  ) => {
    const role: Role = {
      ...newRole,
      id: `role-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setRoles((prev) => [role, ...prev]);
  };

  const handleEdit = (updatedRole: Role) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === updatedRole.id ? updatedRole : r))
    );
  };

  const handleDelete = (role: Role) => {
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Role Management</h1>
        <CreateRoleDialog
          permissions={mockPermissions}
          onSubmit={handleCreate}
        />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search roles..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {paginatedRoles.length} of {filteredRoles.length} roles
      </div>

      <RolesTable
        roles={paginatedRoles}
        permissions={mockPermissions}
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

export default function RolesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
      <RolesPageContent />
    </Suspense>
  );
}
