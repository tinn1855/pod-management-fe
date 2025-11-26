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
import { Path } from "react-hook-form";

export function ProductForm<T extends Record<string, unknown>>({
  form,
  thumbnail,
  onThumbnailUpload,
  onThumbnailClear,
  onSubmit,
  onCancel,
  mode = "create",
}: ProductFormProps<T>) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-8  py-5 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LEFT */}
          <div className="space-y-6 pr-4 border-r">
            <FormField
              name={"name" as Path<T>}
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value as string} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "create" && (
              <FormField
                name={"sku" as Path<T>}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input
                        readOnly
                        {...field}
                        value={field.value as string}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              name={"category" as Path<T>}
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1.5 w-full">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value as string}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tshirt">T-Shirts</SelectItem>
                        <SelectItem value="hoodie">Hoodies</SelectItem>
                        <SelectItem value="shoes">Shoes</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="pants">Pants</SelectItem>
                        <SelectItem value="shirts">Shirts</SelectItem>
                        <SelectItem value="sweaters">Sweaters</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="polo">Polo Shirts</SelectItem>
                        <SelectItem value="jackets">Jackets</SelectItem>
                        <SelectItem value="shorts">Shorts</SelectItem>
                        <SelectItem value="sportswear">Sportswear</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={"price" as Path<T>}
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={(field.value as number) ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={"status" as Path<T>}
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1.5 w-full">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value as string}
                      onValueChange={field.onChange}
                    >
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
              name={"description" as Path<T>}
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value as string}
                      className="min-h-[120px]"
                    />
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
          <Button type="submit">
            {mode === "create" ? "Create Product" : "Update Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
