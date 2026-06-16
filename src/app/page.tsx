import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StartHere from "@/components/StartHere";
import Capabilities from "@/components/Capabilities";
import StudioTeaser from "@/components/StudioTeaser";
import Showcase from "@/components/Showcase";
import Process from "@/components/Process";
import Quality from "@/components/Quality";
import Trust from "@/components/Trust";
import SampleKit from "@/components/SampleKit";
import Resources from "@/components/Resources";
import LeadMagnet from "@/components/LeadMagnet";
import ClientCenter from "@/components/ClientCenter";
import AreasServed from "@/components/AreasServed";
import QuoteForm from "@/components/QuoteForm";
import ContactBlock from "@/components/ContactBlock";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <StartHere />
        <Capabilities />
        <StudioTeaser />
        <Showcase />
        <Process />
        <Quality />
        <Trust />
        <SampleKit />
        <Resources />
        <LeadMagnet />
        <ClientCenter />
        <AreasServed />
        <QuoteForm />
        <ContactBlock />
      </main>
      <Footer />
    </>
  );
}
