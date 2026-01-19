import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutSkeleton() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-4 h-9 w-40" />
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
                {/* Cart Items */}
                <div className="lg:col-span-3">
                    {/* Order Summary Card */}
                    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                            <Skeleton className="h-5 w-48" />
                        </div>

                        {/* Items List */}
                        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex gap-4 px-6 py-4">
                                    {/* Image */}
                                    <Skeleton className="h-20 w-20 shrink-0 rounded-md" />

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <Skeleton className="h-5 w-40" />
                                            <Skeleton className="mt-2 h-4 w-16" />
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right">
                                        <Skeleton className="h-5 w-20" />
                                        <Skeleton className="mt-1 h-4 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Information Card */}
                    <div className="mt-6 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                            <Skeleton className="h-5 w-44" />
                        </div>
                        <div className="space-y-4 p-6">
                            {/* Info Notice */}
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/50">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="mt-2 h-4 w-full" />
                                <Skeleton className="mt-1 h-4 w-3/4" />
                            </div>

                            {/* Info Items */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton className="h-5 w-5 shrink-0 rounded" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="mt-1 h-4 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="lg:col-span-2">
                    <div className="sticky top-24 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                        <Skeleton className="h-5 w-36" />

                        <div className="mt-6 space-y-4">
                            {/* Price Lines */}
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-12" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <Skeleton className="mt-6 h-11 w-full rounded-lg" />

                        {/* Security Info */}
                        <div className="mt-6 space-y-3">
                            <Skeleton className="mx-auto h-4 w-48" />
                            <Skeleton className="mx-auto h-3 w-full" />
                            <Skeleton className="mx-auto h-3 w-4/5" />
                            <div className="flex items-center justify-center gap-4 pt-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
