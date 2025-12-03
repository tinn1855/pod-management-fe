import { Content, ContentStatus } from "@/type/content";
import { Platform } from "@/type/content";

export function getStatusLabel(status: ContentStatus): string {
  const labels: Record<ContentStatus, string> = {
    new: "New",
    fix_content: "Fix Content",
    done_content: "Done Content",
    listed: "Listed",
  };
  return labels[status] || status;
}

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    etsy: "Etsy",
    amazon: "Amazon",
    shopify: "Shopify",
    ebay: "eBay",
    tiktok: "TikTok",
    other: "Other",
  };
  return labels[platform] || platform;
}

export function getContentStats(contents: Content[]): {
  total: number;
  new: number;
  fixContent: number;
  doneContent: number;
  listed: number;
  byPlatform: Record<string, number>;
} {
  const byPlatform: Record<string, number> = {
    etsy: 0,
    amazon: 0,
    shopify: 0,
    ebay: 0,
    tiktok: 0,
    other: 0,
  };

  contents.forEach((content) => {
    const platform = content.platform || "other";
    byPlatform[platform] = (byPlatform[platform] || 0) + 1;
  });

  return {
    total: contents.length,
    new: contents.filter((c) => c.status === "new").length,
    fixContent: contents.filter((c) => c.status === "fix_content").length,
    doneContent: contents.filter((c) => c.status === "done_content").length,
    listed: contents.filter((c) => c.status === "listed").length,
    byPlatform,
  };
}

