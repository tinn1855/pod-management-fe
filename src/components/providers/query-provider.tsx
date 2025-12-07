"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Default staleTime for all queries
            staleTime: 5 * 60 * 1000, // 5 minutes
            // Default gcTime (formerly cacheTime)
            gcTime: 30 * 60 * 1000, // 30 minutes
            // Don't refetch on window focus by default (optional, good for less aggressive fetching)
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

