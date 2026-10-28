import About from "@/components/About";
import Collection from "@/components/Collection";
import Faq from "@/components/Faq";
import Footer, { Cta } from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { Brands, Creators } from "@/components/Profiles";
import Trending from "@/components/Trending";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Collection />
        <Trending />
        <Creators />
        <Brands />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
