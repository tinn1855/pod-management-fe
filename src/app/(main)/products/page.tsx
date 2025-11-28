"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppPagination } from "@/components/molecules/pagination";
import { ProductsTable } from "@/components/molecules/product-table";
import { mockProducts } from "@/data/product";
import { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CreateProductDialog } from "@/components/molecules/product-create-dialog";
import { Product } from "@/type/product";
import { ITEMS_PER_PAGE } from "@/constants";
import { CategoryManagement } from "@/components/molecules/category-management";

// Get unique categories from products
const categories = [...new Set(mockProducts.map((p) => p.category))];

export default function Products() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);
  const view = searchParams.get("view") ?? "products";

  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  const handleEdit = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDelete = (product: Product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  return (
    <section className="space-y-6">
      {view === "products" ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Product Management</h1>
            <CreateProductDialog />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Input
              placeholder="Search products..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in stock">In Stock</SelectItem>
                <SelectItem value="out of stock">Out of Stock</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
            products
          </div>

          <ProductsTable
            products={paginatedProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {totalPages > 1 && (
            <Suspense fallback={<div>Loading...</div>}>
              <AppPagination totalPages={totalPages} />
            </Suspense>
          )}
        </>
      ) : (
        <CategoryManagement categories={categories} />
      )}
    </section>
  );
}
