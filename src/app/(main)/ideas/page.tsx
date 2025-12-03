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
import { LayoutGrid, List, Search } from "lucide-react";
import { mockIdeas } from "@/data/idea";
import { Idea, IdeaStatus } from "@/type/idea";
import { IdeaKanbanBoard } from "@/components/molecules/idea-kanban-board";
import { IdeaListView } from "@/components/molecules/idea-list-view";
import { CreateIdeaDialog } from "@/components/molecules/idea-create-dialog";
import { IdeaDetailDialog } from "@/components/molecules/idea-detail-dialog";
import { mockUsers } from "@/data/user";
import { toast } from "sonner";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type ViewMode = "kanban" | "list";

function IdeasPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get view mode from URL params
  const viewMode = (searchParams.get("view") as ViewMode) || "kanban";

  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

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

  // Filter ideas
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || idea.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || idea.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateIdea = (
    newIdea: Omit<Idea, "id" | "createdAt" | "updatedAt" | "comments">
  ) => {
    const idea: Idea = {
      ...newIdea,
      id: `idea-${Date.now()}`,
      comments: [],
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setIdeas((prev) => [idea, ...prev]);
    toast.success("Idea created successfully");
  };

  const handleUpdateIdeaStatus = (ideaId: string, newStatus: IdeaStatus) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId
          ? {
              ...idea,
              status: newStatus,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : idea
      )
    );
    toast.success("Idea status updated");
  };

  const handleDeleteIdea = (ideaId: string) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
    toast.success("Idea deleted successfully");
  };

  const handleOpenDetail = (idea: Idea) => {
    setSelectedIdea(idea);
    setDetailDialogOpen(true);
  };

  const handleUpdateIdea = (updatedIdea: Idea) => {
    setIdeas((prev) =>
      prev.map((idea) => (idea.id === updatedIdea.id ? updatedIdea : idea))
    );
    setSelectedIdea(updatedIdea);
  };

  // Get designers for assignment
  const designers = mockUsers.filter((user) => user.role.name === "Designer");

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

      {/* Content */}
      {viewMode === "kanban" ? (
        <div className="h-[calc(100vh-380px)] min-h-[400px]">
          <IdeaKanbanBoard
            ideas={filteredIdeas}
            onUpdateStatus={handleUpdateIdeaStatus}
            onDelete={handleDeleteIdea}
            onOpenDetail={handleOpenDetail}
          />
        </div>
      ) : (
        <IdeaListView
          ideas={filteredIdeas}
          onUpdateStatus={handleUpdateIdeaStatus}
          onDelete={handleDeleteIdea}
          onOpenDetail={handleOpenDetail}
        />
      )}

      {/* Detail Dialog */}
      <IdeaDetailDialog
        idea={selectedIdea}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        users={mockUsers}
        onUpdate={handleUpdateIdea}
        onDelete={handleDeleteIdea}
        onUpdateStatus={handleUpdateIdeaStatus}
      />
    </div>
  );
}

export default function IdeasPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
      <IdeasPageContent />
    </Suspense>
  );
}
