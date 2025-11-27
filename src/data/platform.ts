import {
  Platform,
  Account,
  Store,
  PlatformType,
  AccountStats,
} from "@/type/platform";

// ============================================
// PLATFORMS
// ============================================

export const mockPlatforms: Platform[] = [
  {
    id: "platform-etsy",
    name: "Etsy",
    type: "etsy",
    color: "#f56400",
    apiConnected: true,
  },
  {
    id: "platform-amazon",
    name: "Amazon",
    type: "amazon",
    color: "#ff9900",
    apiConnected: true,
  },
  {
    id: "platform-shopify",
    name: "Shopify",
    type: "shopify",
    color: "#96bf48",
    apiConnected: true,
  },
  {
    id: "platform-ebay",
    name: "eBay",
    type: "ebay",
    color: "#e53238",
    apiConnected: false,
  },
  {
    id: "platform-tiktok",
    name: "TikTok Shop",
    type: "tiktok",
    color: "#000000",
    apiConnected: false,
  },
  {
    id: "platform-manual",
    name: "Manual",
    type: "manual",
    color: "#6b7280",
    apiConnected: false,
  },
];

// ============================================
// ACCOUNTS - 15 accounts across platforms
// ============================================

const accountNames = [
  "POD Vietnam Store",
  "Creative Design Shop",
  "Art & Craft Hub",
  "Fashion Forward",
  "Print Paradise",
  "Design Studio Pro",
  "Custom Creations",
  "Unique Prints Co",
  "Trendy Tees Shop",
  "Gift Gallery Store",
  "Home Decor Plus",
  "Style Station",
  "Artisan Prints",
  "Modern Merch",
  "Premium POD Store",
];

function generateRandomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString();
}

function generateAccount(index: number, platform: Platform): Account {
  const name = accountNames[index % accountNames.length];
  const statusOptions: Array<"active" | "inactive" | "suspended"> = [
    "active",
    "active",
    "active",
    "inactive",
    "suspended",
  ];
  const createdAt = generateRandomDate(
    new Date("2023-01-01"),
    new Date("2024-06-01")
  );
  const connectedAt = generateRandomDate(
    new Date(createdAt),
    new Date("2024-08-01")
  );
  const lastSyncAt = generateRandomDate(
    new Date("2024-10-01"),
    new Date("2024-11-27")
  );

  return {
    id: `account-${platform.type}-${index + 1}`,
    name: `${name} (${platform.name})`,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@${
      platform.type
    }.seller.com`,
    platform,
    status: statusOptions[index % statusOptions.length],
    apiKey: platform.apiConnected
      ? `${platform.type}_api_key_${index + 1}`
      : undefined,
    connectedAt: platform.apiConnected ? connectedAt : undefined,
    lastSyncAt: platform.apiConnected ? lastSyncAt : undefined,
    createdAt,
    updatedAt: lastSyncAt,
  };
}

// Generate accounts: 5 Etsy, 4 Amazon, 3 Shopify, 2 eBay, 1 TikTok
export const mockAccounts: Account[] = [
  ...Array.from({ length: 5 }, (_, i) => generateAccount(i, mockPlatforms[0])), // Etsy
  ...Array.from({ length: 4 }, (_, i) =>
    generateAccount(i + 5, mockPlatforms[1])
  ), // Amazon
  ...Array.from({ length: 3 }, (_, i) =>
    generateAccount(i + 9, mockPlatforms[2])
  ), // Shopify
  ...Array.from({ length: 2 }, (_, i) =>
    generateAccount(i + 12, mockPlatforms[3])
  ), // eBay
  ...Array.from({ length: 1 }, (_, i) =>
    generateAccount(i + 14, mockPlatforms[4])
  ), // TikTok
];

// ============================================
// STORES - Multiple stores per account (30 total)
// ============================================

const storeNames = [
  "Main Store",
  "Premium Collection",
  "Budget Deals",
  "Seasonal Shop",
  "Outlet Store",
  "VIP Collection",
  "Flash Sale Store",
  "New Arrivals",
  "Bestsellers Hub",
  "Limited Edition",
];

const countries = [
  {
    code: "US",
    name: "United States",
    currency: "USD",
    timezone: "America/New_York",
  },
  {
    code: "UK",
    name: "United Kingdom",
    currency: "GBP",
    timezone: "Europe/London",
  },
  { code: "DE", name: "Germany", currency: "EUR", timezone: "Europe/Berlin" },
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    timezone: "Australia/Sydney",
  },
  { code: "CA", name: "Canada", currency: "CAD", timezone: "America/Toronto" },
  {
    code: "VN",
    name: "Vietnam",
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",
  },
];

function generateStore(index: number, account: Account): Store {
  const storeName = storeNames[index % storeNames.length];
  const country = countries[index % countries.length];
  const statusOptions: Array<"active" | "inactive" | "vacation"> = [
    "active",
    "active",
    "active",
    "inactive",
    "vacation",
  ];
  const createdAt = generateRandomDate(
    new Date(account.createdAt),
    new Date("2024-09-01")
  );
  const updatedAt = generateRandomDate(
    new Date(createdAt),
    new Date("2024-11-27")
  );

  return {
    id: `store-${account.platform.type}-${account.id.split("-").pop()}-${
      index + 1
    }`,
    name: `${storeName} - ${account.name.split(" (")[0]}`,
    storeUrl: `https://${account.platform.type}.com/shop/${storeName
      .toLowerCase()
      .replace(/\s+/g, "-")}-${index + 1}`,
    account,
    status: statusOptions[index % statusOptions.length],
    currency: country.currency,
    country: country.name,
    timezone: country.timezone,
    totalOrders: Math.floor(Math.random() * 500) + 50,
    totalRevenue: Math.floor(Math.random() * 50000) + 5000,
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    createdAt,
    updatedAt,
  };
}

// Generate 2-3 stores per account
export const mockStores: Store[] = mockAccounts.flatMap((account, accIndex) => {
  const storeCount = (accIndex % 3) + 1; // 1-3 stores per account
  return Array.from({ length: storeCount }, (_, i) =>
    generateStore(accIndex * 3 + i, account)
  );
});

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getPlatformByType = (type: PlatformType): Platform | undefined =>
  mockPlatforms.find((p) => p.type === type);

export const getAccountsByPlatform = (platformType: PlatformType): Account[] =>
  mockAccounts.filter((a) => a.platform.type === platformType);

export const getStoresByAccount = (accountId: string): Store[] =>
  mockStores.filter((s) => s.account.id === accountId);

export const getStoresByPlatform = (platformType: PlatformType): Store[] =>
  mockStores.filter((s) => s.account.platform.type === platformType);

export const getPlatformLabel = (type: PlatformType): string => {
  const labels: Record<PlatformType, string> = {
    etsy: "Etsy",
    amazon: "Amazon",
    shopify: "Shopify",
    ebay: "eBay",
    tiktok: "TikTok Shop",
    manual: "Manual",
    other: "Other",
  };
  return labels[type];
};

export const getPlatformColor = (type: PlatformType): string => {
  const colors: Record<PlatformType, string> = {
    etsy: "#f56400",
    amazon: "#ff9900",
    shopify: "#96bf48",
    ebay: "#e53238",
    tiktok: "#000000",
    manual: "#6b7280",
    other: "#9ca3af",
  };
  return colors[type];
};

export const getAccountStats = (): AccountStats => {
  const byPlatform: Record<PlatformType, number> = {
    etsy: 0,
    amazon: 0,
    shopify: 0,
    ebay: 0,
    tiktok: 0,
    manual: 0,
    other: 0,
  };

  mockAccounts.forEach((account) => {
    byPlatform[account.platform.type]++;
  });

  return {
    totalAccounts: mockAccounts.length,
    activeAccounts: mockAccounts.filter((a) => a.status === "active").length,
    totalStores: mockStores.length,
    activeStores: mockStores.filter((s) => s.status === "active").length,
    byPlatform,
  };
};
