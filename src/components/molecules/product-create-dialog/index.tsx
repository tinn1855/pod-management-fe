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
import { toast } from "sonner";
import { useProductForm } from "@/hooks/use-product-form";
import { useThumbnailUploader } from "@/hooks/use-thumbnail-uploader";
import { ProductForm } from "../product-form";

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const form = useProductForm();
  const { thumbnail, upload, reset } = useThumbnailUploader();

  const handleSubmit = () => {
    if (!thumbnail) return toast.error("Please upload a thumbnail.");

    toast.success("Product created!");
    form.reset();
    reset();
    setOpen(false);
  };

  const handleCancel = () => {
    form.reset();
    reset();
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Product
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-4xl p-0 rounded-2xl shadow-xl">
        <DialogHeader className="px-8 py-6 border-b">
          <DialogTitle>Create Product</DialogTitle>
        </DialogHeader>

        <ProductForm
          form={form}
          thumbnail={thumbnail}
          onThumbnailUpload={upload}
          onThumbnailClear={reset}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
