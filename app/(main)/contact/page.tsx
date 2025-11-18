// app/contact/page.tsx
import React from "react";
import Header from "@/components/Header";
import ContactInfo from "@/components/ContactInfo";

export const metadata = {
  title: "Contact Us | Cabovibes",
  description: "Get in touch with Cabovibes for inquiries about tours and experiences in Los Cabos",
};

export default function ContactPage() {
  return (
    <>
      <Header
        ratio={16 / 9}
        image="/images/contact/contact-header.jpg"
        ariaLabel="Contact Us"
        title="Contact Us"
        description="We're here to help you plan your perfect Los Cabos experience"
      />
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Connect
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our tours or want to book an experience? 
            Reach out to us through any of these channels.
          </p>
        </div>
        <ContactInfo />
      </section>
    </>
  );
}
