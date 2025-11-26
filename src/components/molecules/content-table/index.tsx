"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Content, ContentStatus } from "@/type/content";
import {
  getStatusLabel,
  getStatusColor,
  getPlatformLabel,
  getPlatformColor,
} from "@/data/content";
import {
  Eye,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Image,
  Video,
} from "lucide-react";

interface ContentTableProps {
  contents: Content[];
  onUpdateStatus: (contentId: string, newStatus: ContentStatus) => void;
  onDelete: (contentId: string) => void;
  onViewDetail: (content: Content) => void;
}

const statusFlow: ContentStatus[] = ["new", "fix_content", "done_content", "listed"];

export function ContentTable({
  contents,
  onUpdateStatus,
  onDelete,
  onViewDetail,
}: ContentTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Preview</TableHead>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-center">Media</TableHead>
            <TableHead>Listing ID</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contents.map((content) => (
            <TableRow
              key={content.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onViewDetail(content)}
            >
              <TableCell>
                {content.mockups.length > 0 ? (
                  <div className="w-12 h-12 rounded-md overflow-hidden border">
                    <img
                      src={content.mockups[0].url}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-md border flex items-center justify-center bg-muted">
                    <Image className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium line-clamp-1">{content.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {content.description}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: getPlatformColor(content.platform),
                    color: getPlatformColor(content.platform),
                  }}
                >
                  {getPlatformLabel(content.platform)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: `${getStatusColor(content.status)}20`,
                    color: getStatusColor(content.status),
                  }}
                >
                  {getStatusLabel(content.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {content.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {content.tags.length > 2 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      +{content.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Image className="h-3 w-3" />
                    <span className="text-xs">{content.mockups.length}</span>
                  </div>
                  {content.video && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Video className="h-3 w-3" />
                      <span className="text-xs">1</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {content.listingId ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono">{content.listingId}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {content.updatedAt}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => onViewDetail(content)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs font-medium text-muted-foreground">
                      Change Status:
                    </DropdownMenuItem>
                    {statusFlow
                      .filter((s) => s !== content.status)
                      .map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => onUpdateStatus(content.id, status)}
                        >
                          <div
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: getStatusColor(status) }}
                          />
                          {getStatusLabel(status)}
                        </DropdownMenuItem>
                      ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(content.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {contents.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                No content found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
