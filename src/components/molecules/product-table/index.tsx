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
            <TableHead>Price Range</TableHead>
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
                <div className="w-12 h-12 rounded-md overflow-hidden border">
                  <Image
                    src={`${product.thumbnail}`}
                    width={48}
                    height={48}
                    alt={product.name}
                    className="object-cover"
                  />
                </div>
              </TableCell>

              <TableCell className="font-semibold">
                <div>{product.name}</div>
                {product.sku && (
                  <span className="text-xs text-muted-foreground">
                    {product.sku}
                  </span>
                )}
              </TableCell>

              <TableCell>{product.category}</TableCell>
              <TableCell>{product.sizes.length} sizes</TableCell>
              <TableCell>{product.colors.length} colors</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    product.status === "in stock"
                      ? "success"
                      : product.status === "out of stock"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {product.status}
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
