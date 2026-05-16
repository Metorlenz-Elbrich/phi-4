import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Storytelling } from "@/components/sections/Storytelling";
import { Projects } from "@/components/sections/Projects";
import { Security } from "@/components/sections/Security";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Process />
      <Storytelling />
      <Projects />
      <Security />
      <CTA />
      <Footer />
    </main>
  );
}
