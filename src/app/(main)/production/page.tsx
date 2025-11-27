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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Factory, Search, Package, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { PRODUCTION_STATUS_BADGE_OUTLINE_VARIANTS } from "@/constants/badge-variants";

// Mock production data
const mockProductions = [
  {
    id: "prod-1",
    orderId: "ORD-2024-004",
    sku: "CANVAS-ABS-001",
    productName: "Canvas Print - Abstract Art",
    quantity: 1,
    status: "printing",
    supplier: "ABC Printing Co.",
    startedAt: "2024-01-19",
    estimatedCompletion: "2024-01-22",
  },
  {
    id: "prod-2",
    orderId: "ORD-2024-003",
    sku: "HOODIE-STR-001",
    productName: "Custom Hoodie - Street Style",
    quantity: 1,
    status: "quality_check",
    supplier: "XYZ Manufacturing",
    startedAt: "2024-01-18",
    estimatedCompletion: "2024-01-21",
  },
  {
    id: "prod-3",
    orderId: "ORD-2024-002",
    sku: "MUG-COF-001",
    productName: "Custom Mug - Coffee Lover",
    quantity: 1,
    status: "shipped",
    supplier: "ABC Printing Co.",
    startedAt: "2024-01-17",
    estimatedCompletion: "2024-01-20",
    completedAt: "2024-01-19",
  },
  {
    id: "prod-4",
    orderId: "ORD-2024-002",
    sku: "STICKER-ANI-001",
    productName: "Sticker Pack - Cute Animals",
    quantity: 3,
    status: "queued",
    supplier: "DEF Production Partner",
    startedAt: null,
    estimatedCompletion: "2024-01-23",
  },
];

const statusLabels: Record<string, string> = {
  queued: "Queued",
  printing: "Printing",
  quality_check: "Quality Check",
  packing: "Packing",
  shipped: "Shipped",
};

export default function ProductionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProductions = mockProductions.filter((prod) => {
    const matchesSearch =
      prod.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || prod.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockProductions.length,
    queued: mockProductions.filter((p) => p.status === "queued").length,
    printing: mockProductions.filter((p) => p.status === "printing").length,
    qualityCheck: mockProductions.filter((p) => p.status === "quality_check")
      .length,
    shipped: mockProductions.filter((p) => p.status === "shipped").length,
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Production Tracking</h1>
          <p className="text-muted-foreground">
            Track production and printing progress
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queued</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.queued}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Printing</CardTitle>
            <Factory className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.printing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Check</CardTitle>
            <Package className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qualityCheck}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shipped}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by SKU, Order ID..."
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
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="printing">Printing</SelectItem>
            <SelectItem value="quality_check">Quality Check</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProductions.map((prod) => (
              <TableRow
                key={prod.id}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-mono text-sm">
                  {prod.orderId}
                </TableCell>
                <TableCell className="font-mono text-sm">{prod.sku}</TableCell>
                <TableCell>{prod.productName}</TableCell>
                <TableCell className="text-center">{prod.quantity}</TableCell>
                <TableCell className="text-sm">{prod.supplier}</TableCell>
                <TableCell>
                  <Badge
                    variant={PRODUCTION_STATUS_BADGE_OUTLINE_VARIANTS[prod.status]}
                  >
                    {statusLabels[prod.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {prod.completedAt || prod.estimatedCompletion}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
