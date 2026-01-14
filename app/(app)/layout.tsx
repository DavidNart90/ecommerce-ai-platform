import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { SanityLive } from "@/sanity/lib/live";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { Toaster } from "@/components/ui/sonner";
import { ChatStoreProvider } from "@/lib/store/chat-store-provider";
import { Header } from "@/components/Header";
import { CartSheetClient } from "@/components/CartSheetClient";
import { SanitySdkProvider } from "@/lib/providers/sanity-sdk-provider";
import { ChatSheet } from "@/components/ChatSheet";
import { AppShell } from "@/components/AppShell";

export default function Layout({children}: {children: ReactNode}){
    return (
    <ClerkProvider>
        <SanitySdkProvider>
            <CartStoreProvider>
                <ChatStoreProvider>
                    <AppShell>
                        <Header />
                        <main>
                            {children}
                        </main>
                    </AppShell>
                    <CartSheetClient />
                    <ChatSheet />
                    <SanityLive />
                    <Toaster position = "bottom-center" />
                </ChatStoreProvider>
            </CartStoreProvider>
        </SanitySdkProvider>
    </ClerkProvider>
    );
}