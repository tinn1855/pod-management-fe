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
import { Account, Store } from "@/type/platform";
import {
  MoreHorizontal,
  RefreshCw,
  Settings,
  Trash2,
  Store as StoreIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  PLATFORM_BADGE_OUTLINE_VARIANTS,
  ACCOUNT_STATUS_BADGE_OUTLINE_VARIANTS,
} from "@/constants/badge-variants";

interface AccountTableProps {
  accounts: Account[];
  stores: Store[];
  onSync?: (account: Account) => void;
  onEdit?: (account: Account) => void;
  onDelete?: (account: Account) => void;
  onViewStores?: (account: Account) => void;
}

export function AccountTable({
  accounts,
  stores,
  onSync,
  onEdit,
  onDelete,
  onViewStores,
}: AccountTableProps) {
  const getStoreCount = (accountId: string) =>
    stores.filter((s) => s.account.id === accountId).length;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account Name</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Stores</TableHead>
            <TableHead>Connected</TableHead>
            <TableHead>Last Sync</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                No accounts found
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((account) => (
              <TableRow
                key={account.id}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={PLATFORM_BADGE_OUTLINE_VARIANTS[account.platform.type]}
                  >
                    {account.platform.name}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {account.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={ACCOUNT_STATUS_BADGE_OUTLINE_VARIANTS[account.status]}
                  >
                    {account.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="gap-1">
                    <StoreIcon className="h-3 w-3" />
                    {getStoreCount(account.id)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {account.connectedAt
                    ? format(new Date(account.connectedAt), "dd/MM/yyyy")
                    : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {account.lastSyncAt
                    ? format(new Date(account.lastSyncAt), "dd/MM/yyyy HH:mm")
                    : "-"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewStores?.(account)}>
                        <StoreIcon className="mr-2 h-4 w-4" />
                        View Stores
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSync?.(account)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Now
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(account)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(account)}
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
