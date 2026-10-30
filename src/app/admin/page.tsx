import type { Metadata } from "next";
import AdminPanel from "@/components/AdminPanel";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = { title: "Admin — Moonlit Wardrobe", robots: { index: false } };

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <main className="container-x pt-24 pb-20">
        <h1 className="text-3xl font-bold md:text-4xl">Admin</h1>
        <p className="mt-2 text-sm text-muted">Add new items with their details and photos.</p>
        <AdminPanel />
      </main>
      <Footer />
    </>
  );
}
