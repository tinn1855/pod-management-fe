import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { ProductInput, productSchema } from "@/schema/product.schema";
import { Product } from "@/type/product";

export const CATEGORY_MAP: Record<string, number> = {
  tshirt: 1,
  hoodie: 2,
  shoes: 3,
  accessories: 4,
  pants: 5,
  shirts: 6,
  sweaters: 7,
  bags: 8,
  polo: 9,
  jackets: 10,
  shorts: 11,
  sportswear: 12,
};

export const REVERSE_CATEGORY_MAP: Record<number, string> = Object.entries(CATEGORY_MAP).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<number, string>);

export function useProductForm() {
  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: undefined,
      price: 0,
      images: [],
      variations: {
        sizes: [],
        colors: [],
      },
      mockups: [],
      isActive: true,
    },
  });

  return form;
}

export function useEditProductForm(product?: Product) {
  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      categoryId: product?.categoryId,
      price: product?.price || 0,
      images: product?.images || [],
      variations: {
        sizes: product?.variations?.sizes || [],
        colors: product?.variations?.colors || [],
      },
      mockups: product?.mockups || [],
      isActive: product?.isActive ?? true,
    },
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        price: product.price,
        images: product.images || [],
        variations: {
          sizes: product.variations?.sizes || [],
          colors: product.variations?.colors || [],
        },
        mockups: product.mockups || [],
        isActive: product.isActive,
      });
    }
  }, [product, form]);

  return form;
}
