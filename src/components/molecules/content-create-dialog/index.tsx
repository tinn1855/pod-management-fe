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
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Upload, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Content, ContentMockup, Platform } from "@/type/content";
import { Design } from "@/type/idea";
import { User } from "@/type/user";
import { useUsers } from "@/hooks/use-users";
import { toast } from "sonner";
import { contentFormSchema, ContentFormValues } from "@/schema/content.schema";
import { PLATFORM_OPTIONS } from "@/utils/platform";
import { Combobox } from "@/components/ui/combobox";

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
      platform: undefined,
      designId: undefined,
      tags: "",
      seoTitle: "",
      seoDescription: "",
      keywords: "",
      category: "",
      priceMin: "",
      priceMax: "",
      autoPostEnabled: false,
    },
  });

  const handleSubmit = (values: ContentFormValues) => {
    // TODO: Get current user from auth context
    const createdBy = users && users.length > 0 ? users[0] : undefined;

    if (!createdBy) {
      toast.error("No user found. Please login again.");
      return;
    }

    const tags = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const keywords = values.keywords
      ? values.keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
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
        priceRange:
          values.priceMin && values.priceMax
            ? {
                min: parseFloat(values.priceMin),
                max: parseFloat(values.priceMax),
              }
            : undefined,
      },
      autoPostEnabled: values.autoPostEnabled || false,
      platforms: values.platforms
        ? (values.platforms as Platform[])
        : undefined,
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
          <Plus />
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
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g: Summer T-Shirt - Tropical Design"
                      {...field}
                    />
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
                    <FormControl>
                      <Combobox
                        options={PLATFORM_OPTIONS}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        placeholder="Select platform"
                        searchPlaceholder="Search platforms..."
                        emptyMessage="No platform found."
                      />
                    </FormControl>
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
                    <FormControl>
                      <Combobox
                        options={[
                          { value: "none", label: "No design linked" },
                          ...designs.map((design) => ({
                            value: design.id,
                            label: design.title,
                          })),
                        ]}
                        value={field.value || ""}
                        onValueChange={(value) =>
                          field.onChange(
                            value === "none" || value === "" ? undefined : value
                          )
                        }
                        placeholder="Select design (optional)"
                        searchPlaceholder="Search designs..."
                        emptyMessage="No design found."
                        className="w-full"
                      />
                    </FormControl>
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
                    <Input
                      placeholder="E.g: summer, tropical, beach, vacation"
                      {...field}
                    />
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
                    <Image
                      src={mockup.url}
                      alt={mockup.name}
                      fill
                      className="object-cover"
                      sizes="80px"
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
                      <Input
                        placeholder="Title displayed on search engines"
                        {...field}
                      />
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
                      <Input
                        placeholder="E.g: summer tshirt, beach wear"
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g: Clothing > T-Shirts"
                          {...field}
                        />
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

            {/* Auto-Post Settings */}
            <div className="border rounded-lg p-4">
              <FormField
                control={form.control}
                name="autoPostEnabled"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label
                          htmlFor="auto-post"
                          className="flex items-center gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          Enable Auto-Post via Extensions
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically post content to platforms using browser
                          extensions
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          id="auto-post"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
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
