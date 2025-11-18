// app/gallery/page.tsx
import React from "react";
import { getGalleryImages } from "@/db/queries/gallery";
import Header from "@/components/Header";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata = {
  title: "Gallery | Cabovibes",
  description: "Explore our collection of moments in Los Cabos",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      <Header
        ratio={16 / 9}
        image="/images/gallery/gallery-header.jpg"
        ariaLabel="Gallery"
        title="Gallery"
        description="Explore our collection of unforgettable moments in Los Cabos"
      />
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Our Moments
          </h2>
          <p className="text-muted-foreground">
            {images.length} photos capturing the essence of Cabovibes
          </p>
        </div>
        <GalleryGrid images={images} />
      </section>
    </>
  );
}
