import { Order, OrderStatus } from "@/type/order";
import { PlatformType } from "@/type/platform";
import { mockUsers } from "./user";
import { mockStores, getPlatformLabel, getPlatformColor } from "./platform";

// ============================================
// ORDER DATA GENERATORS
// ============================================

const orderStatuses: OrderStatus[] = [
  "pending",
  "processing",
  "designing",
  "production",
  "shipped",
  "delivered",
  "cancelled",
];

const customerFirstNames = [
  "John",
  "Sarah",
  "Michael",
  "Emily",
  "David",
  "Jessica",
  "Chris",
  "Amanda",
  "James",
  "Jennifer",
  "Robert",
  "Lisa",
  "William",
  "Ashley",
  "Daniel",
  "Nicole",
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Hoàng",
  "Huỳnh",
  "Phan",
  "Vũ",
];

const customerLastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Miller",
  "Davis",
  "Wilson",
  "Anderson",
  "Taylor",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Garcia",
  "Văn A",
  "Thị B",
  "Minh C",
  "Đức D",
  "Hữu E",
  "Quốc F",
  "Thanh G",
  "Kim H",
];

const cities = [
  { city: "New York", state: "NY", country: "United States", zip: "10001" },
  { city: "Los Angeles", state: "CA", country: "United States", zip: "90001" },
  { city: "Chicago", state: "IL", country: "United States", zip: "60601" },
  { city: "Houston", state: "TX", country: "United States", zip: "77001" },
  { city: "Seattle", state: "WA", country: "United States", zip: "98101" },
  {
    city: "San Francisco",
    state: "CA",
    country: "United States",
    zip: "94102",
  },
  { city: "Miami", state: "FL", country: "United States", zip: "33101" },
  { city: "Boston", state: "MA", country: "United States", zip: "02101" },
  { city: "Denver", state: "CO", country: "United States", zip: "80201" },
  { city: "Portland", state: "OR", country: "United States", zip: "97201" },
  { city: "Hồ Chí Minh", state: "", country: "Vietnam", zip: "700000" },
  { city: "Hà Nội", state: "", country: "Vietnam", zip: "100000" },
  { city: "Đà Nẵng", state: "", country: "Vietnam", zip: "550000" },
  { city: "London", state: "", country: "United Kingdom", zip: "SW1A 1AA" },
  { city: "Sydney", state: "NSW", country: "Australia", zip: "2000" },
];

const productItems = [
  {
    name: "Custom T-Shirt - Summer Vibes",
    sku: "TSHIRT-SUM",
    price: 25.99,
    variants: ["Size S, Black", "Size M, White", "Size L, Navy"],
  },
  {
    name: "Premium Hoodie - Street Art",
    sku: "HOODIE-ART",
    price: 45.99,
    variants: ["Size M, Gray", "Size L, Black", "Size XL, White"],
  },
  {
    name: "Coffee Lover Mug",
    sku: "MUG-COF",
    price: 15.99,
    variants: ["11oz", "15oz"],
  },
  {
    name: "Canvas Print - Abstract",
    sku: "CANVAS-ABS",
    price: 79.99,
    variants: ["16x20", "24x36", "30x40"],
  },
  {
    name: "Eco Tote Bag",
    sku: "TOTE-ECO",
    price: 22.99,
    variants: ["Natural", "Black"],
  },
  {
    name: "Sticker Pack - Kawaii",
    sku: "STICKER-KAW",
    price: 8.99,
    variants: ["Pack of 10", "Pack of 25"],
  },
  {
    name: "Phone Case - Minimal",
    sku: "PHONE-MIN",
    price: 29.99,
    variants: ["iPhone 14", "iPhone 15", "Samsung S23"],
  },
  {
    name: "Poster - Motivational",
    sku: "POSTER-MOT",
    price: 18.99,
    variants: ["12x18", "18x24", "24x36"],
  },
  {
    name: "Snapback Cap",
    sku: "CAP-SNAP",
    price: 24.99,
    variants: ["Black", "Navy", "Red"],
  },
  {
    name: "Jogger Pants",
    sku: "PANTS-JOG",
    price: 39.99,
    variants: ["Size S", "Size M", "Size L", "Size XL"],
  },
  {
    name: "Vintage Graphic Tee",
    sku: "TEE-VINT",
    price: 28.99,
    variants: ["Size M, Washed Black", "Size L, Washed Gray"],
  },
  {
    name: "Denim Jacket - Classic",
    sku: "JACKET-DEN",
    price: 69.99,
    variants: ["Size M", "Size L", "Size XL"],
  },
  {
    name: "Running Shoes",
    sku: "SHOES-RUN",
    price: 89.99,
    variants: ["Size 40", "Size 42", "Size 44"],
  },
  {
    name: "Leather Belt",
    sku: "BELT-LEA",
    price: 34.99,
    variants: ["Brown", "Black"],
  },
  {
    name: "Wool Scarf",
    sku: "SCARF-WOL",
    price: 29.99,
    variants: ["Gray", "Navy", "Burgundy"],
  },
];

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function formatDate(date: Date): string {
  return date.toISOString();
}

// Get seller users for assignment
const sellerUsers = mockUsers.filter((u) => u.role.name === "Seller");

function generateOrder(index: number): Order {
  const status = orderStatuses[index % orderStatuses.length];
  const store = mockStores[index % mockStores.length];
  const platform = store.account.platform.type;
  const cityInfo = cities[index % cities.length];
  const firstName = customerFirstNames[index % customerFirstNames.length];
  const lastName = customerLastNames[(index + 5) % customerLastNames.length];

  // Generate 1-3 items per order
  const itemCount = (index % 3) + 1;
  const items = Array.from({ length: itemCount }, (_, i) => {
    const product = productItems[(index + i) % productItems.length];
    const quantity = (i % 3) + 1;
    return {
      id: `item-${index}-${i}`,
      productName: product.name,
      sku: `${product.sku}-${String(index + 1).padStart(3, "0")}`,
      quantity,
      price: product.price,
      variant: product.variants[i % product.variants.length],
    };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost =
    cityInfo.country === "United States"
      ? 5.99 + (index % 5)
      : 12.99 + (index % 8);
  const tax = cityInfo.country === "United States" ? subtotal * 0.08 : 0;
  const total = subtotal + shippingCost + tax;

  const createdAt = generateRandomDate(
    new Date("2024-01-01"),
    new Date("2024-11-20")
  );
  const updatedAt = generateRandomDate(createdAt, new Date("2024-11-27"));

  let shippedAt: string | undefined;
  let deliveredAt: string | undefined;
  let trackingNumber: string | undefined;

  if (status === "shipped" || status === "delivered") {
    shippedAt = formatDate(generateRandomDate(createdAt, updatedAt));
    trackingNumber = `1Z999AA1${String(index + 1).padStart(10, "0")}`;
  }
  if (status === "delivered") {
    const shippedDate = shippedAt ? new Date(shippedAt) : createdAt;
    deliveredAt = formatDate(
      generateRandomDate(shippedDate, new Date(updatedAt))
    );
  }

  const order: Order = {
    id: `order-${index + 1}`,
    orderNumber: `ORD-2024-${String(index + 1).padStart(3, "0")}`,
    platform,
    store,
    status,
    customer: {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName
        .toLowerCase()
        .replace(/\s/g, "")}@email.com`,
      phone:
        index % 2 === 0
          ? `+1 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(
              Math.random() * 900 + 100
            )} ${Math.floor(Math.random() * 9000 + 1000)}`
          : undefined,
      address: `${100 + index} ${
        ["Main St", "Oak Ave", "Pine Rd", "Elm Dr", "Cedar Ln"][index % 5]
      }`,
      city: cityInfo.city,
      state: cityInfo.state || undefined,
      country: cityInfo.country,
      zipCode: cityInfo.zip,
    },
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    shippingCost: Math.round(shippingCost * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    currency: store.currency,
    notes:
      index % 4 === 0
        ? "Please handle with care"
        : index % 7 === 0
        ? "Gift wrapping requested"
        : undefined,
    assignedTo: sellerUsers[index % sellerUsers.length],
    createdAt: formatDate(createdAt),
    updatedAt: formatDate(updatedAt),
    shippedAt,
    deliveredAt,
    trackingNumber,
  };

  // Add external order ID for platform orders
  if (platform === "etsy") {
    order.externalOrderId = `ETSY-${Math.floor(
      Math.random() * 900000000 + 100000000
    )}`;
  } else if (platform === "amazon") {
    order.externalOrderId = `AMZ-${Math.floor(
      Math.random() * 900000000 + 100000000
    )}`;
  } else if (platform === "shopify") {
    order.externalOrderId = `SHOP-${Math.floor(
      Math.random() * 900000000 + 100000000
    )}`;
  }

  // Add design files for designing status
  if (status === "designing") {
    order.designFiles = ["/uploads/design-ref-" + (index + 1) + ".jpg"];
  }

  return order;
}

// Generate 100 orders
export const mockOrders: Order[] = Array.from({ length: 100 }, (_, i) =>
  generateOrder(i)
);

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    pending: "Pending",
    processing: "Processing",
    designing: "Designing",
    production: "Production",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status];
};

export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    pending: "#f59e0b", // amber
    processing: "#3b82f6", // blue
    designing: "#8b5cf6", // violet
    production: "#06b6d4", // cyan
    shipped: "#10b981", // emerald
    delivered: "#22c55e", // green
    cancelled: "#ef4444", // red
  };
  return colors[status];
};

// Re-export platform helpers
export { getPlatformLabel, getPlatformColor };

// Get orders by status
export const getOrdersByStatus = (orders: Order[], status: OrderStatus) =>
  orders.filter((order) => order.status === status);

// Get orders by platform
export const getOrdersByPlatform = (orders: Order[], platform: PlatformType) =>
  orders.filter((order) => order.platform === platform);

// Get orders by store
export const getOrdersByStore = (orders: Order[], storeId: string) =>
  orders.filter((order) => order.store?.id === storeId);

// Get orders by account
export const getOrdersByAccount = (orders: Order[], accountId: string) =>
  orders.filter((order) => order.store?.account.id === accountId);

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
