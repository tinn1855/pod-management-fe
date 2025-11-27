"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/type/product";
import Image from "next/image";
import { formatCurrency } from "@/constants";

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
}: ProductDetailDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Product Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about the product {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thumbnail và thông tin cơ bản */}
          <div className="flex gap-6">
            <div className="shrink-0">
              <div className="aspect-square min-w-48 rounded-lg overflow-hidden border">
                <Image
                  src={product.thumbnail}
                  width={128}
                  height={128}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                {product.sku && (
                  <p className="text-sm text-muted-foreground">
                    SKU: {product.sku}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    product.status === "in stock"
                      ? "default"
                      : product.status === "out of stock"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {product.status === "in stock"
                    ? "In Stock"
                    : product.status === "out of stock"
                    ? "Out of Stock"
                    : "Discontinued"}
                </Badge>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(product.price)}
                </span>
              </div>

              <div>
                <span className="text-sm font-medium">Category:</span>
                <span className="ml-2 text-sm">{product.category}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Mô tả */}
          {product.description && (
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Sizes */}
          <div>
            <h4 className="font-semibold mb-2">
              Sizes ({product.sizes.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Badge key={size} variant="outline">
                  {size}
                </Badge>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h4 className="font-semibold mb-2">
              Colors ({product.colors.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <Badge key={color} variant="outline">
                  {color}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Thông tin cập nhật */}
          <div className="text-sm text-muted-foreground">
            <p>Last updated: {product.updatedAt}</p>
            <p>Product ID: {product.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
