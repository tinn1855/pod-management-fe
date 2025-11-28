"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Platform, CrawlContentInput } from "@/type/content";
import { Design } from "@/type/idea";
import { toast } from "sonner";
import { z } from "zod";
import { PLATFORM_OPTIONS } from "@/utils/platform";
import { Combobox } from "@/components/ui/combobox";

const crawlContentSchema = z.object({
  platform: z.enum(["etsy", "amazon", "shopify", "ebay", "tiktok", "other"]),
  listingId: z.string().min(1, "Listing ID is required"),
  designId: z.string().optional(),
});

type CrawlContentFormValues = z.infer<typeof crawlContentSchema>;

interface ContentCrawlDialogProps {
  designs: Design[];
  onCrawl: (input: CrawlContentInput) => Promise<void>;
}

export function ContentCrawlDialog({
  designs,
  onCrawl,
}: ContentCrawlDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CrawlContentFormValues>({
    resolver: zodResolver(crawlContentSchema),
    defaultValues: {
      platform: undefined,
      listingId: "",
      designId: undefined,
    },
  });

  const handleSubmit = async (values: CrawlContentFormValues) => {
    setIsLoading(true);
    try {
      await onCrawl({
        platform: values.platform as Platform,
        listingId: values.listingId,
        designId: values.designId || undefined,
      });
      form.reset();
      setOpen(false);
      toast.success("Content crawled successfully");
    } catch (error) {
      toast.error("Failed to crawl content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download />
          Crawl from Platform
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crawl Content from Marketplace</DialogTitle>
          <DialogDescription>
            Fetch content from marketplace using product listing ID
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <Combobox
                      options={PLATFORM_OPTIONS}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      placeholder="Select platform"
                      searchPlaceholder="Search platforms..."
                      emptyMessage="No platform found."
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="listingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Listing ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter listing ID from marketplace"
                      {...field}
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
                  <FormLabel>Link to Design (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select design (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Crawling...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Crawl Content
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

