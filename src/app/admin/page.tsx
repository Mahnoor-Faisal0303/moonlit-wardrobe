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
        <AdminPanel />
      </main>
      <Footer />
    </>
  );
}
