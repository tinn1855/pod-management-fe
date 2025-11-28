import { User } from "./user";
import { Design } from "./idea";

// Content Status theo workflow
export type ContentStatus =
  | "new" // Content mới tạo
  | "fix_content" // Cần sửa content
  | "done_content" // Content đã hoàn thành
  | "listed"; // Đã đăng lên sàn

// Platform types
export type Platform =
  | "etsy"
  | "amazon"
  | "shopify"
  | "ebay"
  | "tiktok"
  | "other";

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

// Platform listing information
export interface PlatformListing {
  platform: Platform;
  listingId?: string; // ID từ sàn sau khi crawl/đăng
  listedAt?: string; // Ngày đăng lên platform
  autoPosted?: boolean; // Được đăng tự động qua extension
  extensionName?: string; // Tên extension đã sử dụng
}

export interface Content {
  id: string;
  title: string;
  description: string;
  status: ContentStatus;
  platform: Platform; // Primary platform
  platforms?: Platform[]; // Multiple platforms for posting
  platformListings?: PlatformListing[]; // Track listings on each platform
  designId?: string;
  design?: Design;
  listingId?: string; // Legacy: primary listing ID
  crawledListingId?: string; // ListingID từ sàn khi crawl
  crawledFrom?: Platform; // Platform mà content được crawl từ
  tags: string[];
  mockups: ContentMockup[];
  video?: string;
  metadata: ContentMetadata;
  autoPostEnabled?: boolean; // Enable auto-post via extensions
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

// Crawl content input
export interface CrawlContentInput {
  platform: Platform;
  listingId: string;
  designId?: string;
}

// Auto-post settings
export interface AutoPostSettings {
  enabled: boolean;
  extensionName?: string;
  platforms: Platform[];
  scheduledAt?: string;
}
