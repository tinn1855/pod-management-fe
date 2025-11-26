import { Content, ContentStatus, Platform } from "@/type/content";
import { mockUsers } from "./user";
import { mockDesigns } from "./idea";

// Mock Content data
export const mockContents: Content[] = [
  {
    id: "content-1",
    title: "Summer Vibes T-Shirt - Tropical Paradise",
    description: "Áo thun mùa hè với họa tiết nhiệt đới tươi sáng, chất liệu cotton cao cấp, thoáng mát cho những ngày nắng nóng.",
    status: "listed",
    platform: "etsy",
    designId: "design-1",
    listingId: "ETSY-LIS-123456",
    tags: ["summer", "tropical", "t-shirt", "beach", "vacation"],
    mockups: [
      {
        id: "mockup-1",
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        name: "T-Shirt Front View",
        type: "image",
      },
      {
        id: "mockup-2",
        url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
        name: "T-Shirt Model",
        type: "image",
      },
    ],
    metadata: {
      seoTitle: "Summer Tropical T-Shirt | Beach Vibes Collection",
      seoDescription: "Premium cotton t-shirt with tropical paradise design. Perfect for summer vacations and beach days.",
      keywords: ["summer tshirt", "tropical shirt", "beach wear", "vacation outfit"],
      category: "Clothing > T-Shirts",
      priceRange: { min: 24.99, max: 29.99 },
    },
    createdBy: mockUsers[1], // Seller
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    listedAt: "2024-01-15",
  },
  {
    id: "content-2",
    title: "Coffee Lover Mug - Morning Motivation",
    description: "Cốc cà phê với quote truyền cảm hứng cho buổi sáng năng động. Chất liệu ceramic cao cấp, an toàn cho máy rửa bát.",
    status: "done_content",
    platform: "amazon",
    designId: "design-2",
    tags: ["coffee", "mug", "motivation", "morning", "quote"],
    mockups: [
      {
        id: "mockup-3",
        url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
        name: "Mug with Coffee",
        type: "image",
      },
    ],
    metadata: {
      seoTitle: "Motivational Coffee Mug | Morning Quote Cup",
      seoDescription: "Start your day with inspiration! Premium ceramic mug with motivational quote.",
      keywords: ["coffee mug", "motivational mug", "gift mug", "morning coffee"],
      category: "Home & Kitchen > Mugs",
      priceRange: { min: 14.99, max: 18.99 },
    },
    createdBy: mockUsers[1],
    createdAt: "2024-01-12",
    updatedAt: "2024-01-18",
  },
  {
    id: "content-3",
    title: "Street Style Hoodie - Urban Art",
    description: "Áo hoodie phong cách đường phố với graffiti art độc đáo. Chất liệu fleece ấm áp, phù hợp cho mùa thu đông.",
    status: "fix_content",
    platform: "etsy",
    designId: "design-3",
    tags: ["hoodie", "street style", "urban", "graffiti", "art"],
    mockups: [
      {
        id: "mockup-4",
        url: "https://images.unsplash.com/photo-1556906781-9a412961c28c",
        name: "Hoodie Front",
        type: "image",
      },
    ],
    metadata: {
      seoTitle: "Urban Street Hoodie | Graffiti Art Design",
      seoDescription: "Express your style with our urban graffiti hoodie. Premium fleece, perfect for streetwear lovers.",
      keywords: ["streetwear hoodie", "graffiti hoodie", "urban fashion"],
      category: "Clothing > Hoodies",
      priceRange: { min: 44.99, max: 54.99 },
    },
    createdBy: mockUsers[2],
    assignedTo: mockUsers[1],
    createdAt: "2024-01-14",
    updatedAt: "2024-01-19",
  },
  {
    id: "content-4",
    title: "Eco Tote Bag - Save The Planet",
    description: "Túi vải thân thiện môi trường với thông điệp bảo vệ trái đất. Cotton organic 100%, có thể tái sử dụng.",
    status: "listed",
    platform: "shopify",
    listingId: "SHOP-LIS-789012",
    tags: ["eco", "tote bag", "environment", "sustainable", "organic"],
    mockups: [
      {
        id: "mockup-5",
        url: "https://images.unsplash.com/photo-1544816155-12df9643f363",
        name: "Tote Bag Display",
        type: "image",
      },
    ],
    video: "https://example.com/tote-bag-video.mp4",
    metadata: {
      seoTitle: "Eco-Friendly Tote Bag | Sustainable Shopping Bag",
      seoDescription: "Join the eco movement with our 100% organic cotton tote bag. Stylish and sustainable.",
      keywords: ["eco tote", "sustainable bag", "organic cotton bag", "reusable bag"],
      category: "Bags > Tote Bags",
      priceRange: { min: 19.99, max: 24.99 },
    },
    createdBy: mockUsers[1],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-20",
    listedAt: "2024-01-20",
  },
  {
    id: "content-5",
    title: "Cute Animals Sticker Pack - Kawaii Collection",
    description: "Bộ sticker động vật dễ thương phong cách kawaii. Chất liệu vinyl chống nước, phù hợp cho laptop, sổ tay.",
    status: "new",
    platform: "etsy",
    tags: ["sticker", "kawaii", "cute", "animals", "vinyl"],
    mockups: [
      {
        id: "mockup-6",
        url: "https://images.unsplash.com/photo-1535591273668-578e31182c4f",
        name: "Sticker Pack Display",
        type: "image",
      },
    ],
    metadata: {
      seoTitle: "Kawaii Animal Stickers | Cute Vinyl Sticker Pack",
      seoDescription: "Adorable kawaii animal stickers for your laptop, notebook, and more. Waterproof vinyl.",
      keywords: ["kawaii stickers", "cute animal stickers", "vinyl stickers", "laptop stickers"],
      category: "Stickers & Labels",
      priceRange: { min: 7.99, max: 12.99 },
    },
    createdBy: mockUsers[2],
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "content-6",
    title: "Abstract Canvas Art - Modern Minimalist",
    description: "Tranh canvas nghệ thuật trừu tượng phong cách tối giản hiện đại. In chất lượng cao trên canvas cotton blend.",
    status: "new",
    platform: "amazon",
    tags: ["canvas", "abstract", "art", "minimalist", "modern"],
    mockups: [
      {
        id: "mockup-7",
        url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262",
        name: "Canvas on Wall",
        type: "image",
      },
    ],
    metadata: {
      seoTitle: "Abstract Canvas Wall Art | Modern Minimalist Decor",
      seoDescription: "Transform your space with our modern abstract canvas art. High-quality print on premium cotton blend canvas.",
      keywords: ["abstract art", "canvas print", "wall art", "modern decor"],
      category: "Wall Art > Canvas Prints",
      priceRange: { min: 49.99, max: 129.99 },
    },
    createdBy: mockUsers[1],
    createdAt: "2024-01-21",
    updatedAt: "2024-01-21",
  },
];

// Helper functions
export const getStatusLabel = (status: ContentStatus): string => {
  const labels: Record<ContentStatus, string> = {
    new: "New",
    fix_content: "Fix Content",
    done_content: "Done Content",
    listed: "Listed",
  };
  return labels[status];
};

export const getStatusColor = (status: ContentStatus): string => {
  const colors: Record<ContentStatus, string> = {
    new: "#3b82f6",        // blue
    fix_content: "#ef4444", // red
    done_content: "#10b981", // emerald
    listed: "#22c55e",      // green
  };
  return colors[status];
};

export const getPlatformLabel = (platform: Platform): string => {
  const labels: Record<Platform, string> = {
    etsy: "Etsy",
    amazon: "Amazon",
    shopify: "Shopify",
    ebay: "eBay",
    tiktok: "TikTok Shop",
    other: "Other",
  };
  return labels[platform];
};

export const getPlatformColor = (platform: Platform): string => {
  const colors: Record<Platform, string> = {
    etsy: "#f56400",
    amazon: "#ff9900",
    shopify: "#96bf48",
    ebay: "#e53238",
    tiktok: "#000000",
    other: "#6b7280",
  };
  return colors[platform];
};

// Get contents by status
export const getContentsByStatus = (contents: Content[], status: ContentStatus) =>
  contents.filter((c) => c.status === status);

// Get contents by platform
export const getContentsByPlatform = (contents: Content[], platform: Platform) =>
  contents.filter((c) => c.platform === platform);

// Calculate content stats
export const getContentStats = (contents: Content[]) => {
  return {
    total: contents.length,
    new: contents.filter((c) => c.status === "new").length,
    fixContent: contents.filter((c) => c.status === "fix_content").length,
    doneContent: contents.filter((c) => c.status === "done_content").length,
    listed: contents.filter((c) => c.status === "listed").length,
    byPlatform: {
      etsy: contents.filter((c) => c.platform === "etsy").length,
      amazon: contents.filter((c) => c.platform === "amazon").length,
      shopify: contents.filter((c) => c.platform === "shopify").length,
      ebay: contents.filter((c) => c.platform === "ebay").length,
      tiktok: contents.filter((c) => c.platform === "tiktok").length,
    },
  };
};

