import { z } from "zod";

// Variant schema
export const productVariantSchema = z.object({
  id: z.string(),
  size: z.string().min(1),
  color: z.string().min(1),
  price: z.number().min(0),
  stock: z.number().min(0).optional(),
});

// Image schema
export const productImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  alt: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

// Mockup schema
export const productMockupSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  name: z.string().min(1),
  type: z.enum(["front", "back", "side", "detail"]).optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  colors: z.array(z.string()).min(1, "At least one color is required"),
  variants: z.array(productVariantSchema).optional(),
  images: z.array(productImageSchema).optional(),
  mockups: z.array(productMockupSchema).optional(),
  status: z.enum(["in stock", "out of stock", "discontinued"]),
  description: z.string().min(1, "Description is required"),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  colors: z.array(z.string()).min(1, "At least one color is required"),
  variants: z.array(productVariantSchema).optional(),
  images: z.array(productImageSchema).optional(),
  mockups: z.array(productMockupSchema).optional(),
  status: z.enum(["in stock", "out of stock", "discontinued"]),
  description: z.string().min(1, "Description is required"),
});

// Category management schema
export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  slug: z.string().min(1),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
