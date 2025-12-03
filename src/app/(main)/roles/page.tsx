"use client";

import { Input } from "@/components/ui/input";
import { AppPagination } from "@/components/molecules/pagination";
import { RolesTable } from "@/components/molecules/role-table";
import { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CreateRoleDialog } from "@/components/molecules/role-create-dialog";
import { Role } from "@/type/user";
import { ITEMS_PER_PAGE } from "@/constants";
import { useRoles } from "@/hooks/use-roles";
import { Loader2 } from "lucide-react";

function RolesPageContent() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

  // Fetch roles from API
  const { roles: apiRoles, loading, error } = useRoles(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoles = useMemo(() => {
    return apiRoles.filter(
      (role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [apiRoles, searchQuery]);

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
    // TODO: Implement API call to create role
    console.log("Create role:", newRole);
  };

  const handleEdit = (updatedRole: Role) => {
    // TODO: Implement API call to update role
    console.log("Edit role:", updatedRole);
  };

  const handleDelete = (role: Role) => {
    // TODO: Implement API call to delete role
    console.log("Delete role:", role);
  };

  // Loading state
  if (loading && apiRoles.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Role Management</h1>
        </div>
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Loading roles...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error && apiRoles.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Role Management</h1>
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
        <h1 className="text-2xl font-bold">Role Management</h1>
        <CreateRoleDialog
          permissions={[]}
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
        permissions={[]}
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
