"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ShoppingBag,
  AlertTriangle,
  Loader2,
  Truck,
  MapPin,
  Shield,
  Clock,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/CheckoutButton";
import { formatPrice } from "@/lib/utils";
import {
  useCartItems,
  useTotalPrice,
  useTotalItems,
} from "@/lib/store/cart-store-provider";
import { useCartStock } from "@/lib/hooks/useCartStock";

export function CheckoutClient() {
  const items = useCartItems();
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-zinc-300 dark:text-zinc-600" />
          <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Your cart is empty
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Add some items to your cart before checking out.
          </p>
          <Button asChild className="mt-8">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Checkout
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Cart Items */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Order Summary ({totalItems} items)
              </h2>
            </div>

            {/* Stock Issues Warning */}
            {hasStockIssues && !isLoading && (
              <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>
                  Some items have stock issues. Please update your cart before
                  proceeding.
                </span>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                <span className="ml-2 text-sm text-zinc-500">
                  Verifying stock...
                </span>
              </div>
            )}

            {/* Items List */}
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {items.map((item) => {
                const stockInfo = stockMap.get(item.productId);
                const hasIssue =
                  stockInfo?.isOutOfStock || stockInfo?.exceedsStock;

                return (
                  <div
                    key={item.productId}
                    className={`flex gap-4 px-6 py-4 ${hasIssue ? "bg-red-50 dark:bg-red-950/20" : ""
                      }`}
                  >
                    {/* Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          Qty: {item.quantity}
                        </p>
                        {stockInfo?.isOutOfStock && (
                          <p className="mt-1 text-sm font-medium text-red-600">
                            Out of stock
                          </p>
                        )}
                        {stockInfo?.exceedsStock && !stockInfo.isOutOfStock && (
                          <p className="mt-1 text-sm font-medium text-amber-600">
                            Only {stockInfo.currentStock} available
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-zinc-500">
                          {formatPrice(item.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="mt-6 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Delivery Information
              </h2>
            </div>
            <div className="space-y-4 p-6">
              {/* Shipping Address Notice */}
              <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/50">
                <Info className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Shipping Address Required
                  </p>
                  <p className="mt-1 text-blue-700 dark:text-blue-300">
                    You'll be asked to provide your shipping address on the
                    secure Stripe checkout page. Please ensure all details are
                    accurate for successful delivery.
                  </p>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
                <div className="text-sm">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    Estimated Delivery
                  </p>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                    2-5 business days for standard shipping
                  </p>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
                <div className="text-sm">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    How We Ship
                  </p>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                    All orders are carefully packaged and shipped via trusted
                    carriers. You'll receive tracking information once your
                    order ships.
                  </p>
                </div>
              </div>

              {/* Coverage Area */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
                <div className="text-sm">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    Delivery Coverage
                  </p>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                    We deliver nationwide. Shipping costs will be calculated
                    based on your location during checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Total & Checkout */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Payment Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Subtotal
                </span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Shipping
                </span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  Calculated at checkout
                </span>
              </div>
              <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-zinc-900 dark:text-zinc-100">
                    Total
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <CheckoutButton disabled={hasStockIssues || isLoading} />
            </div>

            {/* Security & Trust Indicators */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <Shield className="h-4 w-4" />
                <span>Secure checkout powered by Stripe</span>
              </div>

              <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                Your payment information is encrypted and secure. We never store
                your card details.
              </p>

              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                  </svg>
                  <span>SSL Encrypted</span>
                </div>
                <div className="h-3 w-px bg-zinc-300 dark:bg-zinc-700" />
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                  <span>PCI Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
