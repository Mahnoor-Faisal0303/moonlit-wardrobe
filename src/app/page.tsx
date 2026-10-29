import About from "@/components/About";
import Collection from "@/components/Collection";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Footer, { Cta } from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import OnSale from "@/components/OnSale";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Collection />
        <OnSale />
        <About />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
