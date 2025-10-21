import { Fish, Sunset, Ship } from "lucide-react";
import type { NavLink, ServiceItem } from "./types";

export const NAV_LINKS: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const SERVICE_ITEMS: ServiceItem[] = [
  {
    href: "/sport-fishing",
    label: "Sport Fishing",
    icon: Fish,
  },
  {
    href: "/sunset-ballena",
    label: "Sunset & Ballena",
    icon: Sunset,
  },
  {
    href: "/yacht-chartering",
    label: "Yacht Chartering",
    icon: Ship,
  },
] as const;
