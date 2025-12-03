"use client";

import { Input } from "@/components/ui/input";
import { AppPagination } from "@/components/molecules/pagination";
import { TeamsTable } from "@/components/molecules/team-table";
import { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CreateTeamDialog } from "@/components/molecules/team-create-dialog";
import { Team } from "@/type/user";
import { ITEMS_PER_PAGE } from "@/constants";
import { useTeams } from "@/hooks/use-teams";
import { Spinner } from "@/components/ui/spinner";

function TeamsPageContent() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

  // Fetch teams from API with CRUD operations
  const {
    teams: apiTeams,
    loading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
  } = useTeams(true);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = useMemo(() => {
    return apiTeams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [apiTeams, searchQuery]);

  const totalPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE);

  const paginatedTeams = useMemo(() => {
    return filteredTeams.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredTeams, currentPage]);

  const handleCreate = async (
    newTeam: Omit<Team, "id" | "createdAt" | "updatedAt">
  ): Promise<void> => {
    try {
      // Extract member IDs and leader ID from the team data
      const memberIds = newTeam.members?.map((m) => m.id) || [];

      await createTeam({
        name: newTeam.name,
        description: newTeam.description,
        memberIds,
      });
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleEdit = async (updatedTeam: Team): Promise<void> => {
    try {
      // Extract member IDs and leader ID from the team data
      const memberIds = updatedTeam.members?.map((m) => m.id) || [];

      await updateTeam(updatedTeam.id, {
        name: updatedTeam.name,
        description: updatedTeam.description,
        memberIds,
      });
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  const handleDelete = async (team: Team): Promise<void> => {
    try {
      await deleteTeam(team.id);
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  // Loading state
  if (loading && apiTeams.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Team Management</h1>
        </div>
        <div className="flex items-center justify-center py-12 gap-2">
          <Spinner />
          Loading teams...
        </div>
      </section>
    );
  }

  // Error state
  if (error && apiTeams.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Team Management</h1>
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
        <h1 className="text-2xl font-bold">Team Management</h1>
        <CreateTeamDialog onSubmit={handleCreate} />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search teams..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {paginatedTeams.length} of {filteredTeams.length} teams
      </div>

      <TeamsTable
        teams={paginatedTeams}
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

export default function TeamsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">Loading...</div>
      }
    >
      <TeamsPageContent />
    </Suspense>
  );
}
