"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { AppPagination } from "@/components/molecules/pagination";
import { RolesTable } from "@/components/molecules/role-table";
import { mockRoles, mockPermissions } from "@/data/user";
import { useState, Suspense } from "react";
import { CreateRoleDialog } from "@/components/molecules/role-create-dialog";
import { Role, Permission } from "@/type/user";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 10;

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  const paginatedRoles = filteredRoles.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleCreate = (newRole: Omit<Role, "id" | "createdAt" | "updatedAt">) => {
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

      <RolesTable
        roles={paginatedRoles}
        permissions={mockPermissions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Suspense fallback={<div>Loading...</div>}>
        <AppPagination totalPages={totalPages} />
      </Suspense>
    </section>
  );
}

