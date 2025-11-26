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
  Package,
  Search,
  RefreshCw,
  DollarSign,
  ShoppingCart,
  Truck,
} from "lucide-react";
import {
  mockOrders,
  getSourceLabel,
  getOrderStats,
} from "@/data/order";
import { Order, OrderStatus, OrderSource } from "@/type/order";
import { OrdersTable } from "@/components/molecules/order-table";
import { OrderDetailDialog } from "@/components/molecules/order-detail-dialog";
import { toast } from "sonner";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSource = sourceFilter === "all" || order.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const stats = getOrderStats(orders);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              ...(newStatus === "shipped" && { shippedAt: new Date().toISOString() }),
              ...(newStatus === "delivered" && { deliveredAt: new Date().toISOString() }),
            }
          : order
      )
    );
    toast.success("Order status updated successfully");
  };

  const handleSyncOrders = (source: OrderSource) => {
    toast.info(`Syncing orders from ${getSourceLabel(source)}...`, {
      description: "This feature will be available soon",
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">
            Manage orders from e-commerce platforms
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSyncOrders("etsy")}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Etsy
          </Button>
          <Button variant="outline" onClick={() => handleSyncOrders("amazon")}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Amazon
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.processing + stats.designing + stats.production}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.designing} in design
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shipped + stats.delivered}</div>
            <p className="text-xs text-muted-foreground">
              {stats.delivered} delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.total - stats.cancelled} successful orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
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
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="designing">Designing</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="etsy">Etsy</SelectItem>
            <SelectItem value="amazon">Amazon</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="shopify">Shopify</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { status: "all", label: "All", count: stats.total },
          { status: "pending", label: "Pending", count: stats.pending },
          { status: "processing", label: "Processing", count: stats.processing },
          { status: "designing", label: "Designing", count: stats.designing },
          { status: "production", label: "Production", count: stats.production },
          { status: "shipped", label: "Shipped", count: stats.shipped },
          { status: "delivered", label: "Delivered", count: stats.delivered },
          { status: "cancelled", label: "Cancelled", count: stats.cancelled },
        ].map((item) => (
          <Button
            key={item.status}
            variant={statusFilter === item.status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(item.status)}
            className="h-8"
          >
            {item.label}
            <Badge
              variant="secondary"
              className="ml-2 h-5 px-1.5"
            >
              {item.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        onUpdateStatus={handleUpdateStatus}
        onViewDetail={setSelectedOrder}
      />

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </section>
  );
}

