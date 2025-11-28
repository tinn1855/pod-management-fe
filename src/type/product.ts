// Product Variant - combination of size and color with individual price
export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: number;
  stock?: number;
}

// Product Image
export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

// Product Mockup
export interface ProductMockup {
  id: string;
  url: string;
  name: string;
  type?: "front" | "back" | "side" | "detail";
}

export type Product = {
  id: string;
  thumbnail: string;
  name: string;
  sku?: string;
  category: string;
  sizes: string[];
  colors: string[];
  price: number; // Base price (can be overridden by variants)
  variants?: ProductVariant[]; // Individual variants with prices
  images?: ProductImage[]; // Multiple product images
  mockups?: ProductMockup[]; // Available mockups
  status: "in stock" | "out of stock" | "discontinued";
  updatedAt: string;
  description?: string;
};
