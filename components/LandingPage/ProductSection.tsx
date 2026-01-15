"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductFilters } from "@/components/LandingPage/ProductFilters";
import { ProductGrid } from "@/components/LandingPage/ProductGrid";
import type {
  ALL_CATEGORIES_QUERYResult,
  FILTER_PRODUCTS_BY_NAME_QUERYResult,
} from "@/sanity.types";

interface ProductSectionProps {
  categories: ALL_CATEGORIES_QUERYResult;
  products: FILTER_PRODUCTS_BY_NAME_QUERYResult;
  searchQuery: string;
}

export function ProductSection({
  categories,
  products,
  searchQuery,
}: ProductSectionProps) {
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);

  const displayedProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const showMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, products.length));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with results count and filter toggle */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {products.length} {products.length === 1 ? "product" : "products"}{" "}
          found
          {searchQuery && (
            <span>
              {" "}
              for &quot;<span className="font-medium">{searchQuery}</span>&quot;
            </span>
          )}
        </p>

        {/* Filter toggle button */}
        {/* Filter toggle button - Desktop */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="hidden items-center gap-2 border-zinc-300 bg-white shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 lg:flex"
          aria-label={filtersOpen ? "Hide filters" : "Show filters"}
        >
          {filtersOpen ? (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span className="hidden sm:inline">Hide Filters</span>
              <span className="sm:hidden">Hide</span>
            </>
          ) : (
            <>
              <PanelLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Show Filters</span>
              <span className="sm:hidden">Filters</span>
            </>
          )}
        </Button>

        {/* Filter toggle button - Mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-zinc-300 bg-white shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 lg:hidden"
              aria-label="Show filters"
            >
              <span className="text-sm font-medium">Filters</span>
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-left">Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <ProductFilters categories={categories} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content area */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters - completely hidden when collapsed on desktop */}
        {/* Sidebar Filters - Desktop only */}
        <aside
          className={`hidden shrink-0 transition-all duration-300 ease-in-out lg:block ${filtersOpen ? "w-72 opacity-100" : "w-0 overflow-hidden opacity-0"
            }`}
        >
          <ProductFilters categories={categories} />
        </aside>

        {/* Product Grid - expands to full width when filters hidden */}
        <main className="flex-1 transition-all duration-300">
          <ProductGrid products={displayedProducts} />

          {hasMore && (
            <div className="mt-12 flex justify-center">
              <Button
                size="lg"
                onClick={showMore}
                className="min-w-[200px] bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Show More Products
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
