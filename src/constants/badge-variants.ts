import { BadgeVariant } from "@/components/ui/badge";
import { PlatformType } from "@/type/platform";
import { OrderStatus } from "@/type/order";
import { ContentStatus, Platform as ContentPlatform } from "@/type/content";
import { IdeaStatus } from "@/type/idea";

// ============================================
// PLATFORM BADGE VARIANTS
// ============================================

export const PLATFORM_BADGE_VARIANTS: Record<PlatformType, BadgeVariant> = {
  etsy: "etsy",
  amazon: "amazon",
  shopify: "shopify",
  ebay: "ebay",
  tiktok: "tiktok",
  manual: "manual",
  other: "secondary",
};

export const PLATFORM_BADGE_OUTLINE_VARIANTS: Record<
  PlatformType,
  BadgeVariant
> = {
  etsy: "etsy-outline",
  amazon: "amazon-outline",
  shopify: "shopify-outline",
  ebay: "ebay-outline",
  tiktok: "tiktok-outline",
  manual: "manual-outline",
  other: "outline",
};

// ============================================
// ORDER STATUS BADGE VARIANTS
// ============================================

export const ORDER_STATUS_BADGE_VARIANTS: Record<OrderStatus, BadgeVariant> = {
  pending: "pending",
  processing: "processing",
  designing: "designing",
  production: "production",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
};

export const ORDER_STATUS_BADGE_OUTLINE_VARIANTS: Record<
  OrderStatus,
  BadgeVariant
> = {
  pending: "pending-outline",
  processing: "processing-outline",
  designing: "designing-outline",
  production: "production-outline",
  shipped: "shipped-outline",
  delivered: "delivered-outline",
  cancelled: "cancelled-outline",
};

// ============================================
// CONTENT STATUS BADGE VARIANTS
// ============================================

export const CONTENT_STATUS_BADGE_VARIANTS: Record<
  ContentStatus,
  BadgeVariant
> = {
  new: "new",
  fix_content: "fix_content",
  done_content: "done_content",
  listed: "listed",
};

export const CONTENT_STATUS_BADGE_OUTLINE_VARIANTS: Record<
  ContentStatus,
  BadgeVariant
> = {
  new: "new-outline",
  fix_content: "fix_content-outline",
  done_content: "done_content-outline",
  listed: "listed-outline",
};

// ============================================
// CONTENT PLATFORM BADGE VARIANTS
// ============================================

export const CONTENT_PLATFORM_BADGE_VARIANTS: Record<
  ContentPlatform,
  BadgeVariant
> = {
  etsy: "etsy",
  amazon: "amazon",
  shopify: "shopify",
  ebay: "ebay",
  tiktok: "tiktok",
  other: "secondary",
};

export const CONTENT_PLATFORM_BADGE_OUTLINE_VARIANTS: Record<
  ContentPlatform,
  BadgeVariant
> = {
  etsy: "etsy-outline",
  amazon: "amazon-outline",
  shopify: "shopify-outline",
  ebay: "ebay-outline",
  tiktok: "tiktok-outline",
  other: "outline",
};

// ============================================
// USER STATUS BADGE VARIANTS
// ============================================

export const USER_STATUS_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  active: "active",
  inactive: "inactive",
  pending: "pending",
};

export const USER_STATUS_BADGE_OUTLINE_VARIANTS: Record<string, BadgeVariant> =
  {
    active: "active-outline",
    inactive: "inactive-outline",
    pending: "pending-outline",
  };

// ============================================
// ACCOUNT STATUS BADGE VARIANTS
// ============================================

export const ACCOUNT_STATUS_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  active: "active",
  inactive: "inactive",
  suspended: "suspended",
};

export const ACCOUNT_STATUS_BADGE_OUTLINE_VARIANTS: Record<
  string,
  BadgeVariant
> = {
  active: "active-outline",
  inactive: "inactive-outline",
  suspended: "suspended-outline",
};

// ============================================
// STORE STATUS BADGE VARIANTS
// ============================================

export const STORE_STATUS_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  active: "active",
  inactive: "inactive",
  vacation: "vacation",
};

export const STORE_STATUS_BADGE_OUTLINE_VARIANTS: Record<string, BadgeVariant> =
  {
    active: "active-outline",
    inactive: "inactive-outline",
    vacation: "vacation-outline",
  };

// ============================================
// ROLE BADGE VARIANTS
// ============================================

export const ROLE_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  admin: "admin",
  seller: "seller",
  designer: "designer",
  supplier: "supplier",
};

export const ROLE_BADGE_OUTLINE_VARIANTS: Record<string, BadgeVariant> = {
  admin: "admin-outline",
  seller: "seller-outline",
  designer: "designer-outline",
  supplier: "supplier-outline",
};

// ============================================
// PRODUCT STATUS BADGE VARIANTS
// ============================================

export const PRODUCT_STATUS_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  "in stock": "in-stock",
  "out of stock": "out-of-stock",
  discontinued: "discontinued",
};

export const PRODUCT_STATUS_BADGE_OUTLINE_VARIANTS: Record<
  string,
  BadgeVariant
> = {
  "in stock": "in-stock-outline",
  "out of stock": "out-of-stock-outline",
  discontinued: "discontinued-outline",
};

// ============================================
// IDEA STATUS BADGE VARIANTS
// ============================================

export const IDEA_STATUS_BADGE_VARIANTS: Record<IdeaStatus, BadgeVariant> = {
  new: "idea-new",
  check_design: "idea-check_design",
  check_content: "idea-check_content",
  done_idea: "idea-done_idea",
  fix_design: "idea-fix_design",
  done: "idea-done",
};

export const IDEA_STATUS_BADGE_OUTLINE_VARIANTS: Record<
  IdeaStatus,
  BadgeVariant
> = {
  new: "idea-new-outline",
  check_design: "idea-check_design-outline",
  check_content: "idea-check_content-outline",
  done_idea: "idea-done_idea-outline",
  fix_design: "idea-fix_design-outline",
  done: "idea-done-outline",
};

// ============================================
// PRIORITY BADGE VARIANTS
// ============================================

export const PRIORITY_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
  urgent: "priority-urgent",
};

export const PRIORITY_BADGE_OUTLINE_VARIANTS: Record<string, BadgeVariant> = {
  low: "priority-low-outline",
  medium: "priority-medium-outline",
  high: "priority-high-outline",
  urgent: "priority-urgent-outline",
};

// ============================================
// DESIGN STATUS BADGE VARIANTS
// ============================================

export const DESIGN_STATUS_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  draft: "design-draft",
  pending_review: "design-pending_review",
  approved: "design-approved",
  rejected: "design-rejected",
  revision: "design-revision",
};

export const DESIGN_STATUS_BADGE_OUTLINE_VARIANTS: Record<
  string,
  BadgeVariant
> = {
  draft: "design-draft-outline",
  pending_review: "design-pending_review-outline",
  approved: "design-approved-outline",
  rejected: "design-rejected-outline",
  revision: "design-revision-outline",
};

// ============================================
// TASK STATUS BADGE VARIANTS
// ============================================

export const TASK_STATUS_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  todo: "task-todo",
  in_progress: "task-in_progress",
  review: "task-review",
  done: "task-done",
};

export const TASK_STATUS_BADGE_OUTLINE_VARIANTS: Record<string, BadgeVariant> =
  {
    todo: "task-todo-outline",
    in_progress: "task-in_progress-outline",
    review: "task-review-outline",
    done: "task-done-outline",
  };

// ============================================
// PRODUCTION STATUS BADGE VARIANTS
// ============================================

export const PRODUCTION_STATUS_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  queued: "production-queued",
  printing: "production-printing",
  quality_check: "production-quality_check",
  packing: "production-packing",
  shipped: "production-shipped",
};

export const PRODUCTION_STATUS_BADGE_OUTLINE_VARIANTS: Record<
  string,
  BadgeVariant
> = {
  queued: "production-queued-outline",
  printing: "production-printing-outline",
  quality_check: "production-quality_check-outline",
  packing: "production-packing-outline",
  shipped: "production-shipped-outline",
};

// ============================================
// ACTIVITY TYPE BADGE VARIANTS
// ============================================

export const ACTIVITY_TYPE_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  create: "activity-create",
  update: "activity-update",
  delete: "activity-delete",
  login: "activity-login",
  logout: "activity-logout",
};

export const ACTIVITY_TYPE_BADGE_OUTLINE_VARIANTS: Record<
  string,
  BadgeVariant
> = {
  create: "activity-create-outline",
  update: "activity-update-outline",
  delete: "activity-delete-outline",
  login: "activity-login-outline",
  logout: "activity-logout-outline",
};

// ============================================
// LISTING STATUS BADGE VARIANTS
// ============================================

export const LISTING_STATUS_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  active: "listing-active",
  inactive: "listing-inactive",
  draft: "listing-draft",
};

export const LISTING_STATUS_BADGE_OUTLINE_VARIANTS: Record<
  string,
  BadgeVariant
> = {
  active: "listing-active-outline",
  inactive: "listing-inactive-outline",
  draft: "listing-draft-outline",
};
