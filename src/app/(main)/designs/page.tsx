"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Search, Upload, Folder } from "lucide-react";
import { useState } from "react";
// TODO: Replace with API call
// import { useDesigns } from "@/hooks/use-designs";
import { toast } from "sonner";
import { DESIGN_STATUS_BADGE_VARIANTS } from "@/constants/badge-variants";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  revision: "Needs Revision",
};

export default function DesignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // TODO: Replace with API call
  // const { designs, loading } = useDesigns();
  const [designs] = useState<any[]>([]);
  const filteredDesigns = designs.filter((design) => {
    const matchesSearch = design.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || design.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleUpload = () => {
    toast.info("Upload design feature coming soon");
  };

  const handleManageFolders = () => {
    toast.info("Folder management feature coming soon");
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Designs Management</h1>
          <p className="text-muted-foreground">
            Manage design files and folders (PSD, PNG, AI, JPG, SVG)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleManageFolders}>
            <Folder />
            Manage Folders
          </Button>
          <Button onClick={handleUpload}>
            <Upload />
            Upload Design
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search designs..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="revision">Needs Revision</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Designs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDesigns.map((design) => (
          <Card
            key={design.id}
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="aspect-video bg-muted relative">
              {design.files.length > 0 && design.files[0].type === "png" ? (
                <img
                  src={design.files[0].url}
                  alt={design.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PenTool className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
              <Badge
                className="absolute top-2 right-2"
                variant={DESIGN_STATUS_BADGE_VARIANTS[design.status]}
              >
                {statusLabels[design.status]}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1 line-clamp-1">
                {design.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {design.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={design.designer.avatar} />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(design.designer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {design.designer.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="text-xs">{design.files.length} files</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {design.files.slice(0, 3).map((file: any) => (
                  <Badge
                    key={file.id}
                    variant="outline"
                    className="text-[10px]"
                  >
                    .{file.type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDesigns.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No designs found
        </div>
      )}
    </section>
  );
}
