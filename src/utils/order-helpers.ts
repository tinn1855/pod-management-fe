import { Order, OrderStatus } from "@/type/order";
import { PlatformType } from "@/type/platform";

export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: "Pending",
    processing: "Processing",
    designing: "Designing",
    production: "Production",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
}

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

export function getOrderStats(orders: Order[]) {
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    designing: orders.filter((o) => o.status === "designing").length,
    production: orders.filter((o) => o.status === "production").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0),
  };
  return stats;
}

