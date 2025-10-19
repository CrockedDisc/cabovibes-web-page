"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Compass, Wine, ShipWheel, Sparkle } from "lucide-react";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";

const reasons = [
  {
    title: "Adventure & Comfort",
    description: "The perfect blend for an unforgettable day.",
    icon: <Wine />,
  },
  {
    title: "Diverse Fleet",
    description: "From traditional pangas to luxury yachts.",
    icon: <ShipWheel />,
  },
  {
    title: "Signature Activities",
    description: "Sport fishing, whale watching, sunset cruises, and more.",
    icon: <Sparkle />,
  },
];

const services = [
  {
    title: "Sport Fishing",
    image: "/images/what-are-you-interested-in/sport-fishing.jpg",
    link: "/sport-fishing",
    alt: "Sport Fishing",
  },
  {
    title: "Sunset & Ballena",
    image: "/images/what-are-you-interested-in/sunset-ballena.jpg",
    link: "/sunset-ballena",
    alt: "Sunset & Ballena",
  },
  {
    title: "Yacht Chartering",
    image: "/images/what-are-you-interested-in/yacht-chartering.jpg",
    link: "/yacht-chartering",
    alt: "Yacht Chartering",
  },
];

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 768px)") ?? false;
  
  return (
    <>
      <section className="relative">
        <AspectRatio ratio={16 / 9}>
          <video
            src="/videos/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="object-cover rounded-md"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70 rounded-md" />

          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center text-background px-4">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 md:mb-4">
                Experience the Magic of Los Cabos
              </h1>
              <p className="text-sm sm:text-xl md:text-2xl lg:text-3xl">
                Sport fishing trips and unforgettable nights on a yacht—let us
                plan every detail for you
              </p>
              <Button
                variant="outline"
                className="mt-2 sm:mt-4 md:mt-6 text-foreground"
              >
                <Compass />
                Explore Tours
              </Button>
            </div>
          </div>
        </AspectRatio>
      </section>
      
      <section className="flex w-full">
        <div className="grid grid-cols-3 md:grid-cols-5 auto-rows-fr gap-4 w-full">
          <div className="col-span-3 md:col-span-3">
            <h2 className="text-xl sm:text-3xl md:text-5xl font-bold rounded-md p-4 bg-muted h-full flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
              Why Choose Us?
            </h2>
          </div>
          <div className="col-span-3 md:col-span-2">
            <video
              src="/videos/why-choose-us/video-1.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="object-cover rounded-md h-full w-full"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="col-span-3 md:col-span-2">
            <AspectRatio ratio={16 / 9}>
              <Image
                src="/images/why-choose-us/image-1.jpg"
                alt="Our fleet"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover rounded-md"
              />
            </AspectRatio>
          </div>
          {reasons.map((items, index) => (
            <div
              key={index}
              className="col-span-1 rounded-md p-4 bg-muted hover:bg-foreground hover:text-background transition-colors flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-2">
                {items.icon}
                <h4 className="text-sm min-[884px]:text-base min-[1045px]:text-lg font-bold text-center">
                  {items.title}
                </h4>
                <p className="text-xs min-[884px]:text-sm min-[1045px]:text-base text-center">
                  {items.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
          <h2 className="text-xl sm:text-3xl md:text-5xl font-bold">
            What Are You Interested In?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {services.map((service, index) => (
              <div key={index} className="col-span-1">
                <AspectRatio ratio={isMobile ? 1 : 9 / 16}>
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/40 to-foreground/95 rounded-md" />

                  <div className="absolute inset-0 flex items-end z-10">
                    <div className="text-background px-4">
                      <h3 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </AspectRatio>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
