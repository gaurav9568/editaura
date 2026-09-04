import Navbar from "./components/Navbar";
import Hero from "./Sections/Hero";
import Portfolio from "./Sections/Portfolio";
import Services from "./Sections/Services";
import Testimonials from "./Sections/Testimonials";
import Inquiry from "./Sections/Inquiry";
import Footer from "./Sections/Footer";
import CustomCursor from "./components/CustomCursor";
import ScrollReveal from "./components/ScrollReveal";
import AdminProvider from "./components/AdminProvider";

export default function Home() {
  return (
    <AdminProvider>
      <CustomCursor />
      <Navbar />
      <Portfolio />
      <Hero />
      <Services />
      <Testimonials />
      <Inquiry />
      <Footer />
      <ScrollReveal />
    </AdminProvider>
  );
}
