"use client";

import { useState, useEffect } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

import Link from "next/link";
import Image from "next/image";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuContent,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Toggle } from "./ui/toggle";

import { Search, ShoppingCart, Globe, Menu } from "lucide-react";

import { SERVICE_ITEMS, NAV_LINKS } from "@/constants";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 p-4 bg-background"
    >
      {/* Logo */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/" className="flex flex-row items-center gap-2">
                <div className="h-4 w-4">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <span className="font-medium">Cabovibes</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Navigation Links */}
      <NavigationMenu viewport={false}>
        <NavigationMenuList className="gap-2">
          <NavigationMenuItem>
            {/* Search Bar */}
            <InputGroup className="flex-1">
              <InputGroupInput placeholder="Search..." aria-label="Search" />
              <InputGroupAddon>
                <Search aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton aria-label="Submit search">
                  Search
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </NavigationMenuItem>
          {/* Tours Dropdown */}
          <NavigationMenuItem className="hidden md:block">
            <NavigationMenuTrigger>Services</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-max">
                {SERVICE_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="flex flex-row items-center gap-2"
                        >
                          <Icon aria-hidden="true" />
                          <span>{item.label}</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  );
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* About & Contact Links */}
          {NAV_LINKS.map((link) => (
            <NavigationMenuItem key={link.href} className="hidden md:block">
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href={link.href}>{link.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          {/* Divider */}
          <NavigationMenuItem className="hidden md:block">
            <div className="h-[1.4375rem] w-0.5 rounded-full bg-muted" />
          </NavigationMenuItem>

          {/* Action Buttons */}
          <NavigationMenuItem className="hidden md:block">
            <Toggle disabled aria-label="Change language">
              <Globe aria-hidden="true" />
            </Toggle>
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden md:block">
            <Button size="icon" aria-label="View shopping cart">
              <ShoppingCart aria-hidden="true" />
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex md:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-2">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <ul className="mt-8 space-y-4">
                  {SERVICE_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="flex flex-row items-center gap-2 text-lg"
                            onClick={handleLinkClick}
                          >
                            <Icon aria-hidden="true" />
                            <span>{item.label}</span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    );
                  })}
                  <li>
                    <Separator className="my-4" />
                  </li>
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={link.href}
                          className="flex flex-row items-center gap-2 text-lg"
                          onClick={handleLinkClick}
                        >
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li>
                    <Separator className="my-4" />
                  </li>
                  <li>
                    <Toggle
                      disabled
                      aria-label="Change language"
                      className="w-full justify-start"
                    >
                      <Globe aria-hidden="true" />
                      Change Language
                    </Toggle>
                  </li>
                  <li>
                    <Button
                      className="w-full justify-start"
                      aria-label="View shopping cart"
                    >
                      <ShoppingCart aria-hidden="true" />
                      My Cart
                    </Button>
                  </li>
                </ul>
              </SheetContent>
            </Sheet>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

export default Navbar;
