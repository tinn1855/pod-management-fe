"use client";

import { useState, useMemo, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppPagination } from "@/components/molecules/pagination";
import { ITEMS_PER_PAGE } from "@/constants";
import { Category, CategoryManagementProps } from "@/type/category";

export function CategoryManagement({
  categories: initialCategories,
}: CategoryManagementProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);
  const idCounterRef = useRef(initialCategories.length);

  const [categories, setCategories] = useState<Category[]>(
    initialCategories.map((cat, index) => ({
      id: `cat-${index + 1}`,
      name: cat,
      slug: cat.toLowerCase().replace(/\s+/g, "-"),
      description: "",
    }))
  );
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

  const paginatedCategories = useMemo(() => {
    return categories.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [categories, currentPage]);

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    idCounterRef.current += 1;
    const newCategory: Category = {
      id: `cat-${idCounterRef.current}`,
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
      description: description.trim() || undefined,
    };

    setCategories((prev) => [...prev, newCategory]);
    toast.success("Category added successfully");
    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!name.trim() || !editingCategory) {
      toast.error("Category name cannot be empty");
      return;
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === editingCategory.id
          ? {
              ...cat,
              name: name.trim(),
              description: description.trim() || undefined,
              slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
            }
          : cat
      )
    );
    toast.success("Category updated successfully");
    resetForm();
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    toast.success("Category deleted successfully");
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingCategory(null);
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Product Categories</h2>
          <p className="text-sm text-muted-foreground">
            Manage product categories and types in the system
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Update product category information"
                  : "Add a new product category to the system"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g: T-Shirts, Pants..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description about this category..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={editingCategory ? handleUpdate : handleCreate}>
                {editingCategory ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No categories yet
                </TableCell>
              </TableRow>
            ) : (
              paginatedCategories.map((category, index) => {
                const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                return (
                  <TableRow key={category.id}>
                    <TableCell>{globalIndex + 1}</TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.slug}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.description || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {paginatedCategories.length} of {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </div>
          {totalPages > 1 && (
            <Suspense fallback={<div>Loading...</div>}>
              <AppPagination totalPages={totalPages} />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
}
