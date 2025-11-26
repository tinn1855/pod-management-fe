"use client";

import {
  ChevronUp,
  ClipboardList,
  Factory,
  FileImage,
  FileText,
  History,
  Key,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  PenTool,
  Shield,
  ShoppingCart,
  Truck,
  User2,
  Users,
  UsersRound,
} from "lucide-react";

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
import { usePathname } from "next/navigation";

// Menu items organized by POD workflow
const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
];

// Sales menu (Seller)
const salesMenuItems = [
  {
    title: "Orders",
    url: "/orders",
    icon: ShoppingCart,
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

export function AppSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/";
    return pathname.startsWith(url);
  };

  const renderMenuItems = (items: typeof mainMenuItems) => (
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
                  <span className="truncate text-xs text-muted-foreground">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(mainMenuItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sales - Seller */}
        <SidebarGroup>
          <SidebarGroupLabel>Sales</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(salesMenuItems)}
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
