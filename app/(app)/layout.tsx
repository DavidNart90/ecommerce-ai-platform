import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { SanityLive } from "@/sanity/lib/live";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { Toaster } from "@/components/ui/sonner";

function Layout({children}: {children: ReactNode}){
    return (
    <ClerkProvider>
        <CartStoreProvider>
            <main>
                {children}
            </main>
            <SanityLive />
            <Toaster position = "bottom-center" />
        </CartStoreProvider>
    </ClerkProvider>
    )
}

export default Layout;