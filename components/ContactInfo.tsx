// components/ContactInfo.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { CONTACT_INFO } from "@/constants/contact";
import { SOCIAL_LINKS } from "@/constants/social-media";
import Instagram from "@/svg/instagram.svg";

export default function ContactInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Contact Methods Card */}
      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Phone</h4>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\D/g, "")}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Email</h4>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors break-all"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">WhatsApp</h4>
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-green-600 transition-colors"
                >
                  {CONTACT_INFO.whatsapp}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Location</h4>
                <p className="text-muted-foreground">{CONTACT_INFO.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp CTA */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Chat with Us</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Get instant answers via WhatsApp. We're available to help you plan your perfect experience.
          </p>
          <Button asChild className="w-full bg-green-600 hover:bg-green-700">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Open WhatsApp
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Instagram className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Follow Us</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Stay updated with our latest tours, tips, and beautiful moments from Los Cabos.
          </p>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <Button
                  key={social.name}
                  asChild
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {social.name}
                  </a>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
