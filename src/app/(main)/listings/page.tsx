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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Search,
  Plus,
  ExternalLink,
  TrendingUp,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  PLATFORM_BADGE_OUTLINE_VARIANTS,
  LISTING_STATUS_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";
import { PlatformType } from "@/type/platform";

// Mock listings data
const mockListings = [
  {
    id: "1",
    title: "Summer Vibes T-Shirt - Tropical Paradise",
    platform: "etsy" as PlatformType,
    listingId: "ETSY-123456",
    status: "active",
    price: 24.99,
    views: 1250,
    sales: 45,
    revenue: 1124.55,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Coffee Lover Mug - Morning Motivation",
    platform: "amazon" as PlatformType,
    listingId: "AMZ-789012",
    status: "active",
    price: 15.99,
    views: 890,
    sales: 32,
    revenue: 511.68,
    createdAt: "2024-01-18",
  },
  {
    id: "3",
    title: "Eco Tote Bag - Save The Planet",
    platform: "shopify" as PlatformType,
    listingId: "SHOP-345678",
    status: "inactive",
    price: 19.99,
    views: 450,
    sales: 18,
    revenue: 359.82,
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    title: "Street Style Hoodie - Urban Art",
    platform: "etsy" as PlatformType,
    listingId: "ETSY-901234",
    status: "draft",
    price: 44.99,
    views: 0,
    sales: 0,
    revenue: 0,
    createdAt: "2024-01-22",
  },
];

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredListings = mockListings.filter((listing) => {
    const matchesSearch = listing.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPlatform =
      platformFilter === "all" || listing.platform === platformFilter;
    const matchesStatus =
      statusFilter === "all" || listing.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const totalRevenue = mockListings.reduce((sum, l) => sum + l.revenue, 0);
  const totalSales = mockListings.reduce((sum, l) => sum + l.sales, 0);
  const totalViews = mockListings.reduce((sum, l) => sum + l.views, 0);

  const handleCreateListing = () => {
    toast.info("Create listing feature coming soon");
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Listings Management</h1>
          <p className="text-muted-foreground">
            Manage product listings across e-commerce platforms
          </p>
        </div>
        <Button onClick={handleCreateListing}>
          <Plus className="mr-2 h-4 w-4" />
          Create Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockListings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="etsy">Etsy</SelectItem>
            <SelectItem value="amazon">Amazon</SelectItem>
            <SelectItem value="shopify">Shopify</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Listing ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Sales</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListings.map((listing) => (
              <TableRow
                key={listing.id}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">{listing.title}</TableCell>
                <TableCell>
                  <Badge variant={PLATFORM_BADGE_OUTLINE_VARIANTS[listing.platform]}>
                    {listing.platform}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <code className="text-xs">{listing.listingId}</code>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={LISTING_STATUS_BADGE_OUTLINE_VARIANTS[listing.status]}>
                    {listing.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">${listing.price}</TableCell>
                <TableCell className="text-right">
                  {listing.views.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">{listing.sales}</TableCell>
                <TableCell className="text-right font-medium">
                  ${listing.revenue.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
