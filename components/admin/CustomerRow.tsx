"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useDocumentProjection, type DocumentHandle } from "@sanity/sdk-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CustomerProjection {
  email: string;
  name: string | null;
  createdAt: string;
  orderCount: number;
  totalSpent: number | null;
  lastOrderDate: string | null;
}

function CustomerRowContent(handle: DocumentHandle) {
  const { data } = useDocumentProjection<CustomerProjection>({
    ...handle,
    projection: `{
      email,
      name,
      createdAt,
      "orderCount": count(*[_type == "order" && references(^._id)]),
      "totalSpent": math::sum(*[_type == "order" && references(^._id) && status in ["paid", "shipped", "delivered"]].total),
      "lastOrderDate": *[_type == "order" && references(^._id)] | order(createdAt desc)[0].createdAt
    }`,
  });

  if (!data) return null;

  const displayName = data.name || data.email;
  const isActive = data.orderCount > 0;

  return (
    <TableRow className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      {/* Customer Info - Mobile: includes email, orders, total */}
      <TableCell className="py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:block">
          <div>
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {displayName}
            </div>
            {/* Mobile: Email if name exists */}
            {data.name && (
              <div className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400 sm:hidden">
                {data.email}
              </div>
            )}
          </div>
          {/* Mobile: Total spent inline */}
          <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:hidden">
            {formatPrice(data.totalSpent)}
          </span>
        </div>
        {/* Mobile: Orders and date */}
        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 sm:hidden">
          <span>
            {data.orderCount} {data.orderCount === 1 ? "order" : "orders"}
          </span>
          {data.lastOrderDate && (
            <>
              {" · "}
              <span>Last: {formatDate(data.lastOrderDate, "short")}</span>
            </>
          )}
        </div>
      </TableCell>

      {/* Email - Desktop only */}
      <TableCell className="hidden py-4 text-zinc-500 dark:text-zinc-400 sm:table-cell">
        {data.name ? (
          <span className="truncate">{data.email}</span>
        ) : (
          <span className="text-zinc-400">—</span>
        )}
      </TableCell>

      {/* Orders - Desktop only */}
      <TableCell className="hidden py-4 text-center md:table-cell">
        <Badge variant="outline" className="font-mono">
          {data.orderCount}
        </Badge>
      </TableCell>

      {/* Total Spent - Desktop only */}
      <TableCell className="hidden py-4 font-medium text-zinc-900 dark:text-zinc-100 sm:table-cell">
        {formatPrice(data.totalSpent)}
      </TableCell>

      {/* Status - Always visible */}
      <TableCell className="py-3 sm:py-4">
        <div className="flex justify-center sm:justify-start">
          <Badge
            variant={isActive ? "default" : "secondary"}
            className="text-[10px] sm:text-xs"
          >
            {isActive ? "Active" : "New"}
          </Badge>
        </div>
      </TableCell>

      {/* Last Order - Desktop only */}
      <TableCell className="hidden py-4 text-zinc-500 dark:text-zinc-400 md:table-cell">
        {data.lastOrderDate ? formatDate(data.lastOrderDate, "long") : "—"}
      </TableCell>

      {/* Member Since - Desktop only */}
      <TableCell className="hidden py-4 text-zinc-500 dark:text-zinc-400 lg:table-cell">
        {formatDate(data.createdAt, "long", "—")}
      </TableCell>
    </TableRow>
  );
}

function CustomerRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="py-3 sm:py-4">
        <div>
          <div className="flex items-center justify-between gap-2 sm:block">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16 sm:hidden" />
          </div>
          <div className="mt-1 sm:hidden">
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden py-4 sm:table-cell">
        <Skeleton className="h-4 w-40" />
      </TableCell>
      <TableCell className="hidden py-4 text-center md:table-cell">
        <Skeleton className="mx-auto h-4 w-8" />
      </TableCell>
      <TableCell className="hidden py-4 sm:table-cell">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="py-3 sm:py-4">
        <div className="flex justify-center sm:justify-start">
          <Skeleton className="h-5 w-12" />
        </div>
      </TableCell>
      <TableCell className="hidden py-4 md:table-cell">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="hidden py-4 lg:table-cell">
        <Skeleton className="h-4 w-24" />
      </TableCell>
    </TableRow>
  );
}

export function CustomerRow(props: DocumentHandle) {
  return (
    <Suspense fallback={<CustomerRowSkeleton />}>
      <CustomerRowContent {...props} />
    </Suspense>
  );
}

export { CustomerRowSkeleton };
