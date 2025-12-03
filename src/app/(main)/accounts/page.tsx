"use client";

import { useState, useMemo, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Plus, Store as StoreIcon } from "lucide-react";
import { getAccountStats, getPlatformLabel } from "@/utils/platform-helpers";

import { Account, Store, PlatformType } from "@/type/platform";
import { AccountTable } from "@/components/molecules/account-table";
import { StoreTable } from "@/components/molecules/store-table";
import { AppPagination } from "@/components/molecules/pagination";
import { toast } from "sonner";
import { ITEMS_PER_PAGE } from "@/constants";
import {
  PLATFORM_BADGE_VARIANTS,
  PLATFORM_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";

function AccountsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);
  const activeTab = (searchParams.get("tab") ?? "accounts") as
    | "accounts"
    | "stores";

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  // TODO: Replace with API call - usePlatforms hook
  // For now, use platform types directly
  const platformTypes: PlatformType[] = [
    "etsy",
    "amazon",
    "shopify",
    "ebay",
    "tiktok",
    "other",
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const setActiveTab = useCallback(
    (tab: "accounts" | "stores") => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === "accounts") {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }
      // Reset page when switching tabs
      params.delete("page");
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [searchParams, pathname, router]
  );

  const stats = getAccountStats(accounts, stores);

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const matchesSearch =
        account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform =
        platformFilter === "all" || account.platform.type === platformFilter;
      const matchesStatus =
        statusFilter === "all" || account.status === statusFilter;
      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [accounts, searchQuery, platformFilter, statusFilter]);

  // Filter stores
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.account.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform =
        platformFilter === "all" ||
        store.account.platform.type === platformFilter;
      const matchesStatus =
        statusFilter === "all" || store.status === statusFilter;
      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [stores, searchQuery, platformFilter, statusFilter]);

  const currentItems =
    activeTab === "accounts" ? filteredAccounts : filteredStores;
  const totalPages = Math.ceil(currentItems.length / ITEMS_PER_PAGE);

  const paginatedAccounts = useMemo(() => {
    return filteredAccounts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredAccounts, currentPage]);

  const paginatedStores = useMemo(() => {
    return filteredStores.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredStores, currentPage]);

  const handleSyncAccount = (account: Account) => {
    toast.info(`Syncing ${account.name}...`, {
      description: "This feature will be available soon",
    });
  };

  const handleAddAccount = () => {
    toast.info("Add account feature coming soon");
  };

  const handleAddStore = () => {
    toast.info("Add store feature coming soon");
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Accounts & Stores</h1>
          <p className="text-muted-foreground">
            Manage your e-commerce platform accounts and stores
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddStore}>
            <StoreIcon />
            Add Store
          </Button>
          <Button onClick={handleAddAccount}>
            <Plus />
            Add Account
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Accounts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAccounts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeAccounts} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <StoreIcon className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStores}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeStores} active
            </p>
          </CardContent>
        </Card>

        {/* Platform breakdown */}
        {(["etsy", "amazon", "shopify"] as PlatformType[]).map((platform) => (
          <Card key={platform}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getPlatformLabel(platform)}
              </CardTitle>
              <Badge
                variant={PLATFORM_BADGE_VARIANTS[platform]}
                className="w-3 h-3 p-0 rounded-full"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.byPlatform[platform]}
              </div>
              <p className="text-xs text-muted-foreground">accounts</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform filter badges */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={platformFilter === "all" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setPlatformFilter("all")}
        >
          All Platforms
        </Badge>
        {platformTypes.map((platform) => {
          const count = stats.byPlatform[platform] || 0;
          return (
            <Badge
              key={platform}
              variant={
                platformFilter === platform
                  ? PLATFORM_BADGE_VARIANTS[platform]
                  : PLATFORM_BADGE_OUTLINE_VARIANTS[platform]
              }
              className="cursor-pointer"
              onClick={() =>
                setPlatformFilter(
                  platform === platformFilter ? "all" : platform
                )
              }
            >
              {getPlatformLabel(platform)}: {count}
            </Badge>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts or stores..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {platformTypes.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {getPlatformLabel(platform)}
              </SelectItem>
            ))}
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
            {activeTab === "accounts" && (
              <SelectItem value="suspended">Suspended</SelectItem>
            )}
            {activeTab === "stores" && (
              <SelectItem value="vacation">Vacation</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "accounts" | "stores")}
      >
        <TabsList>
          <TabsTrigger value="accounts" className="gap-2">
            <Users className="h-4 w-4" />
            Accounts ({filteredAccounts.length})
          </TabsTrigger>
          <TabsTrigger value="stores" className="gap-2">
            <StoreIcon className="h-4 w-4" />
            Stores ({filteredStores.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Showing {paginatedAccounts.length} of {filteredAccounts.length}{" "}
            accounts
          </div>
          <AccountTable
            accounts={paginatedAccounts}
            stores={stores}
            onSync={handleSyncAccount}
            onEdit={(account) => toast.info(`Edit ${account.name}`)}
            onDelete={(account) => toast.info(`Delete ${account.name}`)}
            onViewStores={(account) => {
              setActiveTab("stores");
              setSearchQuery(account.name.split(" (")[0]);
            }}
          />
        </TabsContent>

        <TabsContent value="stores" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Showing {paginatedStores.length} of {filteredStores.length} stores
          </div>
          <StoreTable
            stores={paginatedStores}
            onEdit={(store) => toast.info(`Edit ${store.name}`)}
            onDelete={(store) => toast.info(`Delete ${store.name}`)}
            onViewOrders={(store) =>
              toast.info(`View orders for ${store.name}`)
            }
          />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <Suspense fallback={<div>Loading...</div>}>
          <AppPagination totalPages={totalPages} />
        </Suspense>
      )}
    </section>
  );
}

export default function AccountsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">Loading...</div>
      }
    >
      <AccountsPageContent />
    </Suspense>
  );
}
