"use client";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Content, ContentMockup, Platform } from "@/type/content";
import { Design } from "@/type/idea";
import { User } from "@/type/user";
import { mockUsers } from "@/data/user";
import { toast } from "sonner";
import { contentFormSchema, ContentFormValues } from "@/schema/content.schema";

interface CreateContentDialogProps {
  designs: Design[];
  users: User[];
  onSubmit: (content: Omit<Content, "id" | "createdAt" | "updatedAt">) => void;
}

export function CreateContentDialog({
  designs,
  users,
  onSubmit,
}: CreateContentDialogProps) {
  const [open, setOpen] = useState(false);
  const [mockups, setMockups] = useState<ContentMockup[]>([]);

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      platform: "etsy",
      designId: undefined,
      tags: "",
      seoTitle: "",
      seoDescription: "",
      keywords: "",
      category: "",
      priceMin: "",
      priceMax: "",
    },
  });

  const handleSubmit = (values: ContentFormValues) => {
    const createdBy = mockUsers[1]; // Current user (Seller)

    const tags = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const keywords = values.keywords
      ? values.keywords.split(",").map((k) => k.trim()).filter((k) => k.length > 0)
      : undefined;

    onSubmit({
      title: values.title,
      description: values.description,
      status: "new",
      platform: values.platform as Platform,
      designId: values.designId || undefined,
      tags,
      mockups,
      metadata: {
        seoTitle: values.seoTitle || undefined,
        seoDescription: values.seoDescription || undefined,
        keywords,
        category: values.category || undefined,
        priceRange: values.priceMin && values.priceMax
          ? { min: parseFloat(values.priceMin), max: parseFloat(values.priceMax) }
          : undefined,
      },
      createdBy,
    });

    form.reset();
    setMockups([]);
    setOpen(false);
  };

  const handleAddMockup = () => {
    toast.info("Mockup upload feature coming soon", {
      description: "You can add mockup images soon",
    });
  };

  const handleRemoveMockup = (mockupId: string) => {
    setMockups((prev) => prev.filter((m) => m.id !== mockupId));
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
      setMockups([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
          <DialogDescription>
            Create content for products to list on e-commerce platforms
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g: Summer T-Shirt - Tropical Design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed product description..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="etsy">Etsy</SelectItem>
                        <SelectItem value="amazon">Amazon</SelectItem>
                        <SelectItem value="shopify">Shopify</SelectItem>
                        <SelectItem value="ebay">eBay</SelectItem>
                        <SelectItem value="tiktok">TikTok Shop</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="designId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link to Design</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} 
                      defaultValue={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select design (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No design linked</SelectItem>
                        {designs.map((design) => (
                          <SelectItem key={design.id} value={design.id}>
                            {design.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated) *</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g: summer, tropical, beach, vacation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mockups */}
            <div>
              <FormLabel className="mb-2 block">Mockups</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {mockups.map((mockup) => (
                  <div
                    key={mockup.id}
                    className="relative group w-20 h-20 rounded-md overflow-hidden border"
                  >
                    <img
                      src={mockup.url}
                      alt={mockup.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMockup(mockup.id)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddMockup}
                  className="w-20 h-20 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-[10px] mt-1">Add</span>
                </button>
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">SEO Metadata</h4>

              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title displayed on search engines" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Short description for SEO"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g: summer tshirt, beach wear" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g: Clothing > T-Shirts" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="priceMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priceMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Content</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
