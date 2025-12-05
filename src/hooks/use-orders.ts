"use client";

import { useState, useCallback } from "react";
import { Order, OrderStatus } from "@/type/order";
import { PlatformType } from "@/type/platform";
import { getOrderStats, getPlatformLabel } from "@/utils/order-helpers";
import { toast } from "sonner";

export interface UseOrdersReturn {
  orders: Order[];
  selectedOrder: Order | null;
  stats: ReturnType<typeof getOrderStats>;
  setSelectedOrder: (order: Order | null) => void;
  handleUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  handleSyncOrders: (platform: PlatformType) => void;
}

export function useOrders(initialOrders: Order[]): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const stats = getOrderStats(orders);

  const handleUpdateStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
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
  }, []);

  const handleSyncOrders = useCallback((platform: PlatformType) => {
    toast.info(`Syncing orders from ${getPlatformLabel(platform)}...`, {
      description: "This feature will be available soon",
    });
  }, []);

  return {
    orders,
    selectedOrder,
    stats,
    setSelectedOrder,
    handleUpdateStatus,
    handleSyncOrders,
  };
}

