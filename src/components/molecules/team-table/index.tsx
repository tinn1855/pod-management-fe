"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { SquarePen, Trash2, Users } from "lucide-react";
import { Team, User } from "@/type/user";
import { useState } from "react";
import { EditTeamDialog } from "../team-edit-dialog";
import { TeamDetailDialog } from "../team-detail-dialog";
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

interface TeamsTableProps {
  teams: Team[];
  users: User[];
  onEdit?: (team: Team) => void;
  onDelete?: (team: Team) => void;
}

export function TeamsTable({
  teams,
  users,
  onEdit,
  onDelete,
}: TeamsTableProps) {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null);

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
  };

  const handleUpdate = (updatedTeam: Team) => {
    onEdit?.(updatedTeam);
    setEditingTeam(null);
  };

  const handleViewDetail = (team: Team) => {
    setViewingTeam(team);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Team Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Leader</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {teams?.map((team, index) => (
            <TableRow
              key={team.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleViewDetail(team)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{team.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground max-w-[200px] truncate">
                {team.description || "-"}
              </TableCell>
              <TableCell>
                {team.leader ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={team.leader.avatar} alt={team.leader.name} />
                      <AvatarFallback className="text-xs">
                        {getInitials(team.leader.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{team.leader.name}</span>
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 3).map((member) => (
                      <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {team.members.length} members
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {team.createdAt}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(team);
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
                        <AlertDialogTitle>Delete Team</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{team.name}&quot;? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => onDelete?.(team)}
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

      <EditTeamDialog
        team={editingTeam || undefined}
        users={users}
        open={!!editingTeam}
        onOpenChange={(open) => !open && setEditingTeam(null)}
        onUpdate={handleUpdate}
      />

      <TeamDetailDialog
        team={viewingTeam}
        open={!!viewingTeam}
        onOpenChange={(open) => !open && setViewingTeam(null)}
      />
    </>
  );
}
