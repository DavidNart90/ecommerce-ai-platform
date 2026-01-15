"use client";

import { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/sanity/lib/client";
import { REVENUE_OVER_TIME_QUERY } from "@/sanity/queries/stats";

interface RevenueData {
  date: string;
  total: number;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Format currency with comma separators
const formatCurrency = (value: number) =>
  `£${value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function RevenueChart() {
  const [rawData, setRawData] = useState<RevenueData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const data = await client.fetch(REVENUE_OVER_TIME_QUERY, {
          startDate: thirtyDaysAgo.toISOString(),
        });

        const validData = (data || []).map((item) => ({
          date: item.date ?? "",
          total: item.total ?? 0,
        }));

        setRawData(validData);
        setError(null);
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group by date and sum totals
  const chartData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];

    const groupedData: Record<string, number> = {};

    rawData.forEach((item) => {
      if (!item.date || item.total === null) return;

      const date = new Date(item.date).toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
      });
      groupedData[date] = (groupedData[date] || 0) + item.total;
    });

    return Object.entries(groupedData).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }, [rawData]);

  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.revenue, 0);
  }, [chartData]);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Over Time
          </CardTitle>
          <CardDescription>Last 30 days revenue trend</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Over Time
          </CardTitle>
          <CardDescription>Last 30 days revenue trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-sm text-red-500">
            Error loading chart data: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Revenue Over Time
        </CardTitle>
        <CardDescription>Last 30 days revenue trend</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
            No revenue data available for the last 30 days
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    `£${value.toLocaleString("en-GB")}`
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="var(--color-revenue)"
                  fillOpacity={0.4}
                  stroke="var(--color-revenue)"
                />
              </AreaChart>
            </ChartContainer>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <div className="font-medium">Total:</div>
              <div className="text-zinc-600 dark:text-zinc-400">
                £{totalRevenue.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in last 30 days
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
