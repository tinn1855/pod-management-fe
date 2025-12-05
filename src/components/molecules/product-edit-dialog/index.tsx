"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEditProductForm } from "@/hooks/use-product-form";
import { ProductForm } from "../product-form";
import { Product } from "@/type/product";
import { ProductInput } from "@/schema/product.schema";

interface EditProductDialogProps {
  product?: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (product: Product) => Promise<void>;
}

export function EditProductDialog({
  product,
  open,
  onOpenChange,
  onUpdate,
}: EditProductDialogProps) {
  const form = useEditProductForm(product);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProductInput) => {
    if (!product) return;

    try {
      setIsSubmitting(true);
      const updatedProduct: Product = {
        ...product,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await onUpdate(updatedProduct);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl p-0 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-8 py-6 border-b">
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <ProductForm
          form={form}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  );
}
