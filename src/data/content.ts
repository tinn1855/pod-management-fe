import { Content, ContentStatus, Platform } from "@/type/content";
import { mockUsers } from "./user";

// ============================================
// CONTENT DATA GENERATORS
// ============================================

const contentStatuses: ContentStatus[] = [
  "new",
  "fix_content",
  "done_content",
  "listed",
];
const platforms: Platform[] = [
  "etsy",
  "amazon",
  "shopify",
  "ebay",
  "tiktok",
  "other",
];

const contentTitles = [
  "Summer Vibes T-Shirt - Tropical Paradise",
  "Coffee Lover Mug - Morning Motivation",
  "Street Style Hoodie - Urban Art",
  "Eco Tote Bag - Save The Planet",
  "Cute Animals Sticker Pack - Kawaii Collection",
  "Abstract Canvas Art - Modern Minimalist",
  "Vintage Graphic Tee - Retro Design",
  "Premium Poster - Typography Art",
  "Phone Case - Geometric Pattern",
  "Baseball Cap - Classic Logo",
  "Running Tank - Athletic Performance",
  "Yoga Pants - Zen Flow",
  "Travel Mug - Adventure Awaits",
  "Wall Art Print - Nature Photography",
  "Laptop Stickers - Tech Vibes",
  "Snapback Hat - Street Culture",
  "Messenger Bag - Urban Explorer",
  "Crewneck Sweater - Cozy Winter",
  "Denim Jacket Patch - Custom Design",
  "Enamel Pin Set - Collectible Series",
  "Beach Towel - Ocean Waves",
  "Throw Pillow - Boho Pattern",
  "Notebook Cover - Artistic Journal",
  "Keychain - Minimalist Design",
  "Mouse Pad - Gamer Edition",
];

const descriptions = [
  "Thiết kế độc đáo với họa tiết tươi sáng, chất liệu cao cấp, thoáng mát.",
  "Sản phẩm chất lượng cao với thông điệp truyền cảm hứng.",
  "Phong cách đường phố với graffiti art độc đáo, phù hợp cho giới trẻ.",
  "Thân thiện môi trường, cotton organic 100%, có thể tái sử dụng.",
  "Bộ sưu tập dễ thương phong cách kawaii, chất liệu vinyl chống nước.",
  "Nghệ thuật trừu tượng phong cách tối giản hiện đại, in chất lượng cao.",
  "Thiết kế vintage retro, mang đậm phong cách thập niên 80-90.",
  "Typography nghệ thuật, phù hợp trang trí không gian sống và làm việc.",
  "Pattern geometric hiện đại, bảo vệ điện thoại tối ưu.",
  "Logo classic, phù hợp mọi phong cách thời trang.",
];

const tagsList = [
  ["summer", "tropical", "t-shirt", "beach", "vacation", "colorful"],
  ["coffee", "mug", "motivation", "morning", "quote", "gift"],
  ["hoodie", "street style", "urban", "graffiti", "art", "fashion"],
  ["eco", "tote bag", "environment", "sustainable", "organic", "green"],
  ["sticker", "kawaii", "cute", "animals", "vinyl", "laptop"],
  ["canvas", "abstract", "art", "minimalist", "modern", "decor"],
  ["vintage", "retro", "graphic", "tee", "classic", "nostalgia"],
  ["poster", "typography", "wall art", "print", "design", "quote"],
  ["phone case", "geometric", "pattern", "protection", "style"],
  ["cap", "hat", "logo", "classic", "streetwear", "accessories"],
];

const mockupImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
  "https://images.unsplash.com/photo-1556906781-9a412961c28c",
  "https://images.unsplash.com/photo-1544816155-12df9643f363",
  "https://images.unsplash.com/photo-1535591273668-578e31182c4f",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
  "https://images.unsplash.com/photo-1534126511673-b6899657816a",
  "https://images.unsplash.com/photo-1602810316498-d8f7f6c88f65",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
  "https://images.unsplash.com/photo-1600185365929-3b1dfc84a2c6",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
];

const categories = [
  "Clothing > T-Shirts",
  "Clothing > Hoodies",
  "Home & Kitchen > Mugs",
  "Bags > Tote Bags",
  "Stickers & Labels",
  "Wall Art > Canvas Prints",
  "Wall Art > Posters",
  "Phone Cases",
  "Accessories > Hats",
  "Accessories > Bags",
];

function generateRandomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
}

// Get seller and designer users
const sellerUsers = mockUsers.filter((u) => u.role.name === "Seller");
const designerUsers = mockUsers.filter((u) => u.role.name === "Designer");

function generateContent(index: number): Content {
  const status = contentStatuses[index % contentStatuses.length];
  const platform = platforms[index % platforms.length];
  const titleBase = contentTitles[index % contentTitles.length];
  const variantNum = Math.floor(index / contentTitles.length) + 1;
  const title = variantNum > 1 ? `${titleBase} V${variantNum}` : titleBase;

  const createdAt = generateRandomDate(
    new Date("2024-01-01"),
    new Date("2024-10-01")
  );
  const updatedAt = generateRandomDate(
    new Date(createdAt),
    new Date("2024-11-27")
  );

  // Generate 1-3 mockups
  const mockupCount = (index % 3) + 1;
  const mockups = Array.from({ length: mockupCount }, (_, i) => ({
    id: `mockup-${index}-${i}`,
    url: mockupImages[(index + i) % mockupImages.length],
    name: `Product View ${i + 1}`,
    type: "image" as const,
  }));

  const basePrice = 10 + (index % 50);
  const priceRange = {
    min: basePrice + Math.random() * 5,
    max: basePrice + 10 + Math.random() * 20,
  };

  const content: Content = {
    id: `content-${index + 1}`,
    title,
    description: descriptions[index % descriptions.length],
    status,
    platform,
    tags: tagsList[index % tagsList.length],
    mockups,
    metadata: {
      seoTitle: `${title} | Premium Quality`,
      seoDescription: `Shop our ${title.toLowerCase()}. High quality materials, unique design. Perfect gift idea.`,
      keywords: tagsList[index % tagsList.length].slice(0, 4),
      category: categories[index % categories.length],
      priceRange: {
        min: Math.round(priceRange.min * 100) / 100,
        max: Math.round(priceRange.max * 100) / 100,
      },
    },
    createdBy: sellerUsers[index % sellerUsers.length],
    createdAt,
    updatedAt,
  };

  // Add design ID for some content
  if (index % 3 === 0) {
    content.designId = `design-${(index % 20) + 1}`;
  }

  // Add listing ID for listed content
  if (status === "listed") {
    const platformPrefix = platform.toUpperCase().slice(0, 4);
    content.listingId = `${platformPrefix}-LIS-${String(index + 1).padStart(
      6,
      "0"
    )}`;
    content.listedAt = generateRandomDate(
      new Date(updatedAt),
      new Date("2024-11-27")
    );
  }

  // Add assigned designer for fix_content status
  if (status === "fix_content") {
    content.assignedTo = designerUsers[index % designerUsers.length];
  }

  // Add video for some content
  if (index % 5 === 0) {
    content.video = `https://example.com/product-video-${index + 1}.mp4`;
  }

  return content;
}

// Generate 100 content items
export const mockContents: Content[] = Array.from({ length: 100 }, (_, i) =>
  generateContent(i)
);

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getStatusLabel = (status: ContentStatus): string => {
  const labels: Record<ContentStatus, string> = {
    new: "New",
    fix_content: "Fix Content",
    done_content: "Done Content",
    listed: "Listed",
  };
  return labels[status];
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

// Get contents by status
export const getContentsByStatus = (
  contents: Content[],
  status: ContentStatus
) => contents.filter((c) => c.status === status);

// Get contents by platform
export const getContentsByPlatform = (
  contents: Content[],
  platform: Platform
) => contents.filter((c) => c.platform === platform);

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
