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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Idea, IdeaStatus } from "@/type/idea";
import { getStatusLabel } from "@/data/idea";
import {
  IDEA_STATUS_BADGE_OUTLINE_VARIANTS,
  PRIORITY_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";
import {
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Trash2,
} from "lucide-react";

interface IdeaListViewProps {
  ideas: Idea[];
  onUpdateStatus: (ideaId: string, newStatus: IdeaStatus) => void;
  onDelete: (ideaId: string) => void;
}

const statusOrder: IdeaStatus[] = [
  "new",
  "check_design",
  "check_content",
  "done_idea",
  "fix_design",
  "done",
];

export function IdeaListView({
  ideas,
  onUpdateStatus,
  onDelete,
}: IdeaListViewProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Designer</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-center">Comments</TableHead>
            <TableHead className="text-center">Refs</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ideas.map((idea) => (
            <TableRow key={idea.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{idea.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {idea.description}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={IDEA_STATUS_BADGE_OUTLINE_VARIANTS[idea.status]}>
                  {getStatusLabel(idea.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={PRIORITY_BADGE_OUTLINE_VARIANTS[idea.priority]}>
                  {idea.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {idea.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={idea.assignee.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(idea.assignee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{idea.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {idea.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {idea.tags.length > 2 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      +{idea.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  <span className="text-xs">{idea.comments.length}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <Paperclip className="h-3 w-3" />
                  <span className="text-xs">{idea.references.length}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {idea.updatedAt}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-xs font-medium text-muted-foreground">
                      Move to:
                    </DropdownMenuItem>
                    {statusOrder
                      .filter((s) => s !== idea.status)
                      .map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => onUpdateStatus(idea.id, status)}
                        >
                          <Badge
                            variant={IDEA_STATUS_BADGE_OUTLINE_VARIANTS[status]}
                            className="w-2 h-2 p-0 mr-2 rounded-full"
                          />
                          {getStatusLabel(status)}
                        </DropdownMenuItem>
                      ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(idea.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {ideas.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-10 text-muted-foreground"
              >
                No ideas found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
