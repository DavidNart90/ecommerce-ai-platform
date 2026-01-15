"use client";

import { ProductCard } from "@/components/LandingPage/ProductCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import type { RELATED_PRODUCTS_QUERYResult } from "@/sanity.types";

interface RelatedProductsProps {
    products: RELATED_PRODUCTS_QUERYResult;
}

export function RelatedProducts({ products }: RelatedProductsProps) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="mt-16 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    You May Also Like
                </h2>

                {/* Navigation buttons will be rendered by the Carousel component, 
            but we can add a visual indicator or link if needed */}
            </div>

            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {products.map((product) => (
                        <CarouselItem
                            key={product._id}
                            className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4"
                        >
                            <ProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <div className="flex justify-end gap-2 mt-4">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                </div>
            </Carousel>
        </div>
    );
}
