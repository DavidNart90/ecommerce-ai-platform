"use client";

import Link from "next/link";
import { Menu, Package, ShoppingBag, Sparkles, User } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { useChatActions, useIsChatOpen } from "@/lib/store/chat-store-provider";

export function Header() {
  const { openCart } = useCartActions();
  const { openChat } = useChatActions();
  const isChatOpen = useIsChatOpen();
  const totalItems = useTotalItems();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              The Furniture Store
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-8">
            {/* My Orders - Desktop Only */}
            <div className="hidden lg:flex items-center">
              <SignedIn>
                <Button asChild>
                  <Link href="/orders" className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span className="text-sm font-medium">My Orders</span>
                  </Link>
                </Button>
              </SignedIn>
            </div>

            {/* AI Shopping Assistant - Desktop Only */}
            <div className="hidden lg:flex items-center">
              {!isChatOpen && (
                <Button
                  onClick={openChat}
                  className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200/50 transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-lg hover:shadow-amber-300/50 dark:shadow-amber-900/30 dark:hover:shadow-amber-800/40"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Ask AI</span>
                </Button>
              )}
            </div>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
              <span className="sr-only">Open cart ({totalItems} items)</span>
            </Button>

            {/* User */}
            <SignedIn>
              <UserButton
                afterSwitchSessionUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Orders"
                    labelIcon={<Package className="h-4 w-4" />}
                    href="/orders"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Sign in</span>
                </Button>
              </SignInButton>
            </SignedOut>

            {/* Mobile Menu Trigger */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" suppressHydrationWarning>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {/* Mobile My Orders */}
                  <SignedIn>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex w-full items-center gap-2 cursor-pointer">
                        <Package className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                  </SignedIn>

                  {/* Mobile Ask AI */}
                  {!isChatOpen && (
                    <DropdownMenuItem
                      onClick={openChat}
                      className="flex w-full items-center gap-2 cursor-pointer text-amber-600 dark:text-amber-400 focus:text-amber-700 dark:focus:text-amber-300"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Ask AI</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

      </header>

      {/* Mobile Floating Ask AI Button - Fixed position, visible only on mobile when chat is closed */}
      {
        !isChatOpen && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
            <span className="animate-bounce rounded-full bg-white px-3 py-1 text-xs font-medium text-amber-600 shadow-lg shadow-amber-500/20 dark:bg-zinc-800 dark:text-amber-400">
              Ask AI
            </span>
            <Button
              onClick={openChat}
              size="icon"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/40 transition-all hover:scale-105 hover:shadow-amber-500/60"
              aria-label="Ask AI"
            >
              <Sparkles className="h-6 w-6" />
            </Button>
          </div>
        )
      }
    </>
  );
}
