import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string(),
  category: z.string().min(1),
  price: z.number().min(0),
  status: z.enum(["in stock", "out of stock", "discontinued"]),
  description: z.string().min(1),
});

export const updateProductSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().min(0),
  status: z.enum(["in stock", "out of stock", "discontinued"]),
  description: z.string().min(1),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
