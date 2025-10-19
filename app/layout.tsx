import type { Metadata } from "next";
import { inter } from "./fonts";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Cabovibes",
  description: "A web page for Cabovibes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Navbar />
        <main className="pt-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto space-y-24">
          {children}
        </main>
      </body>
    </html>
  );
}