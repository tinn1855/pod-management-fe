import { User } from "./user";

// Priority levels
export const PRIORITY_ORDER = ["low", "medium", "high", "urgent"] as const;
export type Priority = (typeof PRIORITY_ORDER)[number];

// Idea Status theo Kanban workflow
export type IdeaStatus =
  | "new" // Idea mới tạo
  | "check_design" // Đang kiểm tra thiết kế
  | "check_content" // Đang kiểm tra nội dung
  | "done_idea" // Idea đã hoàn thành
  | "fix_design" // Cần sửa thiết kế
  | "done"; // Hoàn tất

export interface IdeaComment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaReference {
  id: string;
  url: string;
  name: string;
  type: "image" | "link";
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  priority: Priority;
  references: IdeaReference[];
  comments: IdeaComment[];
  assignee?: User;
  createdBy: User;
  tags: string[];
  deadline?: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

// Design types
export type DesignFileType = "psd" | "png" | "ai" | "jpg" | "svg";

export interface DesignFile {
  id: string;
  name: string;
  url: string;
  type: DesignFileType;
  size: number; // in bytes
  folder?: string;
  uploadedBy: User;
  uploadedAt: string;
}

export interface Design {
  id: string;
  ideaId: string;
  title: string;
  description: string;
  status: "draft" | "pending_review" | "approved" | "rejected" | "revision";
  files: DesignFile[];
  comments: IdeaComment[];
  designer: User;
  reviewer?: User;
  createdAt: string;
  updatedAt: string;
}

// Kanban Column
export interface KanbanColumn {
  id: IdeaStatus;
  title: string;
  color: string;
  ideas: Idea[];
}

export interface IdeaDetailDialogProps {
  idea: Idea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[];
  onUpdate: (idea: Idea) => void;
  onDelete: (ideaId: string) => void;
  onUpdateStatus: (ideaId: string, status: IdeaStatus) => void;
}
