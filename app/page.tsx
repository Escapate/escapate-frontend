import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Destinos from "@/components/Destinos";
import About from "@/components/About";
import Services from "@/components/Services";
import Why from "@/components/Why";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Destinos />
      <About />
      <Services />
      <Why />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
