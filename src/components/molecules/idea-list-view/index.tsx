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
import { getStatusLabel } from "@/utils/idea-helpers";
import {
  IDEA_STATUS_BADGE_OUTLINE_VARIANTS,
  PRIORITY_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";
import {
  AlertTriangle,
  Calendar,
  Clock,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isPast, isToday, format } from "date-fns";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AppPagination } from "@/components/molecules/pagination";
import Link from "next/link";

interface IdeaListViewProps {
  ideas: Idea[];
  onUpdateStatus: (ideaId: string, newStatus: IdeaStatus) => void;
  onDelete: (ideaId: string) => void;
  onOpenDetail: (idea: Idea) => void;
}

const statusOrder: IdeaStatus[] = [
  "new",
  "check_design",
  "check_content",
  "done_idea",
  "fix_design",
  "done",
];

const PAGE_SIZE = 10;

export function IdeaListView({
  ideas,
  onUpdateStatus,
  onDelete,
  onOpenDetail,
}: IdeaListViewProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page") ?? 1);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Pagination calculations
  const totalItems = ideas.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const paginatedIdeas = ideas.slice(startIndex, endIndex);

  // Check if page is out of bounds
  const isPageOutOfBounds = currentPage > totalPages && totalPages > 0;

  // Show not found if page is invalid
  if (isPageOutOfBounds) {
    return (
      <div className="border rounded-lg p-10">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <div>
            <h3 className="text-lg font-semibold">Page not found</h3>
            <p className="text-muted-foreground">
              Page {currentPage} does not exist. Total pages: {totalPages}
            </p>
          </div>
          <Link href={pathname}>
            <Button>Go to first page</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Title</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead className="w-[150px]">Designer</TableHead>
              <TableHead className="w-[120px]">Deadline</TableHead>
              <TableHead className="w-[140px]">Tags</TableHead>
              <TableHead className="w-[70px] text-center">Comments</TableHead>
              <TableHead className="w-[60px] text-center">Refs</TableHead>
              <TableHead className="w-[100px]">Updated</TableHead>
              <TableHead className="w-[60px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedIdeas.map((idea) => (
              <TableRow
                key={idea.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onOpenDetail(idea)}
              >
                <TableCell className="max-w-[280px]">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{idea.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {idea.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={IDEA_STATUS_BADGE_OUTLINE_VARIANTS[idea.status]}
                    size="sm"
                  >
                    {getStatusLabel(idea.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={PRIORITY_BADGE_OUTLINE_VARIANTS[idea.priority]}
                    size="sm"
                  >
                    {idea.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  {idea.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarImage src={idea.assignee.avatar} />
                        <AvatarFallback className="text-xs">
                          {getInitials(idea.assignee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">
                        {idea.assignee.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {idea.deadline ? (
                    <div
                      className={cn(
                        "flex items-center gap-1 text-xs",
                        isPast(new Date(idea.deadline)) &&
                          !isToday(new Date(idea.deadline))
                          ? "text-red-500"
                          : isToday(new Date(idea.deadline))
                          ? "text-amber-500"
                          : "text-muted-foreground"
                      )}
                    >
                      {isPast(new Date(idea.deadline)) &&
                      !isToday(new Date(idea.deadline)) ? (
                        <Clock className="h-3 w-3 shrink-0" />
                      ) : (
                        <Calendar className="h-3 w-3 shrink-0" />
                      )}
                      <span className="truncate">
                        {format(new Date(idea.deadline), "MMM dd, yyyy")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[140px]">
                    {idea.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" size="xs">
                        {tag}
                      </Badge>
                    ))}
                    {idea.tags.length > 2 && (
                      <Badge variant="outline" size="xs">
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
                <TableCell className="text-muted-foreground text-xs">
                  {format(new Date(idea.updatedAt), "MMM dd")}
                </TableCell>
                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
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
                              variant={
                                IDEA_STATUS_BADGE_OUTLINE_VARIANTS[status]
                              }
                              size="dot"
                              className="mr-2"
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
                  colSpan={10}
                  className="text-center py-10 text-muted-foreground"
                >
                  No ideas found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Using URL params */}
      {totalPages > 1 && <AppPagination totalPages={totalPages} />}
    </div>
  );
}
