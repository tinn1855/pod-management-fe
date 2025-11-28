import { Platform } from "@/type/content";

// Platform constants
export const PLATFORM_ORDER: readonly Platform[] = [
  "etsy",
  "amazon",
  "shopify",
  "ebay",
  "tiktok",
  "other",
] as const;

// Platform labels
export const PLATFORM_LABELS: Record<Platform, string> = {
  etsy: "Etsy",
  amazon: "Amazon",
  shopify: "Shopify",
  ebay: "eBay",
  tiktok: "TikTok Shop",
  other: "Other",
};

// Platform options for select/combobox
export const PLATFORM_OPTIONS = PLATFORM_ORDER.map((platform) => ({
  value: platform,
  label: PLATFORM_LABELS[platform],
}));

// Get platform label
export const getPlatformLabel = (platform: Platform): string => {
  return PLATFORM_LABELS[platform] || platform;
};

// Get platform options (with optional "All" option)
export const getPlatformOptions = (includeAll = false) => {
  const options = PLATFORM_OPTIONS;
  if (includeAll) {
    return [{ value: "all", label: "All Platforms" }, ...options];
  }
  return options;
};

