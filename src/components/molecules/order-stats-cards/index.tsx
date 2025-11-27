"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, Package, ShoppingCart, Truck, DollarSign } from "lucide-react";
import { getOrderStats } from "@/data/order";
import { formatCurrency, formatNumber } from "@/constants";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

interface OrderStatsCardsProps {
  stats: ReturnType<typeof getOrderStats>;
}

export function OrderStatsCards({ stats }: OrderStatsCardsProps) {
  const cards: StatCardProps[] = [
    {
      title: "Total Orders",
      value: formatNumber(stats.total),
      description: `${formatNumber(stats.pending)} pending`,
      icon: ShoppingCart,
    },
    {
      title: "Processing",
      value: formatNumber(stats.processing + stats.designing + stats.production),
      description: `${formatNumber(stats.designing)} in design`,
      icon: Package,
    },
    {
      title: "Shipped",
      value: formatNumber(stats.shipped + stats.delivered),
      description: `${formatNumber(stats.delivered)} delivered`,
      icon: Truck,
    },
    {
      title: "Revenue",
      value: formatCurrency(stats.totalRevenue),
      description: `From ${formatNumber(stats.total - stats.cancelled)} successful orders`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}

