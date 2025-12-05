"use client";

import Image from "next/image";
import Link from "next/link";
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
import { getStatusLabel, getPlatformLabel } from "@/utils/content-helpers";
import {
  CONTENT_STATUS_BADGE_OUTLINE_VARIANTS,
  CONTENT_PLATFORM_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";
import { formatCurrency } from "@/constants";
import {
  FileText,
  Tag,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Upload,
  Check,
  Globe,
  Download,
  Sparkles,
  Link2,
  Pencil,
  X,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ContentDetailDialogProps {
  content: Content | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (contentId: string, newStatus: ContentStatus) => void;
  onToggleAutoPost?: (contentId: string, enabled: boolean) => void;
  onUpdate?: (content: Content) => void;
}

const statusFlow: ContentStatus[] = [
  "new",
  "fix_content",
  "done_content",
  "listed",
];

export function ContentDetailDialog({
  content,
  open,
  onOpenChange,
  onUpdateStatus,
  onToggleAutoPost,
  onUpdate,
}: ContentDetailDialogProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [editingMetadata, setEditingMetadata] = useState(false);

  // Get current metadata or use empty object
  const getCurrentMetadata = () => content?.metadata || {};
  const [editMetadata, setEditMetadata] = useState(getCurrentMetadata);

  if (!content) return null;

  // Title editing handlers
  const handleStartEditTitle = () => {
    setEditTitle(content.title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (!editTitle.trim()) return;
    if (editTitle.trim() !== content.title) {
      onUpdate?.({
        ...content,
        title: editTitle.trim(),
        updatedAt: new Date().toISOString().split("T")[0],
      });
    }
    setIsEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    setEditTitle("");
    setIsEditingTitle(false);
  };

  // Description editing handlers
  const handleStartEditDescription = () => {
    setEditDescription(content.description);
    setIsEditingDescription(true);
  };

  const handleSaveDescription = () => {
    if (editDescription.trim() !== content.description) {
      onUpdate?.({
        ...content,
        description: editDescription.trim(),
        updatedAt: new Date().toISOString().split("T")[0],
      });
    }
    setIsEditingDescription(false);
  };

  const handleCancelEditDescription = () => {
    setEditDescription("");
    setIsEditingDescription(false);
  };

  // Tag handlers
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (content.tags.includes(newTag.trim().toLowerCase())) {
      setNewTag("");
      setIsAddingTag(false);
      return;
    }
    onUpdate?.({
      ...content,
      tags: [...content.tags, newTag.trim().toLowerCase()],
      updatedAt: new Date().toISOString().split("T")[0],
    });
    setNewTag("");
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tag: string) => {
    onUpdate?.({
      ...content,
      tags: content.tags.filter((t) => t !== tag),
      updatedAt: new Date().toISOString().split("T")[0],
    });
  };

  // Metadata handlers
  const handleStartEditMetadata = () => {
    setEditMetadata(content?.metadata || {});
    setEditingMetadata(true);
  };

  const handleSaveMetadata = () => {
    onUpdate?.({
      ...content,
      metadata: editMetadata,
      updatedAt: new Date().toISOString().split("T")[0],
    });
    setEditingMetadata(false);
  };

  const handleCancelEditMetadata = () => {
    setEditMetadata(content?.metadata || {});
    setEditingMetadata(false);
  };

  const handlePublish = () => {
    onUpdateStatus(content.id, "listed");
    toast.success("Content published to marketplace via extension");
  };

  const handleToggleAutoPost = (enabled: boolean) => {
    onToggleAutoPost?.(content.id, enabled);
    if (enabled) {
      toast.success("Auto-post enabled", {
        description: "Content will be automatically posted via extensions",
      });
    } else {
      toast.error("Auto-post disabled", {
        description: "Content will not be automatically posted",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText />
              Content Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  CONTENT_PLATFORM_BADGE_OUTLINE_VARIANTS[content.platform]
                }
              >
                {getPlatformLabel(content.platform)}
              </Badge>
              <Badge
                variant={CONTENT_STATUS_BADGE_OUTLINE_VARIANTS[content.status]}
              >
                {getStatusLabel(content.status)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title & Description */}
          <div>
            {isEditingTitle ? (
              <div className="space-y-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-xl font-semibold"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveTitle}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEditTitle}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between group">
                <h2 className="text-xl font-semibold mb-2 flex-1">
                  {content.title}
                </h2>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleStartEditTitle}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
            {isEditingDescription ? (
              <div className="space-y-2 mt-2">
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="text-muted-foreground"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveDescription}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEditDescription}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between group mt-2">
                <p className="text-muted-foreground flex-1">
                  {content.description}
                </p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleStartEditDescription}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Mockups */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Mockups ({content.mockups.length})
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {content.mockups.map((mockup) => (
                <div
                  key={mockup.id}
                  className="relative aspect-square rounded-lg overflow-hidden border"
                >
                  <Image
                    src={mockup.url}
                    alt={mockup.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 150px"
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
                  <a
                    href={content.video}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch Video
                  </a>
                </Button>
              </div>
            </>
          )}

          {/* Design Link */}
          {content.design && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Linked Design
                </h3>
                <Link
                  href={`/designs?id=${content.design.id}`}
                  className="text-primary hover:underline inline-flex items-center gap-2"
                >
                  {content.design.title}
                  <ExternalLink className="h-3 w-3" />
                </Link>
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
                <Badge key={tag} variant="secondary" className="group/tag">
                  {tag}
                  {onUpdate && (
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 opacity-0 group-hover/tag:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {onUpdate && !isAddingTag && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddingTag(true)}
                  className="h-6"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Tag
                </Button>
              )}
              {isAddingTag && (
                <div className="flex items-center gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter tag"
                    className="h-6 w-32"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddTag();
                      } else if (e.key === "Escape") {
                        setIsAddingTag(false);
                        setNewTag("");
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleAddTag}
                    className="h-6"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsAddingTag(false);
                      setNewTag("");
                    }}
                    className="h-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4" />
                SEO Metadata
              </h3>
              {onUpdate && !editingMetadata && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStartEditMetadata}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>
            {editingMetadata ? (
              <div className="space-y-4 bg-muted/50 rounded-lg p-4">
                <div>
                  <Label>SEO Title</Label>
                  <Input
                    value={editMetadata.seoTitle || ""}
                    onChange={(e) =>
                      setEditMetadata({
                        ...editMetadata,
                        seoTitle: e.target.value,
                      })
                    }
                    placeholder="SEO title"
                  />
                </div>
                <div>
                  <Label>SEO Description</Label>
                  <Textarea
                    value={editMetadata.seoDescription || ""}
                    onChange={(e) =>
                      setEditMetadata({
                        ...editMetadata,
                        seoDescription: e.target.value,
                      })
                    }
                    placeholder="SEO description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Keywords (comma separated)</Label>
                  <Input
                    value={
                      Array.isArray(editMetadata.keywords)
                        ? editMetadata.keywords.join(", ")
                        : ""
                    }
                    onChange={(e) =>
                      setEditMetadata({
                        ...editMetadata,
                        keywords: e.target.value
                          .split(",")
                          .map((k) => k.trim())
                          .filter((k) => k.length > 0),
                      })
                    }
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={editMetadata.category || ""}
                    onChange={(e) =>
                      setEditMetadata({
                        ...editMetadata,
                        category: e.target.value,
                      })
                    }
                    placeholder="Category"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Min Price ($)</Label>
                    <Input
                      type="number"
                      value={editMetadata.priceRange?.min || ""}
                      onChange={(e) =>
                        setEditMetadata({
                          ...editMetadata,
                          priceRange: {
                            ...editMetadata.priceRange,
                            min: parseFloat(e.target.value) || 0,
                            max: editMetadata.priceRange?.max || 0,
                          },
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Max Price ($)</Label>
                    <Input
                      type="number"
                      value={editMetadata.priceRange?.max || ""}
                      onChange={(e) =>
                        setEditMetadata({
                          ...editMetadata,
                          priceRange: {
                            ...editMetadata.priceRange,
                            min: editMetadata.priceRange?.min || 0,
                            max: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveMetadata}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEditMetadata}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-muted/50 rounded-lg p-4">
                {content.metadata.seoTitle && (
                  <div>
                    <p className="text-xs text-muted-foreground">SEO Title</p>
                    <p className="font-medium">{content.metadata.seoTitle}</p>
                  </div>
                )}
                {content.metadata.seoDescription && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      SEO Description
                    </p>
                    <p className="text-sm">{content.metadata.seoDescription}</p>
                  </div>
                )}
                {content.metadata.keywords &&
                  content.metadata.keywords.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Keywords
                      </p>
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
                      {formatCurrency(content.metadata.priceRange.min)} -{" "}
                      {formatCurrency(content.metadata.priceRange.max)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Crawled Info */}
          {content.crawledFrom && content.crawledListingId && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Download />
                  Crawled Information
                </h3>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-blue-700">
                      Crawled from {getPlatformLabel(content.crawledFrom)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Listing ID:{" "}
                    <code className="bg-muted px-1 rounded">
                      {content.crawledListingId}
                    </code>
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Listing Info */}
          {(content.listingId || content.platformListings) && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Listing Information
                </h3>
                <div className="space-y-2">
                  {content.platformListings &&
                  content.platformListings.length > 0 ? (
                    content.platformListings.map((listing) => (
                      <div
                        key={listing.platform}
                        className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            <Badge
                              variant={
                                CONTENT_PLATFORM_BADGE_OUTLINE_VARIANTS[
                                  listing.platform
                                ]
                              }
                            >
                              {getPlatformLabel(listing.platform)}
                            </Badge>
                            {listing.autoPosted && (
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Auto-posted
                              </Badge>
                            )}
                          </div>
                        </div>
                        {listing.listingId && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Listing ID:
                            <code className="bg-muted px-1 rounded">
                              {listing.listingId}
                            </code>
                          </p>
                        )}
                        {listing.listedAt && (
                          <p className="text-sm text-muted-foreground">
                            Listed on: {listing.listedAt}
                          </p>
                        )}
                        {listing.extensionName && (
                          <p className="text-sm text-muted-foreground">
                            Extension: {listing.extensionName}
                          </p>
                        )}
                      </div>
                    ))
                  ) : content.listingId ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-green-700">
                          Published to marketplace
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Listing ID:{" "}
                        <code className="bg-muted px-1 rounded">
                          {content.listingId}
                        </code>
                      </p>
                      {content.listedAt && (
                        <p className="text-sm text-muted-foreground">
                          Listed on: {content.listedAt}
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          )}

          {/* Auto-post Settings */}
          <Separator />
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Auto-Post Settings
            </h3>
            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
              <div className="space-y-1">
                <Label htmlFor="auto-post" className="font-medium">
                  Enable Auto-Post via Extensions
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically post content to platforms using browser
                  extensions
                </p>
              </div>
              <Switch
                id="auto-post"
                checked={content.autoPostEnabled || false}
                onCheckedChange={handleToggleAutoPost}
              />
            </div>
          </div>

          <Separator />

          {/* Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created By</p>
              <p className="font-medium">
                {content.createdBy?.name || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Created At</p>
              <p className="font-medium">{content.createdAt}</p>
            </div>
            {content.assignedTo && (
              <div>
                <p className="text-muted-foreground">Assigned To</p>
                <p className="font-medium">
                  {content.assignedTo?.name || "Unknown"}
                </p>
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
