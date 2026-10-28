import type { Metadata } from "next";
import ExploreGrid from "@/components/ExploreGrid";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = { title: "Explore Collections — Moonlit Wardrobe" };

export default function ExplorePage() {
  return (
    <>
      <Navbar />
      <main className="container-x pt-24 pb-20">
        <h1 className="text-center text-4xl font-bold md:text-6xl">Explore Collections</h1>
        <ExploreGrid />
      </main>
      <Footer />
    </>
  );
}
