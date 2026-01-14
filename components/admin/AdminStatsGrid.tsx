"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/sanity/lib/client";
import {
  TOTAL_REVENUE_QUERY,
  CUSTOMER_COUNT_QUERY,
  ORDER_COUNT_QUERY,
  LOW_STOCK_COUNT_QUERY,
} from "@/sanity/queries/stats";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StatsData {
  revenue: number;
  customers: number;
  orders: number;
  lowStock: number;
}

export function AdminStatsGrid() {
  const [stats, setStats] = useState<StatsData>({
    revenue: 0,
    customers: 0,
    orders: 0,
    lowStock: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const [revenue, customers, orders, lowStock] = await Promise.all([
          client.fetch(TOTAL_REVENUE_QUERY),
          client.fetch(CUSTOMER_COUNT_QUERY),
          client.fetch(ORDER_COUNT_QUERY),
          client.fetch(LOW_STOCK_COUNT_QUERY),
        ]);

        setStats({
          revenue: revenue ?? 0,
          customers: customers ?? 0,
          orders: orders ?? 0,
          lowStock: lowStock ?? 0,
        });
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid grid-cols-2 gap-px border-b border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 dark:bg-zinc-900">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="mt-2 h-8 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid grid-cols-2 gap-px border-b border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 lg:grid-cols-4">
        {/* Revenue */}
        <div className="bg-white p-6 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Revenue
            </p>
          </div>
          <p className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            £
            {Number(stats.revenue).toLocaleString("en-GB", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Customers */}
        <div className="bg-white p-6 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Customers
            </p>
          </div>
          <p className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {stats.customers}
          </p>
        </div>

        {/* Orders */}
        <Link href="/admin/orders" className="bg-white p-6 transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
              <ShoppingCart className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Orders
            </p>
          </div>
          <p className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {stats.orders}
          </p>
        </Link>

        {/* Low Stock */}
        <Link href="/admin/inventory" className="bg-white p-6 transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Low Stock Items
            </p>
          </div>
          <p className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {stats.lowStock}
          </p>
        </Link>
      </div>
    </div>
  );
}
