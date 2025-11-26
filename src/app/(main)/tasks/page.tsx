"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardList, Search, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { mockUsers } from "@/data/user";
import { toast } from "sonner";

// Mock tasks data
const mockTasks = [
  {
    id: "task-1",
    title: "Design T-Shirt Summer Collection",
    ideaId: "idea-1",
    assignee: mockUsers[3],
    assignedBy: mockUsers[1],
    status: "in_progress",
    priority: "high",
    dueDate: "2024-01-25",
    createdAt: "2024-01-15",
  },
  {
    id: "task-2",
    title: "Fix mockup for Mug Design",
    ideaId: "idea-2",
    assignee: mockUsers[4],
    assignedBy: mockUsers[1],
    status: "pending",
    priority: "medium",
    dueDate: "2024-01-23",
    createdAt: "2024-01-16",
  },
  {
    id: "task-3",
    title: "Upload final file for Street Hoodie",
    ideaId: "idea-5",
    assignee: mockUsers[3],
    assignedBy: mockUsers[2],
    status: "review",
    priority: "urgent",
    dueDate: "2024-01-22",
    createdAt: "2024-01-18",
  },
  {
    id: "task-4",
    title: "Create mockup for Sticker Pack",
    ideaId: "idea-7",
    assignee: mockUsers[4],
    assignedBy: mockUsers[2],
    status: "completed",
    priority: "low",
    dueDate: "2024-01-20",
    createdAt: "2024-01-17",
  },
];

const statusColors: Record<string, string> = {
  pending: "#6b7280",
  in_progress: "#3b82f6",
  review: "#f59e0b",
  completed: "#22c55e",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  review: "In Review",
  completed: "Completed",
};

const priorityColors: Record<string, string> = {
  low: "#6b7280",
  medium: "#3b82f6",
  high: "#f59e0b",
  urgent: "#ef4444",
};

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const stats = {
    total: mockTasks.length,
    pending: mockTasks.filter((t) => t.status === "pending").length,
    inProgress: mockTasks.filter((t) => t.status === "in_progress").length,
    review: mockTasks.filter((t) => t.status === "review").length,
    completed: mockTasks.filter((t) => t.status === "completed").length,
  };

  const handleCreateTask = () => {
    toast.info("Create task feature coming soon");
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks Management</h1>
          <p className="text-muted-foreground">
            Manage tasks assigned to designers
          </p>
        </div>
        <Button onClick={handleCreateTask}>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.review}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="review">In Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Designer</TableHead>
              <TableHead>Assigned By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Idea: {task.ideaId}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(task.assignee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignedBy.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(task.assignedBy.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignedBy.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor: `${statusColors[task.status]}20`,
                      color: statusColors[task.status],
                    }}
                  >
                    {statusLabels[task.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: priorityColors[task.priority],
                      color: priorityColors[task.priority],
                    }}
                  >
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {task.dueDate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
