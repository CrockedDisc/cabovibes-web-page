import { LucideIcon } from "lucide-react";
import { FC, SVGProps } from "react";

export interface NavLink {
  href: string;
  label: string;
}

export interface ServiceItem extends NavLink {
  icon: LucideIcon;
}

export interface Service {
  title: string;
  image: string;
  link: string;
  alt: string;
}

export interface Reason {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: FC<SVGProps<SVGSVGElement>>;
}
