import { User } from "./user";
import { Design } from "./idea";

// Content Status theo workflow
export type ContentStatus =
  | "new"          // Content mới tạo
  | "fix_content"  // Cần sửa content
  | "done_content" // Content đã hoàn thành
  | "listed";      // Đã đăng lên sàn

// Platform types
export type Platform = "etsy" | "amazon" | "shopify" | "ebay" | "tiktok" | "other";

export interface ContentMockup {
  id: string;
  url: string;
  name: string;
  type: "image" | "video";
}

export interface ContentMetadata {
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface Content {
  id: string;
  title: string;
  description: string;
  status: ContentStatus;
  platform: Platform;
  designId?: string;
  design?: Design;
  listingId?: string; // ID từ sàn sau khi crawl/đăng
  tags: string[];
  mockups: ContentMockup[];
  video?: string;
  metadata: ContentMetadata;
  createdBy: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
  listedAt?: string;
}

// Content filters
export interface ContentFilters {
  status?: ContentStatus;
  platform?: Platform;
  search?: string;
  designId?: string;
}

