import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      size: {
        default: "px-2 py-0.5 text-xs [&>svg]:size-3",
        sm: "px-1.5 py-0 text-[10px] [&>svg]:size-2.5",
        xs: "px-1 py-0 text-[9px] [&>svg]:size-2",
        lg: "px-3 py-1 text-sm [&>svg]:size-4",
        dot: "w-2 h-2 p-0", // Dot indicator - no text
        "dot-sm": "w-1.5 h-1.5 p-0", // Smaller dot
        "dot-lg": "w-3 h-3 p-0", // Larger dot
      },
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success:
          "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white [a&]:hover:bg-yellow-600",
        
        // Platform variants
        etsy: "border-transparent bg-[#f56400] text-white [a&]:hover:bg-[#d95700]",
        "etsy-outline": "border-[#f56400] text-[#f56400] bg-[#f56400]/10 [a&]:hover:bg-[#f56400]/20",
        amazon: "border-transparent bg-[#ff9900] text-white [a&]:hover:bg-[#e68a00]",
        "amazon-outline": "border-[#ff9900] text-[#ff9900] bg-[#ff9900]/10 [a&]:hover:bg-[#ff9900]/20",
        shopify: "border-transparent bg-[#96bf48] text-white [a&]:hover:bg-[#7fa33d]",
        "shopify-outline": "border-[#96bf48] text-[#96bf48] bg-[#96bf48]/10 [a&]:hover:bg-[#96bf48]/20",
        ebay: "border-transparent bg-[#e53238] text-white [a&]:hover:bg-[#cc2d32]",
        "ebay-outline": "border-[#e53238] text-[#e53238] bg-[#e53238]/10 [a&]:hover:bg-[#e53238]/20",
        tiktok: "border-transparent bg-black text-white [a&]:hover:bg-gray-800",
        "tiktok-outline": "border-black text-black bg-black/10 [a&]:hover:bg-black/20",
        manual: "border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-600",
        "manual-outline": "border-gray-500 text-gray-500 bg-gray-500/10 [a&]:hover:bg-gray-500/20",

        // Order status variants
        pending: "border-transparent bg-amber-500 text-white [a&]:hover:bg-amber-600",
        "pending-outline": "border-amber-500 text-amber-600 bg-amber-500/10",
        processing: "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600",
        "processing-outline": "border-blue-500 text-blue-600 bg-blue-500/10",
        designing: "border-transparent bg-violet-500 text-white [a&]:hover:bg-violet-600",
        "designing-outline": "border-violet-500 text-violet-600 bg-violet-500/10",
        production: "border-transparent bg-cyan-500 text-white [a&]:hover:bg-cyan-600",
        "production-outline": "border-cyan-500 text-cyan-600 bg-cyan-500/10",
        shipped: "border-transparent bg-emerald-500 text-white [a&]:hover:bg-emerald-600",
        "shipped-outline": "border-emerald-500 text-emerald-600 bg-emerald-500/10",
        delivered: "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        "delivered-outline": "border-green-500 text-green-600 bg-green-500/10",
        cancelled: "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600",
        "cancelled-outline": "border-red-500 text-red-600 bg-red-500/10",

        // Content status variants
        new: "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600",
        "new-outline": "border-blue-500 text-blue-600 bg-blue-500/10",
        fix_content: "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600",
        "fix_content-outline": "border-red-500 text-red-600 bg-red-500/10",
        done_content: "border-transparent bg-emerald-500 text-white [a&]:hover:bg-emerald-600",
        "done_content-outline": "border-emerald-500 text-emerald-600 bg-emerald-500/10",
        listed: "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        "listed-outline": "border-green-500 text-green-600 bg-green-500/10",

        // User/Account status variants
        active: "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        "active-outline": "border-green-500 text-green-600 bg-green-500/10",
        inactive: "border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-600",
        "inactive-outline": "border-gray-500 text-gray-600 bg-gray-500/10",
        suspended: "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600",
        "suspended-outline": "border-red-500 text-red-600 bg-red-500/10",
        vacation: "border-transparent bg-amber-500 text-white [a&]:hover:bg-amber-600",
        "vacation-outline": "border-amber-500 text-amber-600 bg-amber-500/10",

        // Product status variants  
        "in-stock": "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        "in-stock-outline": "border-green-500 text-green-600 bg-green-500/10",
        "out-of-stock": "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600",
        "out-of-stock-outline": "border-red-500 text-red-600 bg-red-500/10",
        discontinued: "border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-600",
        "discontinued-outline": "border-gray-500 text-gray-600 bg-gray-500/10",

        // Role variants
        admin: "border-transparent bg-red-600 text-white [a&]:hover:bg-red-700",
        "admin-outline": "border-red-600 text-red-600 bg-red-600/10",
        seller: "border-transparent bg-blue-600 text-white [a&]:hover:bg-blue-700",
        "seller-outline": "border-blue-600 text-blue-600 bg-blue-600/10",
        designer: "border-transparent bg-purple-600 text-white [a&]:hover:bg-purple-700",
        "designer-outline": "border-purple-600 text-purple-600 bg-purple-600/10",
        supplier: "border-transparent bg-green-600 text-white [a&]:hover:bg-green-700",
        "supplier-outline": "border-green-600 text-green-600 bg-green-600/10",

        // Idea status variants
        "idea-new": "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600",
        "idea-new-outline": "border-blue-500 text-blue-600 bg-blue-500/10",
        "idea-check_design": "border-transparent bg-violet-500 text-white [a&]:hover:bg-violet-600",
        "idea-check_design-outline": "border-violet-500 text-violet-600 bg-violet-500/10",
        "idea-check_content": "border-transparent bg-cyan-500 text-white [a&]:hover:bg-cyan-600",
        "idea-check_content-outline": "border-cyan-500 text-cyan-600 bg-cyan-500/10",
        "idea-done_idea": "border-transparent bg-amber-500 text-white [a&]:hover:bg-amber-600",
        "idea-done_idea-outline": "border-amber-500 text-amber-600 bg-amber-500/10",
        "idea-fix_design": "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600",
        "idea-fix_design-outline": "border-red-500 text-red-600 bg-red-500/10",
        "idea-done": "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        "idea-done-outline": "border-green-500 text-green-600 bg-green-500/10",

        // Priority variants
        "priority-low": "border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-600",
        "priority-low-outline": "border-gray-500 text-gray-600 bg-gray-500/10",
        "priority-medium": "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600",
        "priority-medium-outline": "border-blue-500 text-blue-600 bg-blue-500/10",
        "priority-high": "border-transparent bg-amber-500 text-white [a&]:hover:bg-amber-600",
        "priority-high-outline": "border-amber-500 text-amber-600 bg-amber-500/10",
        "priority-urgent": "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600",
        "priority-urgent-outline": "border-red-500 text-red-600 bg-red-500/10",

        // Design status variants
        "design-draft": "border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-600",
        "design-draft-outline": "border-gray-500 text-gray-600 bg-gray-500/10",
        "design-pending_review": "border-transparent bg-amber-500 text-white [a&]:hover:bg-amber-600",
        "design-pending_review-outline": "border-amber-500 text-amber-600 bg-amber-500/10",
        "design-approved": "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        "design-approved-outline": "border-green-500 text-green-600 bg-green-500/10",
        "design-rejected": "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600",
        "design-rejected-outline": "border-red-500 text-red-600 bg-red-500/10",
        "design-revision": "border-transparent bg-violet-500 text-white [a&]:hover:bg-violet-600",
        "design-revision-outline": "border-violet-500 text-violet-600 bg-violet-500/10",

        // Task status variants
        "task-todo": "border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-600",
        "task-todo-outline": "border-gray-500 text-gray-600 bg-gray-500/10",
        "task-in_progress": "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600",
        "task-in_progress-outline": "border-blue-500 text-blue-600 bg-blue-500/10",
        "task-review": "border-transparent bg-amber-500 text-white [a&]:hover:bg-amber-600",
        "task-review-outline": "border-amber-500 text-amber-600 bg-amber-500/10",
        "task-done": "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        "task-done-outline": "border-green-500 text-green-600 bg-green-500/10",

        // Production status variants
        "production-queued": "border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-600",
        "production-queued-outline": "border-gray-500 text-gray-600 bg-gray-500/10",
        "production-printing": "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600",
        "production-printing-outline": "border-blue-500 text-blue-600 bg-blue-500/10",
        "production-quality_check": "border-transparent bg-amber-500 text-white [a&]:hover:bg-amber-600",
        "production-quality_check-outline": "border-amber-500 text-amber-600 bg-amber-500/10",
        "production-packing": "border-transparent bg-violet-500 text-white [a&]:hover:bg-violet-600",
        "production-packing-outline": "border-violet-500 text-violet-600 bg-violet-500/10",
        "production-shipped": "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        "production-shipped-outline": "border-green-500 text-green-600 bg-green-500/10",

        // Activity type variants
        "activity-create": "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        "activity-create-outline": "border-green-500 text-green-600 bg-green-500/10",
        "activity-update": "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600",
        "activity-update-outline": "border-blue-500 text-blue-600 bg-blue-500/10",
        "activity-delete": "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600",
        "activity-delete-outline": "border-red-500 text-red-600 bg-red-500/10",
        "activity-login": "border-transparent bg-violet-500 text-white [a&]:hover:bg-violet-600",
        "activity-login-outline": "border-violet-500 text-violet-600 bg-violet-500/10",
        "activity-logout": "border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-600",
        "activity-logout-outline": "border-gray-500 text-gray-600 bg-gray-500/10",

        // Listing status variants
        "listing-active": "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        "listing-active-outline": "border-green-500 text-green-600 bg-green-500/10",
        "listing-inactive": "border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-600",
        "listing-inactive-outline": "border-gray-500 text-gray-600 bg-gray-500/10",
        "listing-draft": "border-transparent bg-amber-500 text-white [a&]:hover:bg-amber-600",
        "listing-draft-outline": "border-amber-500 text-amber-600 bg-amber-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
export type BadgeSize = VariantProps<typeof badgeVariants>["size"];

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
