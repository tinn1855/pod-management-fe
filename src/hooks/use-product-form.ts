import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  CreateProductInput,
  createProductSchema,
  UpdateProductInput,
  updateProductSchema,
} from "@/schema/product.schema";
import { Product } from "@/type/product";

// Mapping from display name to value
const categoryDisplayToValue: Record<string, string> = {
  "T-Shirts": "tshirt",
  Hoodies: "hoodie",
  Shoes: "shoes",
  Accessories: "accessories",
  Pants: "pants",
  Shirts: "shirts",
  Sweaters: "sweaters",
  Bags: "bags",
  "Polo Shirts": "polo",
  Jackets: "jackets",
  Shorts: "shorts",
  Sportswear: "sportswear",
};

// Mapping from value to display name
const categoryValueToDisplay: Record<string, string> = {
  tshirt: "T-Shirts",
  hoodie: "Hoodies",
  shoes: "Shoes",
  accessories: "Accessories",
  pants: "Pants",
  shirts: "Shirts",
  sweaters: "Sweaters",
  bags: "Bags",
  polo: "Polo Shirts",
  jackets: "Jackets",
  shorts: "Shorts",
  sportswear: "Sportswear",
};

export function useProductForm() {
  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      price: 0,
      status: "in stock",
      description: "",
    },
  });

  // Generate SKU only when name changes
  useEffect(() => {
    const name = form.watch("name");

    if (!name) return;

    const sku = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .substring(0, 32)
      .toUpperCase();

    form.setValue("sku", sku);
  }, [form.watch("name")]);

  return form;
}

export function useEditProductForm(product?: Product) {
  const form = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category
        ? categoryDisplayToValue[product.category] || product.category
        : "",
      price: product?.price || 0,
      status: product?.status || "in stock",
      description: product?.description || "",
    },
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        category: categoryDisplayToValue[product.category] || product.category,
        price: product.price,
        status: product.status,
        description: product.description || "",
      });
    }
  }, [product, form]);

  return form;
}
