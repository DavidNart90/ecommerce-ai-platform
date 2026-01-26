"use client";

import { Suspense, useState } from "react";
import { useDocuments } from "@sanity/sdk-react";
import { Users } from "lucide-react";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  CustomerRow,
  CustomerRowSkeleton,
  AdminSearch,
  CustomerTableHeader,
} from "@/components/admin";

interface CustomerListContentProps {
  searchFilter?: string;
}

function CustomerListContent({ searchFilter }: CustomerListContentProps) {
  const filter = searchFilter ? `(${searchFilter})` : undefined;

  const {
    data: customers,
    hasMore,
    loadMore,
    isPending,
  } = useDocuments({
    documentType: "customer",
    filter,
    orderings: [{ field: "_createdAt", direction: "desc" }],
    batchSize: 20,
  });

  if (!customers || customers.length === 0) {
    const description = searchFilter
      ? "Try adjusting your search terms."
      : "Customers will appear here when they make their first purchase.";

    return (
      <EmptyState
        icon={Users}
        title="No customers found"
        description={description}
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <Table>
          <CustomerTableHeader />
          <TableBody>
            {customers.map((handle) => (
              <CustomerRow key={handle.documentId} {...handle} />
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={() => loadMore()}
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
}

function CustomerListSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <Table>
        <CustomerTableHeader />
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <CustomerRowSkeleton key={i} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Generate search filter for customer fields
  const searchFilter = searchQuery.trim()
    ? `email match "*${searchQuery}*" || name match "*${searchQuery}*"`
    : undefined;

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Customers
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
          View customer details and purchase history
        </p>
      </div>

      {/* Search */}
      <AdminSearch
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="w-full sm:max-w-sm"
      />

      {/* Customer List */}
      {isSearching ? (
        <CustomerListSkeleton />
      ) : (
        <Suspense fallback={<CustomerListSkeleton />}>
          <CustomerListContent searchFilter={searchFilter} />
        </Suspense>
      )}
    </div>
  );
}
