import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SquarePen } from "lucide-react";
import { Product } from "@/type/product";
import { EditProductDialog } from "../product-edit-dialog";
import { DeleteConfirmDialog } from "../product-delete-confirm-dialog";
import { ProductDetailDialog } from "../product-detail-dialog";
import { useState } from "react";
import { formatCurrency } from "@/constants";
import { REVERSE_CATEGORY_MAP } from "@/hooks/use-product-form";

interface ProductsTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdate = (updatedProduct: Product) => {
    onEdit?.(updatedProduct);
    setEditingProduct(null);
  };

  const handleViewDetail = (product: Product) => {
    setViewingProduct(product);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Sizes</TableHead>
            <TableHead>Colors</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products?.map((product, index) => (
            <TableRow
              key={product.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleViewDetail(product)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="aspect-square w-14 rounded-md overflow-hidden border bg-muted relative">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell className="font-semibold">
                <div>{product.name}</div>
              </TableCell>

              <TableCell>
                {REVERSE_CATEGORY_MAP[product.categoryId] || product.categoryId}
              </TableCell>
              <TableCell>
                {product.variations?.sizes?.length || 0} sizes
              </TableCell>
              <TableCell>
                {product.variations?.colors?.length || 0} colors
              </TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>
                <Badge variant={product.isActive ? "success" : "destructive"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell>{product.updatedAt}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(product);
                    }}
                  >
                    <SquarePen size={16} />
                  </Button>
                  <div onClick={(e) => e.stopPropagation()}>
                    <DeleteConfirmDialog
                      onConfirm={() => onDelete?.(product)}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditProductDialog
        product={editingProduct || undefined}
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
        onUpdate={handleUpdate}
      />

      <ProductDetailDialog
        product={viewingProduct}
        open={!!viewingProduct}
        onOpenChange={(open) => !open && setViewingProduct(null)}
      />
    </>
  );
}
