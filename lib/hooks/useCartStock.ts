"use client";

import { useMemo } from "react";
import type { CartItem } from "@/lib/store/cart-store";
import { useQuery } from "@sanity/sdk-react";
import { PRODUCTS_BY_IDS_QUERY } from "@/sanity/queries/products";
import type { PRODUCTS_BY_IDS_QUERYResult } from "@/sanity.types";

export interface StockInfo {
  productId: string;
  currentStock: number;
  isOutOfStock: boolean;
  exceedsStock: boolean;
  availableQuantity: number;
}

export type StockMap = Map<string, StockInfo>;

interface UseCartStockReturn {
  stockMap: StockMap;
  isLoading: boolean;
  hasStockIssues: boolean;
  refetch: () => void;
}

/**
 * Fetches current stock levels for cart items with live updates
 * Returns stock info map and loading state
 */
export function useCartStock(items: CartItem[]): UseCartStockReturn {
  const productIds = useMemo(
    () => items.map((item) => item.productId),
    [items]
  );

  const { data: products, isPending } = useQuery<PRODUCTS_BY_IDS_QUERYResult>({
    query: PRODUCTS_BY_IDS_QUERY,
    params: {
      ids: productIds,
    },
  });

  // Derive stockMap from products data
  const stockMap = useMemo(() => {
    const map = new Map<string, StockInfo>();

    if (!products || items.length === 0) {
      return map;
    }

    for (const item of items) {
      const product = products.find((p) => p._id === item.productId);
      const currentStock = product?.stock ?? 0;

      map.set(item.productId, {
        productId: item.productId,
        currentStock,
        isOutOfStock: currentStock === 0,
        exceedsStock: item.quantity > currentStock,
        availableQuantity: Math.min(item.quantity, currentStock),
      });
    }

    return map;
  }, [products, items]);

  const hasStockIssues = useMemo(
    () =>
      Array.from(stockMap.values()).some(
        (info) => info.isOutOfStock || info.exceedsStock
      ),
    [stockMap]
  );

  return {
    stockMap,
    isLoading: isPending,
    hasStockIssues,
    refetch: () => {}, // Live updates handle refetching automatically
  };
}
