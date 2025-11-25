"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus } from "lucide-react";
import { AppPagination } from "@/components/molecules/pagination";
import { ProductsTable } from "@/components/molecules/product-table";
import { mockProducts } from "@/data/product";
import { useState } from "react";
import { CreateProductDialog } from "@/components/molecules/product-create-dialog";

export default function Products() {
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);

  const paginatedProducts = mockProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Products Manager</h1>
      <div className="flex gap-2">
        <Input placeholder="Search products..." />
        <div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          {/* <Button className="ml-2">
            <Plus />
            New
          </Button> */}
          <CreateProductDialog />
        </div>
      </div>
      {/* Product Table */}
      <ProductsTable products={paginatedProducts} />
      <AppPagination totalPages={totalPages} />
    </section>
  );
}
