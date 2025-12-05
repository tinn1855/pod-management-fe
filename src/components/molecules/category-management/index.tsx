"use client";

import { useState, Suspense } from "react";
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
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { AppPagination } from "@/components/molecules/pagination";
import { ITEMS_PER_PAGE } from "@/constants";
import { Category } from "@/type/category";
import { useCategories } from "@/hooks/use-categories";
import { Spinner } from "@/components/ui/spinner";

import { useDebounce } from "use-debounce";

// Updated props interface to be optional since we fetch internally now
interface CategoryManagementProps {
  categories?: Category[] | string[];
}

export function CategoryManagement({}: CategoryManagementProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const {
    categories,
    total,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      await createCategory({
        name: name.trim(),
        description: description.trim() || undefined,
        slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
      });
      resetForm();
      setDialogOpen(false);
    } catch {
      // Error handled in hook
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!name.trim() || !editingCategory) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      await updateCategory({
        id: editingCategory.id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
        },
      });
      resetForm();
      setDialogOpen(false);
    } catch {
      // Error handled in hook
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
    } catch (error) {
      // Error handled in hook
    }
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

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Spinner className="mr-2" /> Loading categories...
          </div>
        ) : (
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
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category, index) => {
                  const globalIndex =
                    (currentPage - 1) * ITEMS_PER_PAGE + index;
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
        )}
      </div>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {categories.length} of {total} categories
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
