"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Order } from "@/type/order";
import { Account, Store } from "@/type/platform";
import { ITEMS_PER_PAGE } from "@/constants";

export interface OrderFiltersState {
  searchQuery: string;
  statusFilter: string;
  platformFilter: string;
  accountFilter: string;
  storeFilter: string;
}

export interface UseOrderFiltersReturn {
  // State
  filters: OrderFiltersState;
  currentPage: number;
  
  // Setters
  setSearchQuery: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setPlatformFilter: (value: string) => void;
  setAccountFilter: (value: string) => void;
  setStoreFilter: (value: string) => void;
  
  // Cascade handlers
  handlePlatformChange: (value: string) => void;
  handleAccountChange: (value: string) => void;
  
  // Filtered data
  filteredOrders: Order[];
  paginatedOrders: Order[];
  totalPages: number;
  
  // Filtered options
  filteredAccounts: Account[];
  filteredStores: Store[];
}

export function useOrderFilters(
  orders: Order[],
  accounts: Account[],
  stores: Store[]
): UseOrderFiltersReturn {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");

  // Cascade filter handlers
  const handlePlatformChange = useCallback((value: string) => {
    setPlatformFilter(value);
    setAccountFilter("all");
    setStoreFilter("all");
  }, []);

  const handleAccountChange = useCallback((value: string) => {
    setAccountFilter(value);
    setStoreFilter("all");
  }, []);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.email.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPlatform = platformFilter === "all" || order.platform === platformFilter;
      const matchesStore = storeFilter === "all" || order.store?.id === storeFilter;
      const matchesAccount = accountFilter === "all" || order.store?.account.id === accountFilter;
      
      return matchesSearch && matchesStatus && matchesPlatform && matchesStore && matchesAccount;
    });
  }, [orders, searchQuery, statusFilter, platformFilter, storeFilter, accountFilter]);

  // Paginated orders
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  // Filtered dropdown options (cascade)
  const filteredAccounts = useMemo(() => {
    if (platformFilter === "all") return accounts;
    return accounts.filter((a) => a.platform.type === platformFilter);
  }, [accounts, platformFilter]);

  const filteredStores = useMemo(() => {
    if (accountFilter === "all") return stores;
    return stores.filter((s) => s.account.id === accountFilter);
  }, [stores, accountFilter]);

  return {
    filters: {
      searchQuery,
      statusFilter,
      platformFilter,
      accountFilter,
      storeFilter,
    },
    currentPage,
    setSearchQuery,
    setStatusFilter,
    setPlatformFilter,
    setAccountFilter,
    setStoreFilter,
    handlePlatformChange,
    handleAccountChange,
    filteredOrders,
    paginatedOrders,
    totalPages,
    filteredAccounts,
    filteredStores,
  };
}

