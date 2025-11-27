import { User } from "./user";
import { Store, PlatformType } from "./platform";

export type OrderStatus =
  | "pending"        // Đơn hàng mới
  | "processing"     // Đang xử lý
  | "designing"      // Đang thiết kế
  | "production"     // Đang sản xuất
  | "shipped"        // Đã gửi hàng
  | "delivered"      // Đã giao hàng
  | "cancelled";     // Đã hủy

// Keep for backward compatibility
export type OrderSource = PlatformType;

export interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  variant?: string;
  designId?: string;
  customDesignUrl?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  platform: PlatformType;  // Platform type (etsy, amazon, etc.)
  store?: Store;           // Store the order came from
  externalOrderId?: string; // ID từ Etsy/Amazon
  status: OrderStatus;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  notes?: string;
  designFiles?: string[];
  labelUrl?: string;
  trackingNumber?: string;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

// Order filters
export interface OrderFilters {
  status?: OrderStatus;
  platform?: PlatformType;
  storeId?: string;
  accountId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
