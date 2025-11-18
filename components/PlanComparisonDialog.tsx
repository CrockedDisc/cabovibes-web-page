"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { HelpCircle, Check, X } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

type PlanComparisonPopoverProps = {
  plans: Array<{
    id: number;
    planName: string;
    planDescription: string;
    basePrice: string;
    freePax: number;
    pricePerPerson: string | null;
    duration: string;
    amenities: Array<{
      id: number;
      name: string;
      isIncluded: boolean;
    }>;
  }>;
};

export default function PlanComparisonDialog({
  plans,
}: PlanComparisonPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  // ✅ Función para determinar las clases de grid según número de planes
  const getGridCols = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1 max-w-md mx-auto";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  // ✅ Componente compartido para el contenido
  const PlansGrid = () => (
    <div className={`grid gap-4 md:gap-6 ${getGridCols(plans.length)}`}>
      {plans.map((plan) => (
        <HoverCard key={plan.id}>
          <HoverCardTrigger asChild>
            <div className="border rounded-lg p-4 shadow-sm bg-card flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer">
              {/* Header */}
              <h4 className="text-lg font-semibold text-center">
                {plan.planName}
              </h4>

              {/* Price */}
              <p className="text-2xl font-bold text-center text-primary">
                ${plan.basePrice}
              </p>

              {/* Amenities */}
              <div className="flex flex-col gap-2 mt-2 text-sm border-t pt-3">
                {plan.amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="flex-1 text-left line-clamp-2">
                      {amenity.name}
                    </span>
                    {amenity.isIncluded ? (
                      <Check className="text-green-600 w-4 h-4 flex-shrink-0" />
                    ) : (
                      <X className="text-gray-400 w-4 h-4 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </HoverCardTrigger>

          <HoverCardContent className="w-60">
            <div className="space-y-2">
              <h5 className="text-sm font-semibold">{plan.planName}</h5>
              <div className="text-xs text-muted-foreground">
                <MarkdownRenderer content={plan.planDescription || ""} />
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );

  return (
    <>
      {/* ✅ UN SOLO BOTÓN que controla el estado */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-1 rounded-full hover:bg-muted transition-colors"
        aria-label="Compare plans"
      >
        <HelpCircle className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* ✅ Dialog para Desktop (sin trigger) */}
      <Dialog open={isOpen && isDesktop} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto lg:min-w-[1024px]">
          <DialogHeader>
            <DialogTitle>Our Plans</DialogTitle>
          </DialogHeader>
          <PlansGrid />
        </DialogContent>
      </Dialog>

      {/* ✅ Drawer para Mobile (sin trigger) */}
      <Drawer open={isOpen && !isDesktop} onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Our Plans</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-4">
            <PlansGrid />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
