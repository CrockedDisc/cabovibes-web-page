// constants/social-media.ts
import WhatsApp from "@/svg/whatsapp.svg";
import Instagram from "@/svg/instagram.svg";
import type { SocialLink } from "./types";

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "WhatsApp",
    href: "https://wa.me/526241668815", // Sin espacios ni paréntesis
    icon: WhatsApp,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/cabovibes",
    icon: Instagram,
  },
] as const;
