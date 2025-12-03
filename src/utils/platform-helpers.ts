import { PlatformType } from "@/type/platform";

export function getPlatformLabel(platform: PlatformType): string {
  const labels: Record<PlatformType, string> = {
    etsy: "Etsy",
    amazon: "Amazon",
    shopify: "Shopify",
    ebay: "eBay",
    tiktok: "TikTok",
    other: "Other",
  };
  return labels[platform] || platform;
}

export function getAccountStats(accounts?: any[], stores?: any[]) {
  // TODO: Replace with real stats from API
  const byPlatform: Record<string, number> = {
    etsy: 0,
    amazon: 0,
    shopify: 0,
    ebay: 0,
    tiktok: 0,
    other: 0,
  };
  
  if (accounts) {
    accounts.forEach((acc) => {
      const platform = acc.platform?.type || "other";
      byPlatform[platform] = (byPlatform[platform] || 0) + 1;
    });
  }
  
  return {
    totalAccounts: accounts?.length || 0,
    activeAccounts: accounts?.filter((a) => a.status === "active").length || 0,
    totalStores: stores?.length || 0,
    activeStores: stores?.filter((s) => s.status === "active").length || 0,
    byPlatform,
  };
}

