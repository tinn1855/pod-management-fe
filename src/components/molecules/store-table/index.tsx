"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Store } from "@/type/platform";
import {
  MoreHorizontal,
  ExternalLink,
  Settings,
  Trash2,
  ShoppingCart,
  Star,
} from "lucide-react";
import {
  PLATFORM_BADGE_OUTLINE_VARIANTS,
  STORE_STATUS_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";
import { formatCurrency, formatNumber } from "@/constants";

interface StoreTableProps {
  stores: Store[];
  onEdit?: (store: Store) => void;
  onDelete?: (store: Store) => void;
  onViewOrders?: (store: Store) => void;
}

export function StoreTable({
  stores,
  onEdit,
  onDelete,
  onViewOrders,
}: StoreTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store Name</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="text-right">Orders</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-muted-foreground"
              >
                No stores found
              </TableCell>
            </TableRow>
          ) : (
            stores.map((store) => (
              <TableRow
                key={store.id}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{store.name}</span>
                    {store.storeUrl && (
                      <a
                        href={store.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Store
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {store.account.name.split(" (")[0]}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      PLATFORM_BADGE_OUTLINE_VARIANTS[store.account.platform.type]
                    }
                  >
                    {store.account.platform.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={STORE_STATUS_BADGE_OUTLINE_VARIANTS[store.status]}>
                    {store.status}
                  </Badge>
                </TableCell>
                <TableCell>{store.country}</TableCell>
                <TableCell className="text-right">{formatNumber(store.totalOrders)}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(store.totalRevenue)}
                </TableCell>
                <TableCell className="text-center">
                  {store.rating && (
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{store.rating}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewOrders?.(store)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        View Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(store)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(store)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
