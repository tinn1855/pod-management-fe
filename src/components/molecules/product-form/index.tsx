import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
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
import { Switch } from "@/components/ui/switch";
import { ProductImageUploader } from "@/components/molecules/product-image-uploader";
import { ProductFormProps } from "@/type/product-form";
import { Path } from "react-hook-form";
import { CATEGORY_MAP } from "@/hooks/use-product-form";
import { PRODUCT_SIZES, PRODUCT_COLORS } from "@/utils/product-options";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SizeCheckboxProps {
  size: string;
  isChecked: boolean;
  onChange: (checked: boolean | string) => void;
}

const SizeCheckbox = ({ size, isChecked, onChange }: SizeCheckboxProps) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={`size-${size}`}
      checked={isChecked}
      onCheckedChange={onChange}
    />
    <Label
      htmlFor={`size-${size}`}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {size}
    </Label>
  </div>
);

interface ColorCheckboxProps {
  color: (typeof PRODUCT_COLORS)[number];
  isChecked: boolean;
  onChange: (checked: boolean | string) => void;
}

const ColorCheckbox = ({ color, isChecked, onChange }: ColorCheckboxProps) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={`color-${color.value}`}
      checked={isChecked}
      onCheckedChange={onChange}
    />
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded-full border shadow-sm"
        style={{ backgroundColor: color.hex }}
      />
      <Label
        htmlFor={`color-${color.value}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {color.name}
      </Label>
    </div>
  </div>
);

export function ProductForm<T extends Record<string, unknown>>({
  form,
  onSubmit,
  onCancel,
  mode = "create",
  isLoading,
}: ProductFormProps<T>) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-8 py-5 space-y-6"
      >
        <fieldset disabled={isLoading} className="contents group">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 group-disabled:opacity-50 transition-opacity">
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

              <FormField
                name={"categoryId" as Path<T>}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-1.5 w-full">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CATEGORY_MAP).map(([key, value]) => (
                            <SelectItem key={value} value={String(value)}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </SelectItem>
                          ))}
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
                name={"isActive" as Path<T>}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Product will be visible to users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Variations</FormLabel>
                <FormField
                  name={"variations.sizes" as Path<T>}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs mb-2 block">
                        Sizes
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-3">
                          {PRODUCT_SIZES.map((size) => {
                            const isChecked = (
                              field.value as string[]
                            )?.includes(size);

                            const handleCheckedChange = (
                              checked: boolean | string
                            ) => {
                              const current = (field.value as string[]) || [];
                              if (checked) {
                                field.onChange([...current, size]);
                              } else {
                                field.onChange(
                                  current.filter((val) => val !== size)
                                );
                              }
                            };

                            return (
                              <SizeCheckbox
                                key={size}
                                size={size}
                                isChecked={isChecked || false}
                                onChange={handleCheckedChange}
                              />
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name={"variations.colors" as Path<T>}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs mb-2 block">
                        Colors
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-3">
                          {PRODUCT_COLORS.map((color) => {
                            const isChecked = (
                              field.value as string[]
                            )?.includes(color.value);

                            const handleCheckedChange = (
                              checked: boolean | string
                            ) => {
                              const current = (field.value as string[]) || [];
                              if (checked) {
                                field.onChange([...current, color.value]);
                              } else {
                                field.onChange(
                                  current.filter((val) => val !== color.value)
                                );
                              }
                            };

                            return (
                              <ColorCheckbox
                                key={color.value}
                                color={color}
                                isChecked={isChecked || false}
                                onChange={handleCheckedChange}
                              />
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <FormField
                name={"images" as Path<T>}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <ProductImageUploader
                      label="Product Images"
                      images={(field.value as string[]) || []}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={"mockups" as Path<T>}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <ProductImageUploader
                      label="Mockups"
                      images={(field.value as string[]) || []}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
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
          <div className="flex justify-end gap-4 pt-6 border-t group-disabled:opacity-50 transition-opacity">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Submitting..."
                : mode === "create"
                ? "Create Product"
                : "Update Product"}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
