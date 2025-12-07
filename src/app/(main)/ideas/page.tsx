"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, Search, Loader2 } from "lucide-react";
import { Idea, IdeaStatus } from "@/type/idea";
import { IdeaKanbanBoard } from "@/components/molecules/idea-kanban-board";
import { IdeaListView } from "@/components/molecules/idea-list-view";
import { CreateIdeaDialog } from "@/components/molecules/idea-create-dialog";
import { IdeaDetailDialog } from "@/components/molecules/idea-detail-dialog";
import { useUsers } from "@/hooks/use-users";
import { useIdeas } from "@/hooks/use-ideas";
import { useIdeaStatusUpdate } from "@/hooks/use-idea-status-update";
import { toast } from "sonner";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type ViewMode = "kanban" | "list";

function IdeasPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get view mode from URL params
  const viewMode = (searchParams.get("view") as ViewMode) || "kanban";

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Use hook to fetch ideas
  const { ideas, loading, error, createIdea, updateIdea, deleteIdea } =
    useIdeas({
      search: searchQuery,
      status: statusFilter !== "all" ? statusFilter : undefined,
      priority: priorityFilter !== "all" ? priorityFilter : undefined,
      limit: 100, // Fetch all for Kanban
    });

  // Fetch users for assignee/createdBy
  const { users } = useUsers({ page: 1, limit: 1000 });

  // Optimistic status update hook
  const { updateStatus } = useIdeaStatusUpdate();

  // Handle view mode change
  const setViewMode = (mode: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    if (mode === "kanban") {
      params.delete("view");
      params.delete("page"); // Reset page when switching to kanban
    } else {
      params.set("view", mode);
      params.delete("page"); // Reset page when switching views
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  // Filter is handled by API now, but we might want to filter client-side for immediate feedback if not refetching
  // However, useIdeas hooks refetches on params change, so we rely on API data.
  // The 'ideas' from hook are already filtered by the API based on the props passed to useIdeas.

  const handleCreateIdea = async (
    newIdea: Omit<Idea, "id" | "createdAt" | "updatedAt" | "comments">
  ) => {
    try {
      await createIdea(newIdea);
      setDetailDialogOpen(false);
    } catch {
      // Error handled in hook
    }
  };

  const handleUpdateIdeaStatus = (ideaId: string, newStatus: IdeaStatus) => {
    updateStatus(ideaId, newStatus);
  };

  const handleDeleteIdea = async (ideaId: string) => {
    try {
      await deleteIdea(ideaId);
      if (selectedIdea?.id === ideaId) {
        setDetailDialogOpen(false);
      }
    } catch {
      // Error handled in hook
    }
  };

  const handleOpenDetail = (idea: Idea) => {
    setSelectedIdea(idea);
    setDetailDialogOpen(true);
  };

  const handleUpdateIdea = async (updatedIdea: Idea) => {
    try {
      await updateIdea(updatedIdea.id, updatedIdea);
      setSelectedIdea(updatedIdea);
    } catch {
      // Error handled in hook
    }
  };

  // Get designers for assignment
  const designers = users.filter(
    (user) => user.role.name === "DESIGNER" || user.role.name === "Designer"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ideas Management</h1>
          <p className="text-muted-foreground">
            Manage Idea → Design workflow with Kanban board
          </p>
        </div>
        <CreateIdeaDialog designers={designers} onSubmit={handleCreateIdea} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
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
            <SelectItem value="new">New Idea</SelectItem>
            <SelectItem value="check_design">Check Design</SelectItem>
            <SelectItem value="check_content">Check Content</SelectItem>
            <SelectItem value="done_idea">Done Idea</SelectItem>
            <SelectItem value="fix_design">Fix Design</SelectItem>
            <SelectItem value="done">DONE</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === "kanban" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("kanban")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { status: "new", label: "New", color: "bg-blue-500" },
          {
            status: "check_design",
            label: "Check Design",
            color: "bg-amber-500",
          },
          {
            status: "check_content",
            label: "Check Content",
            color: "bg-violet-500",
          },
          { status: "done_idea", label: "Done Idea", color: "bg-emerald-500" },
          { status: "fix_design", label: "Fix Design", color: "bg-red-500" },
          { status: "done", label: "DONE", color: "bg-green-500" },
        ].map((item) => (
          <div
            key={item.status}
            className="flex items-center gap-3 p-3 border rounded-lg"
          >
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold">
                {ideas.filter((i) => i.status === item.status).length}
              </p>
            </div>
          </div>
        ))}
      </div>

      {loading && ideas.length === 0 ? (
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 className="animate-spin" /> Loading ideas...
        </div>
      ) : error && ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="text-destructive">Error: {String(error)}</p>
        </div>
      ) : (
        <>
          {/* Content */}
          {viewMode === "kanban" ? (
            <div className="h-[calc(100vh-380px)] min-h-[400px]">
              <IdeaKanbanBoard
                ideas={ideas}
                onUpdateStatus={handleUpdateIdeaStatus}
                onDelete={handleDeleteIdea}
                onOpenDetail={handleOpenDetail}
              />
            </div>
          ) : (
            <IdeaListView
              ideas={ideas}
              onUpdateStatus={handleUpdateIdeaStatus}
              onDelete={handleDeleteIdea}
              onOpenDetail={handleOpenDetail}
            />
          )}
        </>
      )}

      {/* Detail Dialog */}
      <IdeaDetailDialog
        idea={selectedIdea}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        users={users}
        onUpdate={handleUpdateIdea}
        onDelete={handleDeleteIdea}
        onUpdateStatus={handleUpdateIdeaStatus}
      />
    </div>
  );
}

export default function IdeasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">Loading...</div>
      }
    >
      <IdeasPageContent />
    </Suspense>
  );
}
