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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Order, OrderStatus } from "@/type/order";
import { getStatusLabel, getPlatformLabel } from "@/utils/order-helpers";
import {
  PLATFORM_BADGE_OUTLINE_VARIANTS,
  ORDER_STATUS_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";
import {
  Eye,
  MoreHorizontal,
  Upload,
  Truck,
  CheckCircle,
  XCircle,
  Package,
  Store,
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

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Platform/Store</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Products</TableHead>
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
                <div className="space-y-1">
                  <Badge
                    variant={PLATFORM_BADGE_OUTLINE_VARIANTS[order.platform]}
                  >
                    {getPlatformLabel(order.platform)}
                  </Badge>
                  {order.store && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-help">
                            <Store className="h-3 w-3" />
                            <span className="truncate max-w-[120px]">
                              {order.store.name.split(" - ")[0]}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-medium">{order.store.name}</p>
                            <p className="text-xs">
                              Account: {order.store.account.name}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
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
              <TableCell>
                <Badge
                  variant={ORDER_STATUS_BADGE_OUTLINE_VARIANTS[order.status]}
                >
                  {getStatusLabel(order.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem onClick={() => onViewDetail(order)}>
                      <Eye className="h-4 w-4 " />
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
                            {status === "processing" && (
                              <Package className="h-4 w-4 " />
                            )}
                            {status === "designing" && (
                              <Upload className="h-4 w-4 " />
                            )}
                            {status === "production" && (
                              <Package className="h-4 w-4 " />
                            )}
                            {status === "shipped" && (
                              <Truck className="h-4 w-4 " />
                            )}
                            {status === "delivered" && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            {status === "cancelled" && (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
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
              <TableCell
                colSpan={7}
                className="text-center py-10 text-muted-foreground"
              >
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
