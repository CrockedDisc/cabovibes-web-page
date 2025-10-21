import type { Service } from "./types";

export const SERVICES: Service[] = [
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
] as const;
