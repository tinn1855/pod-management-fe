"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { AppPagination } from "@/components/molecules/pagination";
import { TeamsTable } from "@/components/molecules/team-table";
import { mockTeams, mockUsers } from "@/data/user";
import { useState, Suspense } from "react";
import { CreateTeamDialog } from "@/components/molecules/team-create-dialog";
import { Team, User } from "@/type/user";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 10;

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);

  const paginatedTeams = filteredTeams.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleCreate = (newTeam: Omit<Team, "id" | "createdAt" | "updatedAt">) => {
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

      <TeamsTable
        teams={paginatedTeams}
        users={mockUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Suspense fallback={<div>Loading...</div>}>
        <AppPagination totalPages={totalPages} />
      </Suspense>
    </section>
  );
}
