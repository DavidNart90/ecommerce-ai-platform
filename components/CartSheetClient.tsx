"use client";

import dynamic from "next/dynamic";

// Dynamic import with ssr: false to prevent hydration issues with useQuery
const CartSheet = dynamic(
  () => import("@/components/CartSheet").then((mod) => mod.CartSheet),
  { ssr: false }
);

export function CartSheetClient() {
  return <CartSheet />;
}
