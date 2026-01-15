"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Grid2x2, ChevronRight } from "lucide-react";
import type { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

interface CategoryTilesProps {
  categories: ALL_CATEGORIES_QUERYResult;
  activeCategory?: string;
}

export function CategoryTiles({
  categories,
  activeCategory,
}: CategoryTilesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative group/container">
        {/* Horizontal scrolling container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        >
          {/* All Products tile */}
          <Link
            href="/"
            className={`group relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${!activeCategory
              ? "ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-zinc-900"
              : "hover:ring-2 hover:ring-zinc-300 hover:ring-offset-2 dark:hover:ring-zinc-600 dark:hover:ring-offset-zinc-900"
              }`}
          >
            <div className="relative h-32 w-56 sm:h-56 sm:w-80">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800" />

              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Grid2x2 className="h-12 w-12 text-white/60 transition-transform duration-300 group-hover:scale-110" />
              </div>

              {/* Dark overlay for text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Category name */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="text-base font-semibold text-white drop-shadow-md">
                  All Products
                </span>
              </div>
            </div>
          </Link>

          {/* Category tiles */}
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;
            const imageUrl = category.image?.asset?.url;

            return (
              <Link
                key={category._id}
                href={`/?category=${category.slug}`}
                className={`group relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${isActive
                  ? "ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-zinc-900"
                  : "hover:ring-2 hover:ring-zinc-300 hover:ring-offset-2 dark:hover:ring-zinc-600 dark:hover:ring-offset-zinc-900"
                  }`}
              >
                <div className="relative h-32 w-56 sm:h-56 sm:w-80">
                  {/* Background image or gradient fallback */}
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={category.title ?? "Category"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600" />
                  )}

                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/80" />

                  {/* Category name */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="text-base font-semibold text-white drop-shadow-md">
                      {category.title}
                    </span>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-2 right-2">
                      <span className="flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>



        {/* Right fade overlay with arrow */}
        <button
          onClick={scrollRight}
          className="absolute bottom-4 right-0 top-0 flex w-24 cursor-pointer items-center justify-end bg-gradient-to-l from-black/60 via-black/30 to-transparent pr-4 opacity-0 transition-opacity duration-300 group-hover/container:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-8 w-8 text-white drop-shadow-md transition-transform duration-300 hover:scale-110" />
        </button>
      </div>
    </div>
  );
}
