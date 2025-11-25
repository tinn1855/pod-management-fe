import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SquarePen, Trash2 } from "lucide-react";
import { Product } from "@/type/product";

export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <Table>
      <TableCaption>Danh sách sản phẩm.</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Thumbnail</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Variants</TableHead>
          <TableHead>Sizes</TableHead>
          <TableHead>Colors</TableHead>
          <TableHead>Price Range</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products?.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.id}</TableCell>
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
            <TableCell>{product.variantCount} variants</TableCell>
            <TableCell>{product.sizes.length} sizes</TableCell>
            <TableCell>{product.colors.length} colors</TableCell>
            <TableCell>{product.price}</TableCell>
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
                <Button size="icon" variant="outline">
                  <SquarePen size={16} />
                </Button>
                <Button size="icon" variant="destructive">
                  <Trash2 size={16} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
