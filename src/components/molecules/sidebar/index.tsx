"use client";

import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Factory,
  FileImage,
  FileText,
  FolderTree,
  History,
  Key,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Package,
  PenTool,
  Shield,
  ShoppingCart,
  Store,
  Truck,
  User2,
  Users,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth.context";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Sales menu (Seller)
const salesMenuItems = [
  {
    title: "Orders",
    url: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Store,
  },
  {
    title: "Listings",
    url: "/listings",
    icon: FileText,
  },
  {
    title: "Content",
    url: "/content",
    icon: FileImage,
  },
];

// Products sub-menu items
const productsSubItems = [
  {
    title: "Product Management",
    url: "/products",
    query: "?view=products",
  },
  {
    title: "Category Management",
    url: "/products",
    query: "?view=categories",
  },
];

// Design menu (Seller & Designer)
const designMenuItems = [
  {
    title: "Ideas",
    url: "/ideas",
    icon: Lightbulb,
  },
  {
    title: "Designs",
    url: "/designs",
    icon: PenTool,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: ClipboardList,
  },
];

// Production menu (Supplier)
const productionMenuItems = [
  {
    title: "Production",
    url: "/production",
    icon: Factory,
  },
  {
    title: "Suppliers",
    url: "/suppliers",
    icon: Truck,
  },
];

// Admin menu
const adminMenuItems = [
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Teams",
    url: "/teams",
    icon: UsersRound,
  },
  {
    title: "Roles",
    url: "/roles",
    icon: Shield,
  },
  {
    title: "Permissions",
    url: "/permissions",
    icon: Key,
  },
  {
    title: "Activity Logs",
    url: "/activity-logs",
    icon: History,
  },
];

function AppSidebarContent() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expandedProducts, setExpandedProducts] = useState(true);

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/";
    return pathname.startsWith(url);
  };

  const isProductPageActive = () => {
    return pathname.startsWith("/products");
  };

  const isSubItemActive = (item: typeof productsSubItems[0]) => {
    if (!isProductPageActive()) return false;
    const view = searchParams.get("view");
    if (item.query.includes("view=products")) {
      return !view || view === "products";
    }
    if (item.query.includes("view=categories")) {
      return view === "categories";
    }
    return false;
  };

  const renderMenuItems = (
    items:
      | typeof salesMenuItems
      | typeof designMenuItems
      | typeof productionMenuItems
      | typeof adminMenuItems
  ) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={isActive(item.url)}>
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Pod Management</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Sales - Seller */}
        <SidebarGroup>
          <SidebarGroupLabel>Sales</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {salesMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Products - Expandable */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setExpandedProducts(!expandedProducts)}
                  isActive={isProductPageActive()}
                >
                  <Package />
                  <span>Products</span>
                  {expandedProducts ? (
                    <ChevronDown className="ml-auto" />
                  ) : (
                    <ChevronRight className="ml-auto" />
                  )}
                </SidebarMenuButton>
                {expandedProducts && (
                  <SidebarMenuSub>
                    {productsSubItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isSubItemActive(item)}
                        >
                          <Link href={`${item.url}${item.query}`}>
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Design - Seller & Designer */}
        <SidebarGroup>
          <SidebarGroupLabel>Design</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(designMenuItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Production - Supplier */}
        <SidebarGroup>
          <SidebarGroupLabel>Production</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(productionMenuItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin - Admin only */}
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(adminMenuItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  <span>Username</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export function AppSidebar() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppSidebarContent />
    </Suspense>
  );
}
