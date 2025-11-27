"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Team } from "@/type/user";
import { Crown, Users } from "lucide-react";

interface TeamDetailDialogProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamDetailDialog({
  team,
  open,
  onOpenChange,
}: TeamDetailDialogProps) {
  if (!team) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Team Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Team Header */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{team.name}</h3>
              <p className="text-muted-foreground">
                {team.description || "No description"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Team Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">{team.members.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{team.createdAt}</p>
            </div>
          </div>

          <Separator />

          {/* Team Leader */}
          {team.leader && (
            <div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <Crown className="h-4 w-4 text-yellow-500" />
                Team Leader
              </p>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={team.leader.avatar} alt={team.leader.name} />
                  <AvatarFallback>{getInitials(team.leader.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{team.leader.name}</p>
                  <p className="text-sm text-muted-foreground">{team.leader.email}</p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {team.leader.role.name}
                </Badge>
              </div>
            </div>
          )}

          {/* Team Members */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Team Members</p>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {member.role.name}
                  </Badge>
                  {team.leader?.id === member.id && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

