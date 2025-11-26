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
import { Order, OrderStatus } from "@/type/order";
import {
  getStatusLabel,
  getStatusColor,
  getSourceLabel,
  getSourceColor,
} from "@/data/order";
import {
  Eye,
  MoreHorizontal,
  Upload,
  Truck,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";

interface OrdersTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetail: (order: Order) => void;
}

const statusFlow: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["designing", "production", "cancelled"],
  designing: ["production", "cancelled"],
  production: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export function OrdersTable({
  orders,
  onUpdateStatus,
  onViewDetail,
}: OrdersTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onViewDetail(order)}
            >
              <TableCell>
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  {order.externalOrderId && (
                    <p className="text-xs text-muted-foreground">
                      {order.externalOrderId}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: getSourceColor(order.source),
                    color: getSourceColor(order.source),
                  }}
                >
                  {getSourceLabel(order.source)}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customer.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {order.items.map((i) => i.productName).join(", ")}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(order.total, order.currency)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: `${getStatusColor(order.status)}20`,
                    color: getStatusColor(order.status),
                  }}
                >
                  {getStatusLabel(order.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => onViewDetail(order)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {statusFlow[order.status].length > 0 && (
                      <>
                        <DropdownMenuItem className="text-xs font-medium text-muted-foreground">
                          Change Status:
                        </DropdownMenuItem>
                        {statusFlow[order.status].map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => onUpdateStatus(order.id, status)}
                          >
                            {status === "processing" && <Package className="h-4 w-4 mr-2" />}
                            {status === "designing" && <Upload className="h-4 w-4 mr-2" />}
                            {status === "production" && <Package className="h-4 w-4 mr-2" />}
                            {status === "shipped" && <Truck className="h-4 w-4 mr-2" />}
                            {status === "delivered" && <CheckCircle className="h-4 w-4 mr-2" />}
                            {status === "cancelled" && <XCircle className="h-4 w-4 mr-2 text-destructive" />}
                            {getStatusLabel(status)}
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
