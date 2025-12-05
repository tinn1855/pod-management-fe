"use client";

import { Badge } from "@/components/ui/badge";
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
  History,
  Search,
  User,
  Package,
  FileText,
  Settings,
  ShoppingCart,
  PenTool,
} from "lucide-react";
import { useState } from "react";
import { useUsers } from "@/hooks/use-users";
import { ACTIVITY_TYPE_BADGE_OUTLINE_VARIANTS } from "@/constants/badge-variants";

// TODO: Replace with API call
// const { logs, loading } = useActivityLogs();
const mockLogs: any[] = [];
/* Mock data - removed:
const mockLogs = [
  {
    id: "log-1",
    user: users[1],
    action: "create",
    module: "orders",
    description: "Created new order ORD-2024-008",
    timestamp: "2024-01-21T14:30:00Z",
    metadata: { orderId: "ORD-2024-008" },
  },
  {
    id: "log-2",
    user: mockUsers[3],
    action: "update",
    module: "designs",
    description: "Uploaded new design file for Idea #5",
    timestamp: "2024-01-21T13:45:00Z",
    metadata: { ideaId: "idea-5", fileName: "hoodie-v2.psd" },
  },
  {
    id: "log-3",
    user: mockUsers[1],
    action: "update",
    module: "ideas",
    description: "Changed Idea #2 status to Check Design",
    timestamp: "2024-01-21T12:20:00Z",
    metadata: { ideaId: "idea-2", fromStatus: "new", toStatus: "check_design" },
  },
  {
    id: "log-4",
    user: mockUsers[0],
    action: "create",
    module: "users",
    description: "Created new account for Designer",
    timestamp: "2024-01-21T11:00:00Z",
    metadata: { newUserId: "user-10" },
  },
  {
    id: "log-5",
    user: mockUsers[6],
    action: "update",
    module: "production",
    description: "Updated production status: Printing",
    timestamp: "2024-01-21T10:30:00Z",
    metadata: { productionId: "prod-1" },
  },
  {
    id: "log-6",
    user: mockUsers[2],
    action: "create",
    module: "content",
    description: "Created new content for Canvas Art product",
    timestamp: "2024-01-21T09:15:00Z",
    metadata: { contentId: "content-6" },
  },
  {
    id: "log-7",
    user: mockUsers[1],
    action: "delete",
    module: "orders",
    description: "Cancelled order ORD-2024-007",
    timestamp: "2024-01-20T16:45:00Z",
    metadata: { orderId: "ORD-2024-007" },
  },
  {
    id: "log-8",
    user: mockUsers[0],
    action: "update",
    module: "settings",
    description: "Updated permissions for Designer role",
    timestamp: "2024-01-20T15:30:00Z",
    metadata: { roleId: "role-designer" },
  },
]; */

const actionLabels: Record<string, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  login: "Logged In",
  logout: "Logged Out",
};

const moduleIcons: Record<string, React.ElementType> = {
  orders: ShoppingCart,
  designs: PenTool,
  ideas: FileText,
  users: User,
  production: Package,
  content: FileText,
  settings: Settings,
};

export default function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch = log.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesModule = moduleFilter === "all" || log.module === moduleFilter;
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesModule && matchesAction;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground">
            Track user activities in the system
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockLogs.filter((l) => l.action === "create").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updated</CardTitle>
            <div className="w-3 h-3 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockLogs.filter((l) => l.action === "update").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deleted</CardTitle>
            <div className="w-3 h-3 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockLogs.filter((l) => l.action === "delete").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            <SelectItem value="orders">Orders</SelectItem>
            <SelectItem value="designs">Designs</SelectItem>
            <SelectItem value="ideas">Ideas</SelectItem>
            <SelectItem value="users">Users</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="content">Content</SelectItem>
            <SelectItem value="settings">Settings</SelectItem>
          </SelectContent>
        </Select>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create">Created</SelectItem>
            <SelectItem value="update">Updated</SelectItem>
            <SelectItem value="delete">Deleted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs Timeline */}
      <div className="space-y-4">
        {filteredLogs.map((log) => {
          const ModuleIcon = moduleIcons[log.module] || History;
          return (
            <div
              key={log.id}
              className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={log.user.avatar} />
                <AvatarFallback>{getInitials(log.user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{log.user.name}</span>
                  <Badge
                    variant={
                      ACTIVITY_TYPE_BADGE_OUTLINE_VARIANTS[log.action] ||
                      "secondary"
                    }
                  >
                    {actionLabels[log.action] || log.action}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <ModuleIcon className="h-3 w-3" />
                    {log.module}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {log.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatTime(log.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No logs found
        </div>
      )}
    </section>
  );
}
