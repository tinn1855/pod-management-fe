import { User } from "./user";
import { Design } from "./idea";

export type OrderStatus =
  | "pending"        // Đơn hàng mới
  | "processing"     // Đang xử lý
  | "designing"      // Đang thiết kế
  | "production"     // Đang sản xuất
  | "shipped"        // Đã gửi hàng
  | "delivered"      // Đã giao hàng
  | "cancelled";     // Đã hủy

export type OrderSource = "etsy" | "amazon" | "manual" | "shopify" | "other";

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
  source: OrderSource;
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
  source?: OrderSource;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

