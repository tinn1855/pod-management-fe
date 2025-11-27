"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Truck, Search, Plus, Mail, Phone, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock suppliers data
const mockSuppliers = [
  {
    id: "sup-1",
    name: "ABC Printing Co.",
    email: "contact@abcprinting.com",
    phone: "+1 234 567 8901",
    address: "123 Industrial Ave, New York, NY 10001",
    status: "active",
    rating: 4.8,
    totalOrders: 156,
    services: ["T-Shirt Printing", "Canvas Printing", "Mug Printing"],
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=ABC",
  },
  {
    id: "sup-2",
    name: "XYZ Manufacturing",
    email: "info@xyzmanufacturing.com",
    phone: "+1 234 567 8902",
    address: "456 Factory Blvd, Los Angeles, CA 90001",
    status: "active",
    rating: 4.5,
    totalOrders: 89,
    services: ["Hoodie Printing", "Sweater Printing", "Embroidery"],
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=XYZ",
  },
  {
    id: "sup-3",
    name: "DEF Production Partner",
    email: "hello@defproduction.com",
    phone: "+1 234 567 8903",
    address: "789 Commerce St, Chicago, IL 60601",
    status: "inactive",
    rating: 4.2,
    totalOrders: 45,
    services: ["Sticker Printing", "Poster Printing", "Business Cards"],
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DEF",
  },
];

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSuppliers = mockSuppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddSupplier = () => {
    toast.info("Add supplier feature coming soon");
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Suppliers Management</h1>
          <p className="text-muted-foreground">
            Manage production and printing partners
          </p>
        </div>
        <Button onClick={handleAddSupplier}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSuppliers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSuppliers.filter((s) => s.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSuppliers.reduce((sum, s) => sum + s.totalOrders, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search suppliers..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Suppliers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={supplier.avatar} />
                  <AvatarFallback>{supplier.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{supplier.name}</h3>
                    <Badge
                      variant={supplier.status === "active" ? "default" : "secondary"}
                      className={supplier.status === "active" ? "bg-green-500" : ""}
                    >
                      {supplier.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium">{supplier.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({supplier.totalOrders} orders)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {supplier.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {supplier.phone}
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span className="line-clamp-2">{supplier.address}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1">
                {supplier.services.map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
