import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.number().int().positive("Category is required"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  variations: z.object({
    sizes: z.array(z.string()).min(1, "At least one size is required"),
    colors: z.array(z.string()).min(1, "At least one color is required"),
  }),
  mockups: z.array(z.string().url()).optional(),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;
