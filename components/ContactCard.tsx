// components/ContactCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { CONTACT_INFO } from "@/constants";

export default function ContactCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-bold">
          Contact Us for Booking
        </CardTitle>
        <CardDescription>
          Yacht Chartering requires personalized assistance. Contact us directly
          to plan your perfect experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Call us</p>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="font-medium hover:underline"
              >
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Email us</p>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="font-medium hover:underline"
              >
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">WhatsApp</p>
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                {CONTACT_INFO.whatsapp}
              </a>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <Button asChild className="w-full" size="lg">
            <a href={`tel:${CONTACT_INFO.phone}`}>
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          </Button>
          <Button asChild variant="outline" className="w-full" size="lg">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
        </div>

        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Available Monday - Sunday
            <br />
            7:00 AM - 10:00 PM MST
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
