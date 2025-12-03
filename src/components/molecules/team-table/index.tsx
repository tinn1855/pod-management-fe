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
import { Team } from "@/type/user";
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
  onEdit?: (team: Team) => Promise<void>;
  onDelete?: (team: Team) => Promise<void>;
}

export function TeamsTable({ teams, onEdit, onDelete }: TeamsTableProps) {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null);

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
  };

  const handleUpdate = async (updatedTeam: Team): Promise<void> => {
    try {
      await onEdit?.(updatedTeam);
      setEditingTeam(null);
    } catch (error) {
      console.error("Error updating team:", error);
      // Don't close dialog on error
    }
  };

  const handleViewDetail = (team: Team) => {
    setViewingTeam(team);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Team Name</TableHead>
            <TableHead>Description</TableHead>
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
                  <span className="font-medium">{team.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground max-w-[200px] truncate">
                {team.description || "-"}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  {team.memberCount ?? team.members?.length ?? 0} members
                </Badge>
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
                    <SquarePen />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="icon"
                        variant="outline"
                        className="text-destructive"
                      >
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Team</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete{" "}
                          <span className="font-medium">{team.name}</span>? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
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
