import { Box, Hammer, Palette, Ruler, Truck } from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { AskAISimilarButton } from "@/components/AskAISimilarButton";
import { StockBadge } from "@/components/StockBadge";
import { formatPrice } from "@/lib/utils";
import type { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";

interface ProductInfoProps {
  product: NonNullable<PRODUCT_BY_SLUG_QUERYResult>;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const imageUrl = product.images?.[0]?.asset?.url;

  return (
    <div className="flex flex-col">
      {/* Category */}
      {product.category && (
        <Link
          href={`/?category=${product.category.slug}`}
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {product.category.title}
        </Link>
      )}

      {/* Title */}
      <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {product.name}
      </h1>

      {/* Price */}
      <p className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        {formatPrice(product.price)}
      </p>

      {/* Description */}
      {product.description && (
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>
      )}

      {/* Stock & Add to Cart */}
      <div className="mt-6 flex flex-col gap-3">
        <StockBadge productId={product._id} stock={product.stock ?? 0} />
        <AddToCartButton
          productId={product._id}
          name={product.name ?? "Unknown Product"}
          price={product.price ?? 0}
          image={imageUrl ?? undefined}
          stock={product.stock ?? 0}
        />
        <AskAISimilarButton productName={product.name ?? "this product"} />
      </div>

      {/* Metadata */}
      <div className="mt-6 space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        {product.material && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Box className="h-4 w-4" />
              Material
            </span>
            <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
              {product.material}
            </span>
          </div>
        )}
        {product.color && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Palette className="h-4 w-4" />
              Color
            </span>
            <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
              {product.color}
            </span>
          </div>
        )}
        {product.dimensions && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Ruler className="h-4 w-4" />
              Dimensions
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {product.dimensions}
            </span>
          </div>
        )}
        {product.assemblyRequired !== null && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Hammer className="h-4 w-4" />
              Assembly
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {product.assemblyRequired ? "Required" : "Not required"}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Truck className="h-4 w-4 shrink-0" />
            Estimated Delivery
          </span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100 text-right">
            expected within 2 - 5 days
          </span>
        </div>
      </div>
    </div>
  );
}
