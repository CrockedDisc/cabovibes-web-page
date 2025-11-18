// components/GalleryGrid.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type GalleryImage = {
  id: number;
  url: string;
  alt: string;
};

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Preparar slides para el lightbox
  const slides = images.map((img) => ({
    src: img.url,
    alt: img.alt,
  }));

  const handleImageClick = (index: number) => {
    setPhotoIndex(index);
    setOpen(true);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No images available yet.</p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="break-inside-avoid overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => handleImageClick(index)}
          >
            <div className="relative aspect-auto">
              <Image
                src={image.url}
                alt={image.alt}
                width={500}
                height={500}
                className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                  View
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={photoIndex}
        carousel={{ finite: true }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
        }}
      />
    </>
  );
}
