"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Data
import { mockOrders } from "@/data/order";
import { mockStores, mockAccounts, mockPlatforms } from "@/data/platform";

// Hooks
import { useOrders } from "@/hooks/use-orders";
import { useOrderFilters } from "@/hooks/use-order-filters";

// Components
import { OrdersTable } from "@/components/molecules/order-table";
import { OrderDetailDialog } from "@/components/molecules/order-detail-dialog";
import { OrderStatsCards } from "@/components/molecules/order-stats-cards";
import {
  OrderFiltersBar,
  PlatformBadges,
  StatusPills,
} from "@/components/molecules/order-filters";
import { AppPagination } from "@/components/molecules/pagination";

// ============================================
// PAGE HEADER
// ============================================

interface PageHeaderProps {
  onSyncEtsy: () => void;
  onSyncAmazon: () => void;
}

function PageHeader({ onSyncEtsy, onSyncAmazon }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground">
          Manage orders from e-commerce platforms
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onSyncEtsy}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync Etsy
        </Button>
        <Button variant="outline" onClick={onSyncAmazon}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync Amazon
        </Button>
      </div>
    </div>
  );
}

// ============================================
// RESULTS COUNT
// ============================================

interface ResultsCountProps {
  showing: number;
  total: number;
}

function ResultsCount({ showing, total }: ResultsCountProps) {
  return (
    <div className="text-sm text-muted-foreground">
      Showing {showing} of {total} orders
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

function OrdersPageContent() {
  // Orders state & actions
  const {
    orders,
    selectedOrder,
    stats,
    setSelectedOrder,
    handleUpdateStatus,
    handleSyncOrders,
  } = useOrders(mockOrders);

  // Filters state & logic
  const {
    filters,
    setSearchQuery,
    setStatusFilter,
    handlePlatformChange,
    handleAccountChange,
    setStoreFilter,
    filteredOrders,
    paginatedOrders,
    totalPages,
    filteredAccounts,
    filteredStores,
  } = useOrderFilters(orders, mockAccounts, mockStores);

  return (
    <section className="space-y-6">
      {/* Header */}
      <PageHeader
        onSyncEtsy={() => handleSyncOrders("etsy")}
        onSyncAmazon={() => handleSyncOrders("amazon")}
      />

      {/* Stats Cards */}
      <OrderStatsCards stats={stats} />

      {/* Platform Badges */}
      <PlatformBadges
        platforms={mockPlatforms}
        selectedPlatform={filters.platformFilter}
        onSelect={handlePlatformChange}
      />

      {/* Filters Bar */}
      <OrderFiltersBar
        searchQuery={filters.searchQuery}
        onSearchChange={setSearchQuery}
        platformFilter={filters.platformFilter}
        onPlatformChange={handlePlatformChange}
        accountFilter={filters.accountFilter}
        onAccountChange={handleAccountChange}
        storeFilter={filters.storeFilter}
        onStoreChange={setStoreFilter}
        statusFilter={filters.statusFilter}
        onStatusChange={setStatusFilter}
        platforms={mockPlatforms}
        accounts={filteredAccounts}
        stores={filteredStores}
      />

      {/* Status Pills */}
      <StatusPills
        stats={stats}
        selectedStatus={filters.statusFilter}
        onSelect={setStatusFilter}
      />

      {/* Results Count */}
      <ResultsCount showing={paginatedOrders.length} total={filteredOrders.length} />

      {/* Orders Table */}
      <OrdersTable
        orders={paginatedOrders}
        onUpdateStatus={handleUpdateStatus}
        onViewDetail={setSelectedOrder}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Suspense fallback={<div>Loading...</div>}>
          <AppPagination totalPages={totalPages} />
        </Suspense>
      )}

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </section>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
      <OrdersPageContent />
    </Suspense>
  );
}
