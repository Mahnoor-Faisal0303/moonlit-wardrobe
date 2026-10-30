import type { Metadata } from "next";
import Footer from "@/components/Footer";
import MyOrders from "@/components/MyOrders";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = { title: "My Orders — Moonlit Wardrobe", robots: { index: false } };

export default function OrdersPage() {
  return (
    <>
      <Navbar />
      <main className="container-x pt-24 pb-20">
        <h1 className="text-3xl font-bold md:text-4xl">My Orders</h1>
        <p className="mt-2 text-sm text-muted">Follow your orders from placed to delivered.</p>
        <MyOrders />
      </main>
      <Footer />
    </>
  );
}
