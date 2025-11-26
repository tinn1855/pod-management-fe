import { Order, OrderStatus, OrderSource } from "@/type/order";
import { mockUsers } from "./user";

// Mock Orders data
export const mockOrders: Order[] = [
  {
    id: "order-1",
    orderNumber: "ORD-2024-001",
    source: "etsy",
    externalOrderId: "ETSY-123456789",
    status: "pending",
    customer: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 234 567 890",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "United States",
      zipCode: "10001",
    },
    items: [
      {
        id: "item-1",
        productName: "Custom T-Shirt - Summer Vibes",
        sku: "TSHIRT-SUM-001",
        quantity: 2,
        price: 25.99,
        variant: "Size M, Black",
      },
    ],
    subtotal: 51.98,
    shippingCost: 5.99,
    tax: 4.68,
    total: 62.65,
    currency: "USD",
    notes: "Please handle with care",
    assignedTo: mockUsers[1], // Seller
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "order-2",
    orderNumber: "ORD-2024-002",
    source: "amazon",
    externalOrderId: "AMZ-987654321",
    status: "processing",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      address: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      country: "United States",
      zipCode: "90001",
    },
    items: [
      {
        id: "item-2",
        productName: "Custom Mug - Coffee Lover",
        sku: "MUG-COF-001",
        quantity: 1,
        price: 15.99,
      },
      {
        id: "item-3",
        productName: "Sticker Pack - Cute Animals",
        sku: "STICKER-ANI-001",
        quantity: 3,
        price: 8.99,
      },
    ],
    subtotal: 42.96,
    shippingCost: 4.99,
    tax: 3.87,
    total: 51.82,
    currency: "USD",
    assignedTo: mockUsers[1],
    createdAt: "2024-01-19T14:20:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "order-3",
    orderNumber: "ORD-2024-003",
    source: "manual",
    status: "designing",
    customer: {
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "+84 123 456 789",
      address: "123 Nguyễn Huệ",
      city: "Hồ Chí Minh",
      country: "Vietnam",
      zipCode: "700000",
    },
    items: [
      {
        id: "item-4",
        productName: "Custom Hoodie - Street Style",
        sku: "HOODIE-STR-001",
        quantity: 1,
        price: 45.00,
        variant: "Size L, White",
        designId: "design-3",
      },
    ],
    subtotal: 45.00,
    shippingCost: 10.00,
    tax: 0,
    total: 55.00,
    currency: "USD",
    notes: "Khách yêu cầu thiết kế riêng",
    designFiles: ["/uploads/custom-hoodie-ref.jpg"],
    assignedTo: mockUsers[2],
    createdAt: "2024-01-18T08:00:00Z",
    updatedAt: "2024-01-20T11:30:00Z",
  },
  {
    id: "order-4",
    orderNumber: "ORD-2024-004",
    source: "etsy",
    externalOrderId: "ETSY-111222333",
    status: "production",
    customer: {
      name: "Emily Brown",
      email: "emily.b@email.com",
      address: "789 Pine Street",
      city: "Chicago",
      state: "IL",
      country: "United States",
      zipCode: "60601",
    },
    items: [
      {
        id: "item-5",
        productName: "Canvas Print - Abstract Art",
        sku: "CANVAS-ABS-001",
        quantity: 1,
        price: 79.99,
        variant: "24x36 inches",
      },
    ],
    subtotal: 79.99,
    shippingCost: 12.99,
    tax: 7.44,
    total: 100.42,
    currency: "USD",
    assignedTo: mockUsers[1],
    createdAt: "2024-01-17T16:45:00Z",
    updatedAt: "2024-01-19T10:00:00Z",
  },
  {
    id: "order-5",
    orderNumber: "ORD-2024-005",
    source: "amazon",
    externalOrderId: "AMZ-444555666",
    status: "shipped",
    customer: {
      name: "Michael Lee",
      email: "m.lee@email.com",
      address: "321 Elm Road",
      city: "Houston",
      state: "TX",
      country: "United States",
      zipCode: "77001",
    },
    items: [
      {
        id: "item-6",
        productName: "Tote Bag - Eco Friendly",
        sku: "TOTE-ECO-001",
        quantity: 2,
        price: 22.99,
      },
    ],
    subtotal: 45.98,
    shippingCost: 6.99,
    tax: 4.24,
    total: 57.21,
    currency: "USD",
    trackingNumber: "1Z999AA10123456784",
    assignedTo: mockUsers[1],
    createdAt: "2024-01-15T09:30:00Z",
    updatedAt: "2024-01-18T14:20:00Z",
    shippedAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "order-6",
    orderNumber: "ORD-2024-006",
    source: "etsy",
    externalOrderId: "ETSY-777888999",
    status: "delivered",
    customer: {
      name: "Jessica Wilson",
      email: "jessica.w@email.com",
      address: "654 Maple Lane",
      city: "Seattle",
      state: "WA",
      country: "United States",
      zipCode: "98101",
    },
    items: [
      {
        id: "item-7",
        productName: "Poster - Motivational Quotes",
        sku: "POSTER-MOT-001",
        quantity: 3,
        price: 18.99,
        variant: "18x24 inches",
      },
    ],
    subtotal: 56.97,
    shippingCost: 8.99,
    tax: 5.94,
    total: 71.90,
    currency: "USD",
    trackingNumber: "1Z999AA10123456785",
    assignedTo: mockUsers[2],
    createdAt: "2024-01-10T11:15:00Z",
    updatedAt: "2024-01-16T16:30:00Z",
    shippedAt: "2024-01-13T09:00:00Z",
    deliveredAt: "2024-01-16T16:30:00Z",
  },
  {
    id: "order-7",
    orderNumber: "ORD-2024-007",
    source: "manual",
    status: "cancelled",
    customer: {
      name: "David Chen",
      email: "d.chen@email.com",
      address: "987 Cedar Drive",
      city: "San Francisco",
      state: "CA",
      country: "United States",
      zipCode: "94102",
    },
    items: [
      {
        id: "item-8",
        productName: "Custom Phone Case",
        sku: "PHONE-CUS-001",
        quantity: 1,
        price: 29.99,
      },
    ],
    subtotal: 29.99,
    shippingCost: 4.99,
    tax: 2.84,
    total: 37.82,
    currency: "USD",
    notes: "Khách hủy do đổi ý",
    createdAt: "2024-01-12T13:00:00Z",
    updatedAt: "2024-01-13T10:00:00Z",
  },
];

// Helper functions
export const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    designing: "Đang thiết kế",
    production: "Đang sản xuất",
    shipped: "Đã gửi hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
  };
  return labels[status];
};

export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    pending: "#f59e0b",     // amber
    processing: "#3b82f6",  // blue
    designing: "#8b5cf6",   // violet
    production: "#06b6d4",  // cyan
    shipped: "#10b981",     // emerald
    delivered: "#22c55e",   // green
    cancelled: "#ef4444",   // red
  };
  return colors[status];
};

export const getSourceLabel = (source: OrderSource): string => {
  const labels: Record<OrderSource, string> = {
    etsy: "Etsy",
    amazon: "Amazon",
    manual: "Thủ công",
    shopify: "Shopify",
    other: "Khác",
  };
  return labels[source];
};

export const getSourceColor = (source: OrderSource): string => {
  const colors: Record<OrderSource, string> = {
    etsy: "#f56400",    // etsy orange
    amazon: "#ff9900",  // amazon orange
    manual: "#6b7280",  // gray
    shopify: "#96bf48", // shopify green
    other: "#9ca3af",   // gray
  };
  return colors[source];
};

// Get orders by status
export const getOrdersByStatus = (orders: Order[], status: OrderStatus) =>
  orders.filter((order) => order.status === status);

// Get orders by source
export const getOrdersBySource = (orders: Order[], source: OrderSource) =>
  orders.filter((order) => order.source === source);

// Calculate order stats
export const getOrderStats = (orders: Order[]) => {
  return {
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
};

