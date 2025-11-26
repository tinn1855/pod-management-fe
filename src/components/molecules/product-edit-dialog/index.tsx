"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useEditProductForm } from "@/hooks/use-product-form";
import { useThumbnailUploader } from "@/hooks/use-thumbnail-uploader";
import { ProductForm } from "../product-form";
import { Product } from "@/type/product";
import { UpdateProductInput } from "@/schema/product.schema";

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

interface EditProductDialogProps {
  product?: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (product: Product) => void;
}

export function EditProductDialog({
  product,
  open,
  onOpenChange,
  onUpdate,
}: EditProductDialogProps) {
  const form = useEditProductForm(product);
  const { thumbnail, upload, reset } = useThumbnailUploader();

  // Set initial thumbnail
  useState(() => {
    if (product?.thumbnail) {
      // Assuming thumbnail is a URL, set it somehow
      // For now, just note it
    }
  });

  const handleSubmit = (data: UpdateProductInput) => {
    if (!thumbnail && !product?.thumbnail)
      return toast.error("Please upload a thumbnail.");

    // Convert category value back to display name
    const displayCategory =
      categoryValueToDisplay[data.category] || data.category;

    // Simulate update
    const updatedProduct: Product = {
      ...product!,
      ...data,
      category: displayCategory,
      thumbnail: thumbnail || product!.thumbnail,
    };

    onUpdate(updatedProduct);
    toast.success("Product updated!");
    onOpenChange(false);
  };

  const handleCancel = () => {
    form.reset();
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl p-0 rounded-2xl shadow-xl">
        <DialogHeader className="px-8 py-6 border-b">
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <ProductForm
          form={form}
          thumbnail={thumbnail || product?.thumbnail || null}
          onThumbnailUpload={upload}
          onThumbnailClear={reset}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  );
}
