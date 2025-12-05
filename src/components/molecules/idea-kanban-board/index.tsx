"use client";

import { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Idea, IdeaStatus } from "@/type/idea";
import {
  STATUS_ORDER,
  IconCounterProps,
  DeadlineDisplayProps,
  AssigneeAvatarProps,
  TagListProps,
  IdeaCardProps,
  VirtualizedColumnProps,
  IdeaKanbanBoardProps,
} from "@/type/kanban";
import { getIdeasByStatus, getStatusLabel } from "@/utils/idea-helpers";
import {
  IDEA_STATUS_BADGE_OUTLINE_VARIANTS,
  PRIORITY_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";
import { getInitials, getDeadlineStatus } from "@/utils/format";
import {
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Trash2,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Constants
const CARD_HEIGHT = 220;

// Component: Icon counter (for comments, attachments)
const IconCounter = ({ icon: Icon, count }: IconCounterProps) => {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <Icon className="h-3 w-3" />
      <span className="text-xs">{count}</span>
    </div>
  );
};

// Component: Deadline display
const DeadlineDisplay = ({ deadline }: DeadlineDisplayProps) => {
  const { icon: Icon, className } = getDeadlineStatus(deadline);
  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs rounded px-1.5 py-0.5 w-fit",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {format(new Date(deadline), "MMM dd")}
    </div>
  );
};

// Component: Assignee avatar
const AssigneeAvatar = ({ assignee }: AssigneeAvatarProps) => {
  if (assignee) {
    return (
      <Avatar className="h-6 w-6">
        <AvatarImage src={assignee.avatar} />
        <AvatarFallback className="text-xs">
          {getInitials(assignee.name)}
        </AvatarFallback>
      </Avatar>
    );
  }
  return (
    <div className="h-6 w-6 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
      <User className="h-3 w-3 text-muted-foreground/50" />
    </div>
  );
};

// Component: Tag list
const TagList = ({ tags, maxVisible = 3 }: TagListProps) => (
  <div className="flex flex-wrap gap-1 min-h-[20px]">
    {tags.slice(0, maxVisible).map((tag) => (
      <Badge key={tag} variant="outline" size="sm">
        {tag}
      </Badge>
    ))}
    {tags.length > maxVisible && (
      <Badge variant="outline" size="sm">
        +{tags.length - maxVisible}
      </Badge>
    )}
  </div>
);

// Component: Idea Card
const IdeaCard = ({
  idea,
  isDragging,
  onDragStart,
  onDragEnd,
  onOpenDetail,
  onUpdateStatus,
  onDelete,
}: IdeaCardProps) => (
  <Card
    draggable
    onDragStart={(e) => onDragStart(e, idea)}
    onDragEnd={onDragEnd}
    onClick={() => onOpenDetail(idea)}
    className={cn(
      "cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 flex flex-col",
      isDragging && "opacity-50 scale-95"
    )}
  >
    <CardHeader>
      <div className="flex items-start gap-2">
        <CardTitle className="text-sm font-medium line-clamp-2 flex-1 ">
          {idea.title}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-xs font-medium text-muted-foreground">
              Move to:
            </DropdownMenuItem>
            {STATUS_ORDER.filter((s) => s !== idea.status).map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus(idea.id, status);
                }}
              >
                <Badge
                  variant={IDEA_STATUS_BADGE_OUTLINE_VARIANTS[status]}
                  size="dot"
                />
                {getStatusLabel(status)}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(idea.id);
              }}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>

    <CardContent className="flex-1 flex flex-col gap-3 pt-0">
      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 min-h-8">
        {idea.description}
      </p>

      {/* Tags */}
      <TagList tags={idea.tags} />

      {/* Deadline */}
      {idea.deadline && <DeadlineDisplay deadline={idea.deadline} />}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t">
        <div className="flex items-center gap-2">
          <Badge
            variant={PRIORITY_BADGE_OUTLINE_VARIANTS[idea.priority]}
            size="sm"
          >
            {idea.priority}
          </Badge>
          <IconCounter icon={MessageSquare} count={idea.comments.length} />
          <IconCounter icon={Paperclip} count={idea.references.length} />
        </div>
        <AssigneeAvatar assignee={idea.assignee} />
      </div>
    </CardContent>
  </Card>
);

// Component: Virtualized Column
const VirtualizedColumn = ({
  ideas,
  draggedIdeaId,
  onDragStart,
  onDragEnd,
  onOpenDetail,
  onUpdateStatus,
  onDelete,
  isDragOver,
}: VirtualizedColumnProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: ideas.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_HEIGHT,
    overscan: 3,
  });

  const items = virtualizer.getVirtualItems();

  if (ideas.length === 0) {
    return (
      <div
        className={cn(
          "min-h-[200px] rounded-lg transition-colors duration-200 p-2 flex-1 flex items-center justify-center",
          isDragOver ? "bg-muted/50" : "bg-muted/30"
        )}
      >
        <span className="text-muted-foreground text-sm">
          {isDragOver ? "Drop here" : "No ideas"}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={cn(
        "min-h-[200px] rounded-lg transition-colors duration-200 p-2 flex-1 overflow-y-auto",
        isDragOver ? "bg-muted/50" : "bg-muted/30"
      )}
    >
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {items.map((virtualItem) => {
          const idea = ideas[virtualItem.index];
          return (
            <div
              key={idea.id}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 right-0 pb-3"
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <IdeaCard
                idea={idea}
                isDragging={draggedIdeaId === idea.id}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onOpenDetail={onOpenDetail}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Component
export function IdeaKanbanBoard({
  ideas,
  onUpdateStatus,
  onDelete,
  onOpenDetail,
}: IdeaKanbanBoardProps) {
  const columns = getIdeasByStatus(ideas);
  const [draggedIdea, setDraggedIdea] = useState<Idea | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<IdeaStatus | null>(null);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, idea: Idea) => {
    setDraggedIdea(idea);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", idea.id);

    const target = e.target as HTMLElement;
    target.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.classList.remove("opacity-50");
    setDraggedIdea(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: IdeaStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: IdeaStatus) => {
    e.preventDefault();

    if (draggedIdea && draggedIdea.status !== newStatus) {
      onUpdateStatus(draggedIdea.id, newStatus);
    }

    setDraggedIdea(null);
    setDragOverColumn(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-4 flex-1 min-h-0 overflow-x-auto pb-2">
        {columns.map((column) => (
          <div
            key={column.id}
            className="shrink-0 w-[280px] flex flex-col h-full"
            onDragOver={(e) => handleDragOver(e, column.id as IdeaStatus)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id as IdeaStatus)}
          >
            {/* Column Header - Fixed */}
            <div className="flex items-center gap-2 mb-3 px-1 shrink-0">
              <Badge
                variant={
                  IDEA_STATUS_BADGE_OUTLINE_VARIANTS[column.id as IdeaStatus]
                }
                size="dot-lg"
              />
              <h3 className="font-semibold text-sm">{column.title}</h3>
              <Badge variant="secondary" size="sm" className="ml-auto">
                {column.ideas.length}
              </Badge>
            </div>

            {/* Column Content - Virtualized */}
            <VirtualizedColumn
              ideas={column.ideas}
              draggedIdeaId={draggedIdea?.id || null}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onOpenDetail={onOpenDetail}
              onUpdateStatus={onUpdateStatus}
              onDelete={onDelete}
              isDragOver={dragOverColumn === column.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
