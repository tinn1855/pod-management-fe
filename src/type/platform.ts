// Platform types (Etsy, Amazon, Shopify, etc.)
export type PlatformType = "etsy" | "amazon" | "shopify" | "ebay" | "tiktok" | "manual" | "other";

export interface Platform {
  id: string;
  name: string;
  type: PlatformType;
  icon?: string;
  color: string;
  apiConnected: boolean;
}

// Account - tài khoản trên một platform
export interface Account {
  id: string;
  name: string;
  email: string;
  platform: Platform;
  status: "active" | "inactive" | "suspended";
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  connectedAt?: string;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Store - gian hàng thuộc một account
export interface Store {
  id: string;
  name: string;
  storeUrl?: string;
  account: Account;
  status: "active" | "inactive" | "vacation";
  currency: string;
  country: string;
  timezone?: string;
  totalOrders: number;
  totalRevenue: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

// Stats for dashboard
export interface AccountStats {
  totalAccounts: number;
  activeAccounts: number;
  totalStores: number;
  activeStores: number;
  byPlatform: Record<PlatformType, number>;
}

