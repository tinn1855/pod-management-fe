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
import { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CreateProductDialog } from "@/components/molecules/product-create-dialog";
import { Product } from "@/type/product";
import { ITEMS_PER_PAGE } from "@/constants";
import { CategoryManagement } from "@/components/molecules/category-management";
import { useProducts } from "@/hooks/use-products";
import { Loader2 } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);
  const view = searchParams.get("view") ?? "products";

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch products from API
  const {
    products: apiProducts,
    loading,
    error,
    total,
    updateProduct,
    deleteProduct,
  } = useProducts({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  // Get unique categories from products
  const categories = useMemo(() => {
    return [...new Set(apiProducts.map((p) => p.category))];
  }, [apiProducts]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleEdit = async (updatedProduct: Product) => {
    await updateProduct(updatedProduct.id, updatedProduct);
  };

  const handleDelete = async (product: Product) => {
    await deleteProduct(product.id);
  };

  // Loading state
  if (loading && apiProducts.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Product Management</h1>
        </div>
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Loading products...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error && apiProducts.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Product Management</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </section>
    );
  }

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
            Showing {apiProducts.length} of {total} products
          </div>

          <ProductsTable
            products={apiProducts}
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

export default function Products() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
