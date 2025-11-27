"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Content, ContentStatus } from "@/type/content";
import { getStatusLabel, getPlatformLabel } from "@/data/content";
import {
  CONTENT_STATUS_BADGE_OUTLINE_VARIANTS,
  CONTENT_PLATFORM_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";
import { formatCurrency } from "@/constants";
import {
  FileText,
  Tag,
  Image,
  Video,
  ExternalLink,
  Upload,
  Check,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

interface ContentDetailDialogProps {
  content: Content | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (contentId: string, newStatus: ContentStatus) => void;
}

const statusFlow: ContentStatus[] = ["new", "fix_content", "done_content", "listed"];

export function ContentDetailDialog({
  content,
  open,
  onOpenChange,
  onUpdateStatus,
}: ContentDetailDialogProps) {
  if (!content) return null;

  const handlePublish = () => {
    toast.info("Publishing content via extension...", {
      description: "This feature will be available soon",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant={CONTENT_PLATFORM_BADGE_OUTLINE_VARIANTS[content.platform]}>
                {getPlatformLabel(content.platform)}
              </Badge>
              <Badge variant={CONTENT_STATUS_BADGE_OUTLINE_VARIANTS[content.status]}>
                {getStatusLabel(content.status)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
            <p className="text-muted-foreground">{content.description}</p>
          </div>

          <Separator />

          {/* Mockups */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Image className="h-4 w-4" />
              Mockups ({content.mockups.length})
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {content.mockups.map((mockup) => (
                <div
                  key={mockup.id}
                  className="aspect-square rounded-lg overflow-hidden border"
                >
                  <img
                    src={mockup.url}
                    alt={mockup.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {content.mockups.length === 0 && (
                <div className="col-span-3 text-center py-8 text-muted-foreground border rounded-lg">
                  No mockups yet
                </div>
              )}
            </div>
          </div>

          {/* Video */}
          {content.video && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Video
                </h3>
                <Button variant="outline" size="sm" asChild>
                  <a href={content.video} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch Video
                  </a>
                </Button>
              </div>
            </>
          )}

          <Separator />

          {/* Tags */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              SEO Metadata
            </h3>
            <div className="space-y-3 bg-muted/50 rounded-lg p-4">
              {content.metadata.seoTitle && (
                <div>
                  <p className="text-xs text-muted-foreground">SEO Title</p>
                  <p className="font-medium">{content.metadata.seoTitle}</p>
                </div>
              )}
              {content.metadata.seoDescription && (
                <div>
                  <p className="text-xs text-muted-foreground">SEO Description</p>
                  <p className="text-sm">{content.metadata.seoDescription}</p>
                </div>
              )}
              {content.metadata.keywords && content.metadata.keywords.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Keywords</p>
                  <div className="flex flex-wrap gap-1">
                    {content.metadata.keywords.map((kw) => (
                      <Badge key={kw} variant="outline" className="text-xs">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {content.metadata.category && (
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm">{content.metadata.category}</p>
                </div>
              )}
              {content.metadata.priceRange && (
                <div>
                  <p className="text-xs text-muted-foreground">Price Range</p>
                  <p className="font-medium">
                    {formatCurrency(content.metadata.priceRange.min)} - {formatCurrency(content.metadata.priceRange.max)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Listing Info */}
          {content.listingId && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Listing Information
                </h3>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-700">Published to marketplace</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Listing ID: <code className="bg-muted px-1 rounded">{content.listingId}</code>
                  </p>
                  {content.listedAt && (
                    <p className="text-sm text-muted-foreground">
                      Listed on: {content.listedAt}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created By</p>
              <p className="font-medium">{content.createdBy.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created At</p>
              <p className="font-medium">{content.createdAt}</p>
            </div>
            {content.assignedTo && (
              <div>
                <p className="text-muted-foreground">Assigned To</p>
                <p className="font-medium">{content.assignedTo.name}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{content.updatedAt}</p>
            </div>
          </div>

          {/* Actions */}
          <Separator />
          <div className="flex flex-wrap gap-2">
            {statusFlow
              .filter((s) => s !== content.status)
              .map((status) => (
                <Button
                  key={status}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onUpdateStatus(content.id, status);
                    onOpenChange(false);
                  }}
                >
                  <Badge
                    variant={CONTENT_STATUS_BADGE_OUTLINE_VARIANTS[status]}
                    className="w-2 h-2 p-0 mr-2 rounded-full"
                  />
                  {getStatusLabel(status)}
                </Button>
              ))}
            {content.status === "done_content" && (
              <Button size="sm" onClick={handlePublish}>
                <Upload className="h-4 w-4 mr-2" />
                Publish to Marketplace
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
