"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProductForm } from "@/hooks/use-product-form";
import { ProductForm } from "../product-form";
import { ProductInput } from "@/schema/product.schema";
import { toast } from "sonner";

interface CreateProductDialogProps {
  onCreate: (data: ProductInput) => Promise<void>;
}

export function CreateProductDialog({ onCreate }: CreateProductDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useProductForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProductInput) => {
    try {
      setIsSubmitting(true);
      await onCreate(data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          New Product
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-4xl p-0 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-8 py-6 border-b">
          <DialogTitle>Create Product</DialogTitle>
        </DialogHeader>

        <ProductForm
          form={form}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
