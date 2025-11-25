import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ProductThumbnailUploader } from "../product-thumbnail-uploader";
import { ProductFormProps } from "@/type/product-form";

export function ProductForm({
  form,
  thumbnail,
  onThumbnailUpload,
  onThumbnailClear,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-8 py-8 space-y-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LEFT */}
          <div className="space-y-6 pr-4 border-r">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="sku"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="category"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1.5 w-full">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tshirt">T-Shirts</SelectItem>
                        <SelectItem value="hoodie">Hoodies</SelectItem>
                        <SelectItem value="shoes">Shoes</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1.5 w-full">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in stock">In Stock</SelectItem>
                        <SelectItem value="out of stock">
                          Out of Stock
                        </SelectItem>
                        <SelectItem value="discontinued">
                          Discontinued
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <ProductThumbnailUploader
              thumbnail={thumbnail}
              onUpload={onThumbnailUpload}
              onClear={onThumbnailClear}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[120px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Product</Button>
        </div>
      </form>
    </Form>
  );
}
