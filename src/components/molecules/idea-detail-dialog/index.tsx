"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatePicker } from "@/components/ui/date-picker";
import {
  IdeaStatus,
  IdeaComment,
  IdeaDetailDialogProps,
  PRIORITY_ORDER,
  Priority,
} from "@/type/idea";
import { STATUS_ORDER } from "@/type/kanban";
import { getStatusLabel } from "@/utils/idea-helpers";
import {
  getInitials,
  getDetailedDeadlineStatus,
  getPriorityLabel,
} from "@/utils/format";
import {
  IDEA_STATUS_BADGE_OUTLINE_VARIANTS,
  PRIORITY_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";
import {
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Plus,
  Send,
  Trash2,
  X,
  CheckCircle2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { DATE_FORMAT } from "@/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function IdeaDetailDialog({
  idea,
  open,
  onOpenChange,
  users,
  onUpdate,
  onDelete,
  onUpdateStatus,
}: IdeaDetailDialogProps) {
  const [newComment, setNewComment] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Edit states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  if (!idea) return null;

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: IdeaComment = {
      id: `comment-${Date.now()}`,
      content: newComment.trim(),
      author: users[0], // Current user - in real app, get from auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onUpdate({
      ...idea,
      comments: [...idea.comments, comment],
      updatedAt: new Date().toISOString(),
    });

    setNewComment("");
  };

  const handleDeleteComment = (commentId: string) => {
    onUpdate({
      ...idea,
      comments: idea.comments.filter((c) => c.id !== commentId),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAssignUser = (userId: string) => {
    const assignee =
      userId === "unassigned" ? undefined : users.find((u) => u.id === userId);
    onUpdate({
      ...idea,
      assignee,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (idea.tags.includes(newTag.trim().toLowerCase())) {
      setNewTag("");
      setIsAddingTag(false);
      return;
    }

    onUpdate({
      ...idea,
      tags: [...idea.tags, newTag.trim().toLowerCase()],
      updatedAt: new Date().toISOString(),
    });

    setNewTag("");
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tag: string) => {
    onUpdate({
      ...idea,
      tags: idea.tags.filter((t) => t !== tag),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSetDeadline = (date: Date | undefined) => {
    onUpdate({
      ...idea,
      deadline: date ? date.toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleChangePriority = (priority: Priority) => {
    onUpdate({
      ...idea,
      priority,
      updatedAt: new Date().toISOString(),
    });
  };

  // Title editing
  const handleStartEditTitle = () => {
    setEditTitle(idea.title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (!editTitle.trim()) return;
    if (editTitle.trim() !== idea.title) {
      onUpdate({
        ...idea,
        title: editTitle.trim(),
        updatedAt: new Date().toISOString(),
      });
    }
    setIsEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    setEditTitle("");
    setIsEditingTitle(false);
  };

  // Description editing
  const handleStartEditDescription = () => {
    setEditDescription(idea.description);
    setIsEditingDescription(true);
  };

  const handleSaveDescription = () => {
    if (editDescription.trim() !== idea.description) {
      onUpdate({
        ...idea,
        description: editDescription.trim(),
        updatedAt: new Date().toISOString(),
      });
    }
    setIsEditingDescription(false);
  };

  const handleCancelEditDescription = () => {
    setEditDescription("");
    setIsEditingDescription(false);
  };

  const deadlineStatus = idea.deadline
    ? getDetailedDeadlineStatus(idea.deadline)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={IDEA_STATUS_BADGE_OUTLINE_VARIANTS[idea.status]}
                >
                  {getStatusLabel(idea.status)}
                </Badge>
                <Badge variant={PRIORITY_BADGE_OUTLINE_VARIANTS[idea.priority]}>
                  {idea.priority}
                </Badge>
              </div>
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-xl font-semibold h-auto py-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveTitle();
                      if (e.key === "Escape") handleCancelEditTitle();
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0"
                    onClick={handleSaveTitle}
                  >
                    <CheckCircle2 className=" text-green-500" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCancelEditTitle}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ) : (
                <div className="group flex items-center gap-2">
                  <DialogTitle className="text-xl">{idea.title}</DialogTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleStartEditTitle}
                  >
                    <Pencil />
                  </Button>
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    onDelete(idea.id);
                    onOpenChange(false);
                  }}
                >
                  <Trash2 />
                  Delete Idea
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-6 py-4">
            {/* Main Content - 2 columns */}
            <div className="col-span-2 space-y-6">
              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info
                          size={12}
                          className="text-muted-foreground cursor-help"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>
                          Detailed description of the idea including
                          requirements, specifications, and any additional
                          notes.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {!isEditingDescription && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleStartEditDescription}
                    >
                      <Pencil />
                    </Button>
                  )}
                </div>
                {isEditingDescription ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="min-h-[120px] text-sm"
                      autoFocus
                      placeholder="Enter description..."
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEditDescription}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveDescription}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {idea.description || (
                      <span className="italic">No description</span>
                    )}
                  </p>
                )}
              </div>

              {/* References */}
              {idea.references.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Paperclip />
                    References ({idea.references.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {idea.references.map((ref) => (
                      <Link
                        key={ref.id}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block w-full max-w-52 aspect-square rounded-lg overflow-hidden border hover:border-primary transition-colors"
                      >
                        <Image
                          src={ref.url}
                          alt={ref.name}
                          className="object-cover"
                          fill
                          sizes="100px"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Comments Section */}
              <div>
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <MessageSquare />
                  Comments ({idea.comments.length})
                </h4>

                {/* Comment List */}
                <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
                  {idea.comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    idea.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 group">
                        <Avatar className=" shrink-0">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {getInitials(comment.author.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(
                                new Date(comment.createdAt),
                                {
                                  addSuffix: true,
                                  locale: vi,
                                }
                              )}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <X />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        handleAddComment();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    className="shrink-0 self-end"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    <Send />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Press Ctrl+Enter to send
                </p>
              </div>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-4 bg-muted/30 rounded-xl p-4 overflow-hidden">
              {/* Status */}
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={idea.status}
                  onValueChange={(value) =>
                    onUpdateStatus(idea.id, value as IdeaStatus)
                  }
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          IDEA_STATUS_BADGE_OUTLINE_VARIANTS[idea.status]
                        }
                        size="dot"
                      />
                      <span>{getStatusLabel(idea.status)}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_ORDER.map((status) => (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={IDEA_STATUS_BADGE_OUTLINE_VARIANTS[status]}
                            size="dot"
                          />
                          {getStatusLabel(status)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select
                  value={idea.priority}
                  onValueChange={(value) =>
                    handleChangePriority(value as Priority)
                  }
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={PRIORITY_BADGE_OUTLINE_VARIANTS[idea.priority]}
                        size="dot"
                      />
                      <span>{getPriorityLabel(idea.priority)}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_ORDER.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={PRIORITY_BADGE_OUTLINE_VARIANTS[priority]}
                            size="dot"
                          />
                          {getPriorityLabel(priority)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee */}
              <div className="space-y-1.5">
                <Label>Assignee</Label>
                <Select
                  value={idea.assignee?.id || "unassigned"}
                  onValueChange={handleAssignUser}
                >
                  <SelectTrigger className="w-full">
                    {idea.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5 shrink-0">
                          <AvatarImage src={idea.assignee.avatar} />
                          <AvatarFallback className="text-xs">
                            {getInitials(idea.assignee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{idea.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">
                      <span className="text-muted-foreground">Unassigned</span>
                    </SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          {user.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deadline */}
              <div className="space-y-1.5">
                <Label>Deadline</Label>
                <DatePicker
                  date={idea.deadline ? new Date(idea.deadline) : undefined}
                  onDateChange={handleSetDeadline}
                  placeholder="Set deadline"
                  className="w-full"
                  disablePastDates
                />
                {deadlineStatus && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      deadlineStatus.color
                    )}
                  >
                    <deadlineStatus.icon className="h-3 w-3" />
                    {deadlineStatus.label}
                  </div>
                )}
              </div>

              <Separator />

              {/* Tags */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Tags</Label>
                  {!isAddingTag && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-foreground px-1"
                      onClick={() => setIsAddingTag(true)}
                    >
                      <Plus />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {idea.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X />
                    </Badge>
                  ))}
                  {isAddingTag && (
                    <div className="flex gap-1 items-center w-full">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="New tag"
                        className="flex-1 text-xs"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddTag();
                          if (e.key === "Escape") {
                            setNewTag("");
                            setIsAddingTag(false);
                          }
                        }}
                        onBlur={() => {
                          if (!newTag.trim()) {
                            setIsAddingTag(false);
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="shrink-0"
                        onClick={handleAddTag}
                      >
                        <CheckCircle2 />
                      </Button>
                    </div>
                  )}
                  {idea.tags.length === 0 && !isAddingTag && (
                    <span className="text-xs text-muted-foreground/60">
                      No tags
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Created Info */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created by</span>
                  <div className="flex items-center gap-1">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={idea.createdBy.avatar} />
                      <AvatarFallback>
                        {getInitials(idea.createdBy.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{idea.createdBy.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>
                    {format(new Date(idea.createdAt), DATE_FORMAT.LONG)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>
                    {format(new Date(idea.updatedAt), DATE_FORMAT.LONG)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
