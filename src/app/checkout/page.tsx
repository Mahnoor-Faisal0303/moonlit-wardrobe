import type { Metadata } from "next";
import CheckoutView from "@/components/CheckoutView";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = { title: "Checkout — Moonlit Wardrobe", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="container-x pt-24 pb-20">
        <h1 className="text-3xl font-bold md:text-4xl">Checkout</h1>
        <CheckoutView />
      </main>
      <Footer />
    </>
  );
}
