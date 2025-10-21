import WhatsApp from "@/svg/whatsapp.svg";
import Facebook from "@/svg/facebook.svg";
import Instagram from "@/svg/instagram.svg";
import X from "@/svg/x.svg";
import Mail from "@/svg/mail.svg";
import type { SocialLink } from "./types";
import { CONTACT_INFO } from "./contact";

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Facebook",
    href: "https://facebook.com/cabovibes",
    icon: Facebook,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/cabovibes",
    icon: Instagram,
  },
  {
    name: "X",
    href: "https://x.com/cabovibes",
    icon: X,
  },
] as const;
