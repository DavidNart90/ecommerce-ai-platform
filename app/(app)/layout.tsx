import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { SanityLive } from "@/sanity/lib/live";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { Toaster } from "@/components/ui/sonner";
import { ChatStoreProvider } from "@/lib/store/chat-store-provider";
import { Header } from "@/components/Header";
import { CartSheetClient } from "@/components/CartSheetClient";
import { SanitySdkProvider } from "@/lib/providers/sanity-sdk-provider";

export default function Layout({children}: {children: ReactNode}){
    return (
    <ClerkProvider>
        <SanitySdkProvider>
            <CartStoreProvider>
                <ChatStoreProvider>
                    <Header />
                    <main>
                        {children}
                    </main>
                    <CartSheetClient />
                    <SanityLive />
                    <Toaster position = "bottom-center" />
                </ChatStoreProvider>
            </CartStoreProvider>
        </SanitySdkProvider>
    </ClerkProvider>
    );
}