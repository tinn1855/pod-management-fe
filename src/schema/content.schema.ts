import { z } from "zod";

export const contentFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  platform: z.enum(["etsy", "amazon", "shopify", "ebay", "tiktok", "other"]),
  designId: z.string().optional(),
  tags: z.string().min(1, "Please enter at least one tag"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  keywords: z.string().optional(),
  category: z.string().optional(),
  priceMin: z.string().optional(),
  priceMax: z.string().optional(),
});

export type ContentFormValues = z.infer<typeof contentFormSchema>;
