import { LucideIcon } from "lucide-react";
import { Idea, IdeaStatus } from "./idea";

/**
 * Status order for Kanban board columns
 */
export const STATUS_ORDER: IdeaStatus[] = [
  "new",
  "check_design",
  "check_content",
  "done_idea",
  "fix_design",
  "done",
];

/**
 * Props for counter component with icon
 */
export interface IconCounterProps {
  icon: LucideIcon;
  count: number;
}

/**
 * Props for deadline display component
 */
export interface DeadlineDisplayProps {
  deadline: string;
}

/**
 * Props for assignee avatar component
 */
export interface AssigneeAvatarProps {
  assignee: Idea["assignee"];
}

/**
 * Props for tag list component
 */
export interface TagListProps {
  tags: string[];
  maxVisible?: number;
}

/**
 * Props for idea card component
 */
export interface IdeaCardProps {
  idea: Idea;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, idea: Idea) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onOpenDetail: (idea: Idea) => void;
  onUpdateStatus: (ideaId: string, status: IdeaStatus) => void;
  onDelete: (ideaId: string) => void;
}

/**
 * Props for virtualized column component
 */
export interface VirtualizedColumnProps {
  ideas: Idea[];
  draggedIdeaId: string | null;
  onDragStart: (e: React.DragEvent, idea: Idea) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onOpenDetail: (idea: Idea) => void;
  onUpdateStatus: (ideaId: string, status: IdeaStatus) => void;
  onDelete: (ideaId: string) => void;
  isDragOver: boolean;
}

/**
 * Props for kanban board component
 */
export interface IdeaKanbanBoardProps {
  ideas: Idea[];
  onUpdateStatus: (ideaId: string, newStatus: IdeaStatus) => void;
  onDelete: (ideaId: string) => void;
  onOpenDetail: (idea: Idea) => void;
}

