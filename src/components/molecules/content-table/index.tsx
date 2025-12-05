"use client";

import Image from "next/image";
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
import { getStatusLabel, getPlatformLabel } from "@/utils/content-helpers";
import {
  CONTENT_STATUS_BADGE_OUTLINE_VARIANTS,
  CONTENT_PLATFORM_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";
import {
  Eye,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Video,
} from "lucide-react";

interface ContentTableProps {
  contents: Content[];
  onUpdateStatus: (contentId: string, newStatus: ContentStatus) => void;
  onDelete: (contentId: string) => void;
  onViewDetail: (content: Content) => void;
}

const statusFlow: ContentStatus[] = [
  "new",
  "fix_content",
  "done_content",
  "listed",
];

export function ContentTable({
  contents,
  onUpdateStatus,
  onDelete,
  onViewDetail,
}: ContentTableProps) {
  return (
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
              {content.mockups.length > 0 && content.mockups[0].url ? (
                <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                  <Image
                    src={content.mockups[0].url}
                    alt={content.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-md border flex items-center justify-center bg-muted">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
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
                variant={
                  CONTENT_PLATFORM_BADGE_OUTLINE_VARIANTS[content.platform]
                }
              >
                {getPlatformLabel(content.platform)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={CONTENT_STATUS_BADGE_OUTLINE_VARIANTS[content.status]}
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
                  <ImageIcon className="h-3 w-3" />
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
            <TableCell className="text-muted-foreground text-sm">-</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem onClick={() => onViewDetail(content)}>
                    <Eye />
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
                        <Badge
                          variant={
                            CONTENT_STATUS_BADGE_OUTLINE_VARIANTS[status]
                          }
                          className="p-0 mr-2 rounded-full"
                        />
                        {getStatusLabel(status)}
                      </DropdownMenuItem>
                    ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(content.id)}
                  >
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
        {contents.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={9}
              className="text-center py-10 text-muted-foreground"
            >
              No content found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
