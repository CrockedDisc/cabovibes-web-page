// app/layout.tsx
import type { Metadata } from "next"
import { inter } from "./fonts"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: {
    default: "Cabovibes | Los Cabos Yacht Tours & Sport Fishing",
    template: "%s | Cabovibes", 
  },
  description:
    "Experience unforgettable adventures in Los Cabos. Premium sport fishing trips, luxury yacht charters, sunset cruises, and whale watching tours. Book your dream vacation today.",
  keywords: [
    "Los Cabos",
    "Cabo San Lucas",
    "sport fishing",
    "yacht charter",
    "sunset cruise",
    "whale watching",
    "boat tours",
    "San José del Cabo",
    "fishing tours Mexico",
    "luxury yacht rental",
  ],
  authors: [{ name: "Cabovibes" }],
  creator: "Cabovibes",
  publisher: "Cabovibes",
  
  metadataBase: new URL("https://www.cabovibes.tours"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-MX": "/es",
    },
  },
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.cabovibes.tours",
    siteName: "Cabovibes",
    title: "Cabovibes | Los Cabos Yacht Tours & Sport Fishing",
    description:
      "Experience unforgettable adventures in Los Cabos with premium sport fishing, yacht charters, and sunset cruises. Book your dream vacation today.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cabovibes - Los Cabos Yacht Tours and Sport Fishing",
      },
      {
        url: "/images/og-image-square.jpg",
        width: 800,
        height: 800,
        alt: "Cabovibes Logo",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Cabovibes | Los Cabos Yacht Tours & Sport Fishing",
    description:
      "Premium sport fishing, yacht charters, and sunset cruises in Los Cabos. Book your adventure today!",
    creator: "@cabovibes",
    images: ["/images/twitter-card.jpg"],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  category: "tourism",
  classification: "Business",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Toaster />
        {children}
      </body>
    </html>
  )
}
