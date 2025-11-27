"use client";

import { Input } from "@/components/ui/input";
import { AppPagination } from "@/components/molecules/pagination";
import { TeamsTable } from "@/components/molecules/team-table";
import { mockTeams, mockUsers } from "@/data/user";
import { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CreateTeamDialog } from "@/components/molecules/team-create-dialog";
import { Team } from "@/type/user";
import { ITEMS_PER_PAGE } from "@/constants";

export default function TeamsPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = useMemo(() => {
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teams, searchQuery]);

  const totalPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE);

  const paginatedTeams = useMemo(() => {
    return filteredTeams.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredTeams, currentPage]);

  const handleCreate = (
    newTeam: Omit<Team, "id" | "createdAt" | "updatedAt">
  ) => {
    const team: Team = {
      ...newTeam,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setTeams((prev) => [team, ...prev]);
  };

  const handleEdit = (updatedTeam: Team) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t))
    );
  };

  const handleDelete = (team: Team) => {
    setTeams((prev) => prev.filter((t) => t.id !== team.id));
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <CreateTeamDialog users={mockUsers} onSubmit={handleCreate} />
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
        users={mockUsers}
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
