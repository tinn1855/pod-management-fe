"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Order, OrderStatus } from "@/type/order";
import { getStatusLabel, getPlatformLabel } from "@/utils/order-helpers";
import {
  PLATFORM_BADGE_OUTLINE_VARIANTS,
  ORDER_STATUS_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";
import { formatCurrency } from "@/constants";
import {
  Package,
  Truck,
  MapPin,
  Mail,
  Phone,
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  ExternalLink,
  Store,
} from "lucide-react";

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
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

export function OrderDetailDialog({
  order,
  open,
  onOpenChange,
  onUpdateStatus,
}: OrderDetailDialogProps) {
  if (!order) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {order.orderNumber}
            </DialogTitle>
            <Badge variant={ORDER_STATUS_BADGE_OUTLINE_VARIANTS[order.status]}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Platform</p>
              <Badge
                variant={PLATFORM_BADGE_OUTLINE_VARIANTS[order.platform]}
                className="mt-1"
              >
                {getPlatformLabel(order.platform)}
              </Badge>
              {order.externalOrderId && (
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {order.externalOrderId}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium" suppressHydrationWarning>
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Store Info */}
          {order.store && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{order.store.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Account: {order.store.account.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="font-medium">{order.customer.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {order.customer.email}
              </div>
              {order.customer.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {order.customer.phone}
                </div>
              )}
              <p className="text-sm">
                {order.customer.address}, {order.customer.city}
                {order.customer.state && `, ${order.customer.state}`},{" "}
                {order.customer.country} {order.customer.zipCode}
              </p>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      SKU: {item.sku}
                      {item.variant && ` • ${item.variant}`}
                    </p>
                    {item.designId && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        Design: {item.designId}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.price)}</p>
                    <p className="text-xs text-muted-foreground">
                      x{item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Design Files */}
          {order.designFiles && order.designFiles.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Design Files
                </h3>
                <div className="flex flex-wrap gap-2">
                  {order.designFiles.map((file, index) => (
                    <Button key={index} variant="outline" size="sm" asChild>
                      <a href={file} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        File {index + 1}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tracking */}
          {order.trackingNumber && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Tracking
                </h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-mono">{order.trackingNumber}</p>
                  {order.shippedAt && (
                    <p
                      className="text-sm text-muted-foreground mt-1"
                      suppressHydrationWarning
                    >
                      Shipped: {formatDate(order.shippedAt)}
                    </p>
                  )}
                  {order.deliveredAt && (
                    <p
                      className="text-sm text-green-600 mt-1"
                      suppressHydrationWarning
                    >
                      Delivered: {formatDate(order.deliveredAt)}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          {order.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  {order.notes}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Actions */}
          {statusFlow[order.status].length > 0 && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2">
                {statusFlow[order.status].map((status) => (
                  <Button
                    key={status}
                    variant={status === "cancelled" ? "destructive" : "default"}
                    size="sm"
                    onClick={() => {
                      onUpdateStatus(order.id, status);
                      onOpenChange(false);
                    }}
                  >
                    {status === "processing" && (
                      <Package className="h-4 w-4 mr-1" />
                    )}
                    {status === "designing" && (
                      <Upload className="h-4 w-4 mr-1" />
                    )}
                    {status === "production" && (
                      <Package className="h-4 w-4 mr-1" />
                    )}
                    {status === "shipped" && <Truck className="h-4 w-4 mr-1" />}
                    {status === "delivered" && (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    )}
                    {status === "cancelled" && (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {getStatusLabel(status)}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
