"use client";

import { useState } from "react";
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
  getIdeasByStatus,
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
} from "@/data/idea";
import {
  GripVertical,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Trash2,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IdeaKanbanBoardProps {
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

export function IdeaKanbanBoard({
  ideas,
  onUpdateStatus,
  onDelete,
}: IdeaKanbanBoardProps) {
  const columns = getIdeasByStatus(ideas);
  const [draggedIdea, setDraggedIdea] = useState<Idea | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<IdeaStatus | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, idea: Idea) => {
    setDraggedIdea(idea);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", idea.id);
    
    const target = e.target as HTMLElement;
    target.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = "1";
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
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {columns.map((column) => (
          <div 
            key={column.id} 
            className="flex-shrink-0 w-[280px]"
            onDragOver={(e) => handleDragOver(e, column.id as IdeaStatus)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id as IdeaStatus)}
          >
            <div className="flex items-center gap-2 mb-3 px-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: column.color }}
              />
              <h3 className="font-semibold text-sm">{column.title}</h3>
              <Badge variant="secondary" className="ml-auto text-xs">
                {column.ideas.length}
              </Badge>
            </div>

            <div 
              className={cn(
                "space-y-3 min-h-[200px] p-2 rounded-lg transition-colors duration-200",
                dragOverColumn === column.id 
                  ? "bg-muted/50" 
                  : "bg-muted/30"
              )}
            >
              {column.ideas.map((idea) => (
                <Card
                  key={idea.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idea)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200",
                    draggedIdea?.id === idea.id && "opacity-50 scale-[0.98]"
                  )}
                >
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <CardTitle className="text-sm font-medium line-clamp-2 flex-1 min-h-[40px]">
                        {idea.title}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
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
                                <div
                                  className="w-2 h-2 rounded-full mr-2"
                                  style={{ backgroundColor: getStatusColor(status) }}
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
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px] mb-3">
                      {idea.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3 min-h-[20px]">
                      {idea.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {idea.tags.length > 3 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          +{idea.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Priority */}
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                          style={{
                            backgroundColor: `${getPriorityColor(idea.priority)}20`,
                            color: getPriorityColor(idea.priority),
                          }}
                        >
                          {idea.priority}
                        </Badge>

                        {/* Comments count */}
                        {idea.comments.length > 0 && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MessageSquare className="h-3 w-3" />
                            <span className="text-[10px]">{idea.comments.length}</span>
                          </div>
                        )}

                        {/* References count */}
                        {idea.references.length > 0 && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Paperclip className="h-3 w-3" />
                            <span className="text-[10px]">{idea.references.length}</span>
                          </div>
                        )}
                      </div>

                      {/* Assignee */}
                      {idea.assignee ? (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={idea.assignee.avatar} />
                          <AvatarFallback className="text-[10px]">
                            {getInitials(idea.assignee.name)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                          <User className="h-3 w-3 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {column.ideas.length === 0 && (
                <div className="flex items-center justify-center h-[100px] text-muted-foreground text-sm">
                  {dragOverColumn === column.id ? "Drop here" : "No ideas"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
