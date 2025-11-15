"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
import { Badge } from "./ui/badge";
import { useReservationStore } from "@/lib/stores/reservation-store";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Separator } from "./ui/separator";
import { Toggle } from "./ui/toggle";

import { ArrowUpRight, ShoppingCart, Globe, Menu } from "lucide-react";

import { SERVICE_ITEMS, NAV_LINKS } from "@/constants";
import CartItem from "./CartItem";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // ✅ Estado compartido del carrito
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const cartItems = useReservationStore((state) => state.items);
  const pathname = usePathname();

  const isOnPaymentPage = pathname === "/checkout/payment";

  // ✅ Cerrar menú cuando se agranda la pantalla
  useEffect(() => {
    if (isDesktop && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isDesktop, isMenuOpen]);

  // ✅ NO cerrar el carrito automáticamente
  // Solo cambiar entre Dialog y Drawer según el tamaño

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  // ✅ Contenido del carrito (reutilizable)
  const CartContent = () => (
    <>
      <div className="flex flex-col gap-4 overflow-y-auto p-4 max-h-[60vh]">
        <div className="flex flex-col gap-2">
          {cartItems.length > 0 ? (
            cartItems.map((item) => <CartItem key={item.id} item={item} />)
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Your cart is empty
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row justify-between items-center border-t p-4">
        <span className="text-sm font-semibold">
          Total: $
          {cartItems
            .reduce((total, item) => total + item.subtotal, 0)
            .toFixed(2)}{" "}
          USD
        </span>
        <Button
          asChild={!isOnPaymentPage} // ✅ Solo usar asChild si NO estamos en payment
          onClick={handleCloseCart}
          disabled={cartItems.length === 0 || isOnPaymentPage} // ✅ Deshabilitar en payment
        >
          {isOnPaymentPage ? (
            // ✅ Si estamos en payment, renderiza botón normal (sin Link)
            <>
              Go to Checkout
              <ArrowUpRight className="h-4 w-4" />
            </>
          ) : (
            // ✅ Si NO estamos en payment, renderiza con Link
            <Link href="/checkout/payment">
              Go to Checkout
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </Button>
      </div>
    </>
  );

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 p-4 bg-background border-b"
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
          {/* Services Dropdown */}
          <NavigationMenuItem className="hidden md:block">
            <NavigationMenuTrigger>Services</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-max p-4">
                {SERVICE_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="flex flex-row items-center gap-2 p-2 hover:bg-muted rounded-md"
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

          {/* Language Toggle */}
          <NavigationMenuItem className="hidden md:block">
            <Toggle disabled aria-label="Change language">
              <Globe aria-hidden="true" />
            </Toggle>
          </NavigationMenuItem>

          {/* ✅ Cart Dialog (Desktop) */}
          <NavigationMenuItem className="hidden md:block">
            <Dialog open={isCartOpen && isDesktop} onOpenChange={setIsCartOpen}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  aria-label="View shopping cart"
                  className="relative"
                >
                  <ShoppingCart aria-hidden="true" />
                  {cartItems.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1/6 -right-1/6 border border-muted-foreground"
                    >
                      {cartItems.length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="lg:max-w-[768px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Shopping Cart</DialogTitle>
                </DialogHeader>
                <CartContent />
              </DialogContent>
            </Dialog>
          </NavigationMenuItem>

          {/* ✅ Cart Drawer (Mobile) - Standalone */}
          <NavigationMenuItem className="flex md:hidden">
            <Drawer open={isCartOpen && isMobile} onOpenChange={setIsCartOpen}>
              <DrawerTrigger asChild>
                <Button
                  size="icon"
                  aria-label="View shopping cart"
                  className="relative"
                >
                  <ShoppingCart aria-hidden="true" />
                  {cartItems.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1/6 -right-1/6 border border-muted-foreground"
                    >
                      {cartItems.length}
                    </Badge>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Shopping Cart</DrawerTitle>
                </DrawerHeader>
                <CartContent />
              </DrawerContent>
            </Drawer>
          </NavigationMenuItem>

          {/* ✅ Menu Sheet (Mobile) */}
          <NavigationMenuItem>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
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
                        <Link
                          href={item.href}
                          className="flex flex-row items-center gap-2 text-lg p-2 hover:bg-muted rounded-md"
                          onClick={handleLinkClick}
                        >
                          <Icon aria-hidden="true" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Separator className="my-4" />
                  </li>
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex flex-row items-center gap-2 text-lg p-2 hover:bg-muted rounded-md"
                        onClick={handleLinkClick}
                      >
                        {link.label}
                      </Link>
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
