"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Platform, Account, Store } from "@/type/platform";
import { getOrderStats } from "@/data/order";
import {
  PLATFORM_BADGE_VARIANTS,
  PLATFORM_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";

// ============================================
// STATUS OPTIONS CONFIG
// ============================================

export const ORDER_STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "designing", label: "Designing" },
  { value: "production", label: "Production" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const;

// ============================================
// SEARCH INPUT
// ============================================

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ============================================
// FILTER SELECT
// ============================================

interface FilterSelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
  placeholder?: string;
  className?: string;
}

export function FilterSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder,
  className = "w-[140px]",
}: FilterSelectProps<T>) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ============================================
// PLATFORM BADGES
// ============================================

interface PlatformBadgesProps {
  platforms: Platform[];
  selectedPlatform: string;
  onSelect: (platformType: string) => void;
}

export function PlatformBadges({
  platforms,
  selectedPlatform,
  onSelect,
}: PlatformBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={selectedPlatform === "all" ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => onSelect("all")}
      >
        All Platforms
      </Badge>
      {platforms
        .filter((p) => p.type !== "manual")
        .map((platform) => (
          <Badge
            key={platform.id}
            variant={
              selectedPlatform === platform.type
                ? PLATFORM_BADGE_VARIANTS[platform.type]
                : PLATFORM_BADGE_OUTLINE_VARIANTS[platform.type]
            }
            className="cursor-pointer"
            onClick={() =>
              onSelect(
                platform.type === selectedPlatform ? "all" : platform.type
              )
            }
          >
            {platform.name}
          </Badge>
        ))}
    </div>
  );
}

// ============================================
// STATUS PILLS
// ============================================

interface StatusPillsProps {
  stats: ReturnType<typeof getOrderStats>;
  selectedStatus: string;
  onSelect: (status: string) => void;
}

export function StatusPills({
  stats,
  selectedStatus,
  onSelect,
}: StatusPillsProps) {
  const statusItems = [
    { status: "all", label: "All", count: stats.total },
    { status: "pending", label: "Pending", count: stats.pending },
    { status: "processing", label: "Processing", count: stats.processing },
    { status: "designing", label: "Designing", count: stats.designing },
    { status: "production", label: "Production", count: stats.production },
    { status: "shipped", label: "Shipped", count: stats.shipped },
    { status: "delivered", label: "Delivered", count: stats.delivered },
    { status: "cancelled", label: "Cancelled", count: stats.cancelled },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statusItems.map((item) => (
        <Button
          key={item.status}
          variant={selectedStatus === item.status ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(item.status)}
          className="h-8"
        >
          {item.label}
          <Badge variant="secondary" className="ml-2 h-5 px-1.5">
            {item.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
}

// ============================================
// COMBINED FILTERS BAR
// ============================================

interface OrderFiltersBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  platformFilter: string;
  onPlatformChange: (value: string) => void;
  accountFilter: string;
  onAccountChange: (value: string) => void;
  storeFilter: string;
  onStoreChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  platforms: Platform[];
  accounts: Account[];
  stores: Store[];
}

export function OrderFiltersBar({
  searchQuery,
  onSearchChange,
  platformFilter,
  onPlatformChange,
  accountFilter,
  onAccountChange,
  storeFilter,
  onStoreChange,
  statusFilter,
  onStatusChange,
  platforms,
  accounts,
  stores,
}: OrderFiltersBarProps) {
  const platformOptions = [
    { value: "all", label: "All Platforms" },
    ...platforms.map((p) => ({ value: p.type, label: p.name })),
  ];

  const accountOptions = [
    { value: "all", label: "All Accounts" },
    ...accounts.map((a) => ({ value: a.id, label: a.name.split(" (")[0] })),
  ];

  const storeOptions = [
    { value: "all", label: "All Stores" },
    ...stores.map((s) => ({ value: s.id, label: s.name.split(" - ")[0] })),
  ];

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search orders..."
      />

      <FilterSelect
        value={platformFilter}
        onChange={onPlatformChange}
        options={platformOptions}
        placeholder="Platform"
      />

      <FilterSelect
        value={accountFilter}
        onChange={onAccountChange}
        options={accountOptions}
        placeholder="Account"
        className="w-[180px]"
      />

      <FilterSelect
        value={storeFilter}
        onChange={onStoreChange}
        options={storeOptions}
        placeholder="Store"
        className="w-[180px]"
      />

      <FilterSelect
        value={statusFilter}
        onChange={onStatusChange}
        options={ORDER_STATUS_OPTIONS}
        placeholder="Status"
      />
    </div>
  );
}
