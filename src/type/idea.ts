import { User } from "./user";

// Idea Status theo Kanban workflow
export type IdeaStatus =
  | "new"           // Idea mới tạo
  | "check_design"  // Đang kiểm tra thiết kế
  | "check_content" // Đang kiểm tra nội dung
  | "done_idea"     // Idea đã hoàn thành
  | "fix_design"    // Cần sửa thiết kế
  | "done";         // Hoàn tất

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
  priority: "low" | "medium" | "high" | "urgent";
  references: IdeaReference[];
  comments: IdeaComment[];
  assignee?: User;
  createdBy: User;
  tags: string[];
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

