import Navbar from "@/components/Navbar";
import Hero from "@/components/HeroGlobo";
import Destinos from "@/components/Destinos";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Why from "@/components/Why";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FloatingMap from "@/components/FloatingMap";
import { QuoteIntentProvider } from "@/lib/quote-provider";

export default function Home() {
  return (
    <QuoteIntentProvider>
      <main className="relative">
        <Navbar />
        {/* Secuencia de tonos (intercambio de colores): navy → navy(foto) →
            crema → navy → crema → navy → crema → navy → navy(footer). */}
        <Hero />
        <Destinos />
        <About />
        <Services />
        <Gallery />
        <Why />
        <Testimonials />
        <Contact />
        <Footer />
        <FloatingWhatsApp />
        <FloatingMap />
      </main>
    </QuoteIntentProvider>
  );
}
