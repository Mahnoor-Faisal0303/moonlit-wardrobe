import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import OrdersPanel from "@/components/OrdersPanel";

export const metadata: Metadata = { title: "Orders — Moonlit Wardrobe", robots: { index: false } };

export default function AdminOrdersPage() {
  return (
    <>
      <Navbar />
      <main className="container-x pt-24 pb-20">
        <OrdersPanel />
      </main>
      <Footer />
    </>
  );
}
