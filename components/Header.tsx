import React from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";

function Header({
  ratio,
  image,
  ariaLabel,
  title,
  description,
}: {
  ratio: number;
  image: string;
  ariaLabel: string;
  title: string;
  description: string;
}) {
  return (
    <header className="relative" aria-labelledby={ariaLabel}>
      <AspectRatio ratio={ratio}>
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover rounded-md"
          priority
        />
      </AspectRatio>
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70 rounded-md" />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-background px-4">
          <h1
            id={ariaLabel}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 md:mb-4"
          >
            {title}
          </h1>
          <p className="text-sm sm:text-xl md:text-2xl lg:text-3xl">
            {description}
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
