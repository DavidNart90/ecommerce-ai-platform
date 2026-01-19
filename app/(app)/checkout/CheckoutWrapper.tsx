"use client";

import dynamic from "next/dynamic";
import { CheckoutSkeleton } from "@/components/CheckoutSkeleton";

const CheckoutClient = dynamic(
  () => import("./CheckoutClient").then((mod) => mod.CheckoutClient),
  {
    ssr: false,
    loading: () => <CheckoutSkeleton />,
  }
);

export function CheckoutWrapper() {
  return <CheckoutClient />;
}
