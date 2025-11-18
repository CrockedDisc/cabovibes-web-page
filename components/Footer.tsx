"use client";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { SOCIAL_LINKS } from "@/constants";
import { CONTACT_INFO } from "@/constants";
import { SERVICE_ITEMS } from "@/constants";
import WhatsApp from "@/svg/whatsapp.svg";

function Footer() {
  return (
    <footer className="px-4 md:px-8 lg:px-16 pb-4 pt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 rounded-md p-6 bg-muted">
        <div className="col-span-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Contact Us</h2>
          <Link href="" className="flex gap-2 items-center">
            <WhatsApp className="text-foreground size-4" />
            <Button variant="link" className="p-0 h-max text-md font-normal">
              {CONTACT_INFO.phone}
            </Button>
          </Link>
          <Link href="" className="flex gap-2 items-center">
            <Mail className="text-foreground size-4" />
            <Button variant="link" className="p-0 h-max text-md font-normal">
              {CONTACT_INFO.email}
            </Button>
          </Link>
          <div className="flex gap-2 items-center">
            {SOCIAL_LINKS.map((link) => (
              <Link key={link.name} href={link.href}>
                <link.icon className="text-foreground size-6" />
              </Link>
            ))}
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Services</h2>
          <ul className="flex flex-col gap-4">
            {SERVICE_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant="link"
                    className="p-0 h-max text-md font-normal"
                  >
                    {item.label}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold">About</h2>
          <ul className="flex flex-col gap-4">
            <li>
              <Link href="/about">
                <Button
                  variant="link"
                  className="p-0 h-max text-md font-normal"
                >
                  About
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <Button
                  variant="link"
                  className="p-0 h-max text-md font-normal"
                >
                  Contact
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/gallery">
                <Button
                  variant="link"
                  className="p-0 h-max text-md font-normal"
                >
                  Gallery
                </Button>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Location</h2>
          <ul className="flex flex-col gap-4">
            <li>
              <Link
                href="https://maps.app.goo.gl/rQSoprNQ2r9v8m2S7"
                target="_blank"
              >
                <Button
                  variant="link"
                  className="p-0 h-max text-md font-normal"
                >
                  <MapPin className="text-foreground size-4" />
                  {CONTACT_INFO.address}
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div></div>
    </footer>
  );
}

export default Footer;
