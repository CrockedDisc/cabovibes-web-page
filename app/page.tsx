"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

import Image from "next/image";
import Link from "next/link";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { Compass, Book, PhoneOutgoing } from "lucide-react";

import { REASONS, FAQS } from "@/constants";
import { SERVICES } from "@/constants";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 768px)") ?? false;

  return (
    <>
      <header className="relative" aria-labelledby="hero-title">
        <AspectRatio ratio={16 / 9}>
          <video
            src="/videos/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/hero.jpg"
            className="object-cover rounded-md"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70 rounded-md" />

          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center text-background px-4">
              <h1
                id="hero-title"
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 md:mb-4"
              >
                Experience the Magic of Los Cabos
              </h1>
              <p className="text-sm sm:text-xl md:text-2xl lg:text-3xl">
                Sport fishing trips and unforgettable nights on a yacht—let us
                plan every detail for you
              </p>
              <Link href="#services">
                <Button
                  variant="outline"
                  className="mt-2 sm:mt-4 md:mt-6 text-foreground"
                >
                  <Compass />
                  Explore Tours
                </Button>
              </Link>
            </div>
          </div>
        </AspectRatio>
      </header>

      <section className="flex w-full" aria-labelledby="why-choose-us">
        <div className="grid grid-cols-3 md:grid-cols-5 auto-rows-fr gap-4 w-full">
          <div className="col-span-3 md:col-span-3">
            <h2
              id="why-choose-us"
              className="text-xl sm:text-3xl md:text-5xl font-bold rounded-md p-4 bg-muted h-full flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
            >
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
                priority
              />
            </AspectRatio>
          </div>
          {REASONS.map((items, index) => {
            const Icon = items.icon;
            return (
              <div
                key={index}
                className="col-span-1 rounded-md p-4 bg-muted hover:bg-foreground hover:text-background transition-colors flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon />
                  <h4 className="text-sm min-[884px]:text-base min-[1045px]:text-lg font-bold text-center">
                    {items.title}
                  </h4>
                  <p className="text-xs min-[884px]:text-sm min-[1045px]:text-base text-center">
                    {items.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="services"
        className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-foreground text-background"
        aria-labelledby="services-header"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-16 py-8">
          <h2
            id="services-header"
            className="text-xl sm:text-3xl md:text-5xl font-bold"
          >
            What Are You Interested In?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {SERVICES.map((service, index) => (
              <Link
                key={index}
                href={service.link}
                className="col-span-1 block group"
                aria-label={service.title}
              >
                <AspectRatio ratio={isMobile ? 1 : 9 / 16}>
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover rounded-md transition-transform duration-300 group-hover:scale-102"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/40 to-foreground/95 rounded-md transition-transform duration-300 group-hover:opacity-90 group-hover:scale-102" />

                  <div className="absolute inset-0 flex items-end z-10">
                    <div className="text-background px-4 transition-transform duration-300 group-hover:translate-y-[-4px]">
                      <h3 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </AspectRatio>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="flex w-full" aria-labelledby="faq">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="col-span-1 flex items-center">
            <h2 id="faq" className="text-xl sm:text-3xl md:text-5xl font-bold">
              Take a Look To Our FAQ&apos;s
            </h2>
          </div>
          <div className="col-span-1 min-w-0">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="item-1"
            >
              {FAQS.map((item, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      <section className="relative flex w-full" aria-labelledby="cta">
        <AspectRatio ratio={36 / 9}>
          <Image
            src="/images/cta/cta.png"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-md"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70 rounded-md" />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-left text-background px-2 sm:px-4 flex flex-row items-center justify-between w-full">
              <h2
                id="cta"
                className="text-lg sm:text-3xl md:text-5xl font-bold"
              >
                Discover Your Dream Vacation
              </h2>
              <div className="flex flex-row gap-4 px-2">
                <Button className="hidden sm:flex">
                  <Book />
                  Book Now
                </Button>
                <Button className="hidden sm:flex">
                  <PhoneOutgoing />
                  Call Us
                </Button>
                <Button className="flex sm:hidden" size="icon">
                  <Book />
                </Button>
                <Button className="flex sm:hidden" size="icon">
                  <PhoneOutgoing />
                </Button>
              </div>
            </div>
          </div>
        </AspectRatio>
      </section>
    </>
  );
}
