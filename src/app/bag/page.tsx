import type { Metadata } from "next";
import BagView from "@/components/BagView";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = { title: "Your Bag — Moonlit Wardrobe" };

export default function BagPage() {
  return (
    <>
      <Navbar />
      <main className="container-x pt-24 pb-20">
        <h1 className="text-3xl font-bold md:text-4xl">Your Bag</h1>
        <BagView />
      </main>
      <Footer />
    </>
  );
}
