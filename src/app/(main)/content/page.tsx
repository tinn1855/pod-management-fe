"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Search } from "lucide-react";
import { useContents } from "@/hooks/use-contents";
// TODO: Replace with API calls for designs
// import { useDesigns } from "@/hooks/use-designs";
import { useUsers } from "@/hooks/use-users";
import { Content, ContentStatus } from "@/type/content";
import { ContentTable } from "@/components/molecules/content-table";
import { ContentDetailDialog } from "@/components/molecules/content-detail-dialog";
import { CreateContentDialog } from "@/components/molecules/content-create-dialog";
import { ContentCrawlDialog } from "@/components/molecules/content-crawl-dialog";
import { AppPagination } from "@/components/molecules/pagination";
import { Loader2 } from "lucide-react";

import { getContentStats, getPlatformLabel } from "@/utils/content-helpers";
import { toast } from "sonner";
import { ITEMS_PER_PAGE } from "@/constants";
import { getPlatformOptions } from "@/utils/platform";
import { Combobox } from "@/components/ui/combobox";
import { CONTENT_PLATFORM_BADGE_OUTLINE_VARIANTS } from "@/constants/badge-variants";
import { Platform as ContentPlatform, CrawlContentInput } from "@/type/content";

function ContentPageContent() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  // Fetch contents from API
  const {
    contents: apiContents,
    loading,
    error,
    total,
    createContent,
    updateContent,
    updateContentStatus,
    deleteContent,
  } = useContents({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    platform: platformFilter !== "all" ? platformFilter : undefined,
  });

  // TODO: Replace with API calls for designs
  // const { designs } = useDesigns();
  const [designs, setDesigns] = useState<any[]>([]);
  const { users } = useUsers({ page: 1, limit: 1000 });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const stats = getContentStats(apiContents);

  const handleCreateContent = async (
    newContent: Omit<Content, "id" | "createdAt" | "updatedAt">
  ) => {
    await createContent(newContent);
  };

  const handleUpdateStatus = async (
    contentId: string,
    newStatus: ContentStatus
  ) => {
    await updateContentStatus(contentId, newStatus);
  };

  const handleUpdateContent = async (updatedContent: Content) => {
    await updateContent(updatedContent.id, updatedContent);
    // Update selectedContent if it's the same content being updated
    setSelectedContent((prev) =>
      prev?.id === updatedContent.id ? updatedContent : prev
    );
  };

  const handleDeleteContent = async (contentId: string) => {
    await deleteContent(contentId);
    // Clear selected content if it's the one being deleted
    setSelectedContent((prev) => (prev?.id === contentId ? null : prev));
  };

  const handleToggleAutoPost = async (contentId: string, enabled: boolean) => {
    await updateContent(contentId, { autoPostEnabled: enabled });
    // Update selectedContent if it's the same content being toggled
    if (selectedContent?.id === contentId) {
      setSelectedContent({
        ...selectedContent,
        autoPostEnabled: enabled,
      });
    }
  };

  const handleCrawlContent = async (input: CrawlContentInput) => {
    // TODO: Implement API call for crawling content
    toast.info("Content crawling feature coming soon");
  };

  // Get sellers for assignment
  const sellers = users.filter(
    (user) => user.role.name === "SELLER" || user.role.name === "Seller"
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Upload and manage content for e-commerce platforms
          </p>
        </div>
        <div className="flex gap-2">
          <ContentCrawlDialog designs={designs} onCrawl={handleCrawlContent} />
          <CreateContentDialog
            designs={designs}
            users={sellers}
            onSubmit={handleCreateContent}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        {[
          {
            status: "new" as ContentStatus,
            label: "New",
            color: "bg-blue-500",
          },
          {
            status: "fix_content" as ContentStatus,
            label: "Fix Content",
            color: "bg-red-500",
          },
          {
            status: "done_content" as ContentStatus,
            label: "Done",
            color: "bg-emerald-500",
          },
          {
            status: "listed" as ContentStatus,
            label: "Listed",
            color: "bg-green-500",
          },
        ].map((item) => (
          <Card key={item.status}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {apiContents.filter((c) => c.status === item.status).length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Stats */}
      <div className="flex flex-wrap gap-2">
        {(
          ["etsy", "amazon", "shopify", "ebay", "other"] as ContentPlatform[]
        ).map((platform) => {
          const count =
            platform === "other"
              ? apiContents.filter((c) => c.platform === "other").length
              : stats.byPlatform[platform] || 0;
          return (
            <Badge
              key={platform}
              variant={
                platformFilter === platform
                  ? CONTENT_PLATFORM_BADGE_OUTLINE_VARIANTS[platform]
                  : "outline"
              }
              className="cursor-pointer"
              onClick={() =>
                setPlatformFilter(
                  platform === platformFilter ? "all" : platform
                )
              }
            >
              {getPlatformLabel(platform)}: {count}
            </Badge>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="fix_content">Fix Content</SelectItem>
            <SelectItem value="done_content">Done Content</SelectItem>
            <SelectItem value="listed">Listed</SelectItem>
          </SelectContent>
        </Select>

        <Combobox
          options={getPlatformOptions(true)}
          value={platformFilter}
          onValueChange={setPlatformFilter}
          placeholder="Platform"
          searchPlaceholder="Search platforms..."
          emptyMessage="No platform found."
          className="w-[140px]"
        />
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { status: "all", label: "All", count: stats.total },
          { status: "new", label: "New", count: stats.new },
          {
            status: "fix_content",
            label: "Fix Content",
            count: stats.fixContent,
          },
          {
            status: "done_content",
            label: "Done Content",
            count: stats.doneContent,
          },
          { status: "listed", label: "Listed", count: stats.listed },
        ].map((item) => (
          <Button
            key={item.status}
            variant={statusFilter === item.status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(item.status)}
            className="h-8"
          >
            {item.label}
            <Badge variant="secondary" className="ml-2 h-5 px-1.5">
              {item.count}
            </Badge>
          </Button>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {apiContents.length} of {total} content items
      </div>

      {/* Content Table */}
      {loading && apiContents.length === 0 ? (
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Loading contents...</p>
        </div>
      ) : error && apiContents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="text-destructive">Error: {error}</p>
        </div>
      ) : (
        <ContentTable
          contents={apiContents}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteContent}
          onViewDetail={setSelectedContent}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Suspense fallback={<div>Loading...</div>}>
          <AppPagination totalPages={totalPages} />
        </Suspense>
      )}

      {/* Content Detail Dialog */}
      <ContentDetailDialog
        content={selectedContent}
        open={!!selectedContent}
        onOpenChange={(open) => !open && setSelectedContent(null)}
        onUpdateStatus={handleUpdateStatus}
        onToggleAutoPost={handleToggleAutoPost}
        onUpdate={handleUpdateContent}
      />
    </section>
  );
}

export default function ContentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">Loading...</div>
      }
    >
      <ContentPageContent />
    </Suspense>
  );
}
