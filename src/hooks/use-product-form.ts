import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  CreateProductInput,
  createProductSchema,
} from "@/schema/product.schema";

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
