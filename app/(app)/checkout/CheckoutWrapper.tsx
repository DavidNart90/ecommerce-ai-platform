"use client";

import dynamic from "next/dynamic";

const CheckoutClient = dynamic(
  () => import("./CheckoutClient").then((mod) => mod.CheckoutClient),
  { ssr: false }
);

export function CheckoutWrapper() {
  return <CheckoutClient />;
}
