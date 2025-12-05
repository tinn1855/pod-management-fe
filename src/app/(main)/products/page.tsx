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
import { REVERSE_CATEGORY_MAP } from "@/hooks/use-product-form";
import { Spinner } from "@/components/ui/spinner";
import { ProductInput } from "@/schema";

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
    createProduct,
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
    const uniqueCategoryIds = [
      ...new Set(apiProducts.map((p) => p.categoryId)),
    ];
    return uniqueCategoryIds.map((id) => ({
      id: String(id),
      name: REVERSE_CATEGORY_MAP[id] || `Category ${id}`,
    }));
  }, [apiProducts]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleCreate = async (data: ProductInput) => {
    await createProduct(data);
  };

  const handleEdit = async (updatedProduct: Product) => {
    await updateProduct(updatedProduct.id, updatedProduct);
  };

  const handleDelete = async (product: Product) => {
    await deleteProduct(product.id);
  };

  if (loading && apiProducts.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Product Management</h1>
        </div>
        <div className="flex items-center justify-center py-12 gap-2">
          <Spinner /> Loading products...
        </div>
      </section>
    );
  }

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
            <CreateProductDialog onCreate={handleCreate} />
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
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
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
        <CategoryManagement categories={categories.map((c) => c.name)} />
      )}
    </section>
  );
}

export default function Products() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner /> Loading...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
