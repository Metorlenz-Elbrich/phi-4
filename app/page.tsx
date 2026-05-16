import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { Security } from "@/components/sections/Security";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <Projects />
      <Security />
      <Contact />
      <Footer />
    </main>
  );
}
