"use client";

import { useState } from "react";
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
import {
  FileText,
  Search,
  Download,
} from "lucide-react";
import {
  mockContents,
  getStatusLabel,
  getStatusColor,
  getPlatformLabel,
  getContentStats,
} from "@/data/content";
import { Content, ContentStatus } from "@/type/content";
import { ContentTable } from "@/components/molecules/content-table";
import { ContentDetailDialog } from "@/components/molecules/content-detail-dialog";
import { CreateContentDialog } from "@/components/molecules/content-create-dialog";
import { mockDesigns } from "@/data/idea";
import { mockUsers } from "@/data/user";
import { toast } from "sonner";

export default function ContentPage() {
  const [contents, setContents] = useState<Content[]>(mockContents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  // Filter contents
  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || content.status === statusFilter;
    const matchesPlatform = platformFilter === "all" || content.platform === platformFilter;
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const stats = getContentStats(contents);

  const handleCreateContent = (newContent: Omit<Content, "id" | "createdAt" | "updatedAt">) => {
    const content: Content = {
      ...newContent,
      id: `content-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setContents((prev) => [content, ...prev]);
    toast.success("Content created successfully");
  };

  const handleUpdateStatus = (contentId: string, newStatus: ContentStatus) => {
    setContents((prev) =>
      prev.map((content) =>
        content.id === contentId
          ? {
              ...content,
              status: newStatus,
              updatedAt: new Date().toISOString().split("T")[0],
              ...(newStatus === "listed" && { listedAt: new Date().toISOString().split("T")[0] }),
            }
          : content
      )
    );
    toast.success("Status updated successfully");
  };

  const handleDeleteContent = (contentId: string) => {
    setContents((prev) => prev.filter((c) => c.id !== contentId));
    toast.success("Content deleted successfully");
  };

  const handleCrawlContent = () => {
    toast.info("Crawling content from marketplace...", {
      description: "This feature will be available soon",
    });
  };

  // Get sellers for assignment
  const sellers = mockUsers.filter((user) => user.role.name === "Seller");

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
          <Button variant="outline" onClick={handleCrawlContent}>
            <Download className="mr-2 h-4 w-4" />
            Crawl from Platform
          </Button>
          <CreateContentDialog
            designs={mockDesigns}
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
          { status: "new" as ContentStatus, label: "New", color: "bg-blue-500" },
          { status: "fix_content" as ContentStatus, label: "Fix Content", color: "bg-red-500" },
          { status: "done_content" as ContentStatus, label: "Done", color: "bg-emerald-500" },
          { status: "listed" as ContentStatus, label: "Listed", color: "bg-green-500" },
        ].map((item) => (
          <Card key={item.status}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contents.filter((c) => c.status === item.status).length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Stats */}
      <div className="flex flex-wrap gap-2">
        {(["etsy", "amazon", "shopify", "ebay", "tiktok"] as const).map((platform) => (
          <Badge
            key={platform}
            variant="outline"
            className="cursor-pointer"
            onClick={() => setPlatformFilter(platform === platformFilter ? "all" : platform)}
            style={{
              borderColor: platformFilter === platform ? getPlatformLabel(platform) : undefined,
              backgroundColor: platformFilter === platform ? `${getPlatformLabel(platform)}10` : undefined,
            }}
          >
            {getPlatformLabel(platform)}: {stats.byPlatform[platform]}
          </Badge>
        ))}
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

        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="etsy">Etsy</SelectItem>
            <SelectItem value="amazon">Amazon</SelectItem>
            <SelectItem value="shopify">Shopify</SelectItem>
            <SelectItem value="ebay">eBay</SelectItem>
            <SelectItem value="tiktok">TikTok Shop</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { status: "all", label: "All", count: stats.total },
          { status: "new", label: "New", count: stats.new },
          { status: "fix_content", label: "Fix Content", count: stats.fixContent },
          { status: "done_content", label: "Done Content", count: stats.doneContent },
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

      {/* Content Table */}
      <ContentTable
        contents={filteredContents}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteContent}
        onViewDetail={setSelectedContent}
      />

      {/* Content Detail Dialog */}
      <ContentDetailDialog
        content={selectedContent}
        open={!!selectedContent}
        onOpenChange={(open) => !open && setSelectedContent(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </section>
  );
}

