import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import OrderTracker from "@/components/OrderTracker";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = { title: "Track Order — Moonlit Wardrobe", robots: { index: false } };

// The order id is only known at request time, so this route is rendered on demand instead of prerendered.
export const instant = false;

type Params = Promise<{ id: string }>;

async function Tracker({ params }: { params: Params }) {
  const { id } = await params;
  return <OrderTracker key={id} id={id} />;
}

export default function OrderPage({ params }: { params: Params }) {
  return (
    <>
      <Navbar />
      <main className="container-x pt-24 pb-20">
        <ButtonLink href="/orders" variant="ghost">← My orders</ButtonLink>
        <Suspense fallback={<div className="mt-10 h-64 animate-pulse rounded-lg bg-surface-strong" aria-busy />}>
          <Tracker params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
