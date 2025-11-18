"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TourData } from "@/lib/types/app";
import { fetchReservedDates } from "@/app/actions/reservations";
import { useReservationStore } from "@/lib/stores/reservation-store";
import { v4 as uuidv4 } from "uuid";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "./ui/input";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import PlanComparisonDialog from "./PlanComparisonDialog";

type Props = {
  tourData: TourData;
  tourId: number;
  boatPlanPriceId: number;
};

export default function BookingSidebar({
  tourData,
  tourId,
  boatPlanPriceId,
}: Props) {
  const sortedPlans = useMemo(
    () =>
      tourData.plans.sort(
        (a, b) => parseFloat(a.basePrice) - parseFloat(b.basePrice)
      ),
    [tourData.plans]
  );

  const shouldShowPlanComparison = tourData.serviceName !== "Sunset & Ballena";

  // ✅ CAMBIO: Inicializar selectedPlan con el primer plan
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedPlan, setSelectedPlan] = useState<number>(sortedPlans[0]?.id); // ✅ Inicializar
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number>();
  const [people, setPeople] = useState(tourData.capacity);
  const [reservedDates, setReservedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addToCart = useReservationStore((state) => state.addToCart);
  const removeFromCart = useReservationStore((state) => state.removeFromCart);

  // ✅ CAMBIO: Actualizar el useEffect
  useEffect(() => {
    async function loadReservedDates() {
      if (!selectedPlan) {
        setLoading(false); // ✅ Importante: setear loading = false si no hay plan
        return;
      }

      setLoading(true);
      try {
        const dates = await fetchReservedDates(selectedPlan);
        setReservedDates(dates.map((d) => d.date));
      } catch (error) {
        console.error("❌ Error loading reserved dates:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReservedDates();
  }, [selectedPlan]);

  // ✅ Obtenemos datos derivados
  const currentPlan = tourData.plans.find((p) => p.id === selectedPlan);
  const currentTimeSlot = tourData.timeSlots.find(
    (t) => t.id === selectedTimeSlot
  );

  // ✅ Cálculos
  const extraPeople = Math.max(0, people - (currentPlan?.freePax || 0));
  const subtotal =
    parseFloat(currentPlan?.basePrice || "0") +
    extraPeople * parseFloat(currentPlan?.pricePerPerson || "0");

  // ✅ Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setPeople(Math.max(1, Math.min(tourData.capacity, value)));
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    const dateStr = date.toISOString().split("T")[0];
    return reservedDates.includes(dateStr);
  };

  const handleAddToCart = () => {
    if (!selectedDate || !selectedPlan || !selectedTimeSlot) {
      toast.error("Please select all required fields", {
        position: "top-center",
        description: "Make sure to pick a date, plan, and time slot",
        descriptionClassName: "!text-secondary-foreground/60",
      });
      return;
    }

    // ✅ Obtener items actuales del carrito
    const currentItems = useReservationStore.getState().items;

    // ✅ Validar si ya existe el mismo tour con fecha, plan y hora
    const isDuplicate = currentItems.some((cartItem) => {
      const isSameBoat = cartItem.boatId === tourId;
      const isSameDate =
        new Date(cartItem.selectedDate).toDateString() ===
        selectedDate.toDateString();
      const isSameTime = cartItem.timeSlot.id === selectedTimeSlot;
      return isSameBoat && isSameDate && isSameTime;
    });

    // ✅ Si es duplicado, mostrar error
    if (isDuplicate) {
      toast.error("This tour is already in your cart", {
        position: "top-center",
        description:
          "You can't book the same tour twice for the same date and time",
        descriptionClassName: "!text-secondary-foreground/60",
      });
      return;
    }

    const item = {
      id: uuidv4(),
      boatId: tourId,
      boatPlanPriceId,
      boatName: tourData.name,
      boatImage: tourData.media[0] || null,
      planName: currentPlan?.planName || "Unknown",
      selectedDate,
      timeSlot: currentTimeSlot!,
      people,
      freePax: currentPlan?.freePax || 0,
      basePrice: parseFloat(currentPlan?.basePrice || "0"),
      pricePerPerson: parseFloat(currentPlan?.pricePerPerson || "0"),
      subtotal,
      locationId: 1, // ✅ AGREGADO - Por defecto location ID 1 (puedes hacerlo dinámico después)
      notes: "", // ✅ AGREGADO - Notas vacías por defecto
    };

    addToCart(item);

    toast.success("Item added to cart", {
      position: "top-center",
      className: "justify-between",
      action: {
        label: "Undo",
        onClick: () => removeFromCart(item.id),
        actionButtonStyle: {
          borderRadius: "24px !important",
        },
      },
    });
  };

  // ✅ Loading state
  if (loading) {
    return (
      <Card className="sticky top-20">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="flex flex-col gap-4 w-full">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold">
            Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row lg:flex-col gap-4">
          <div className="flex flex-col gap-2 md:gap-4 w-full">
            <h3 className="text-base md:text-lg font-semibold">Pick a Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              className="w-full"
            />
            <div className="flex flex-col gap-2 md:gap-4">
              <Select
                value={selectedTimeSlot?.toString()}
                onValueChange={(value) => setSelectedTimeSlot(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a schedule" />
                </SelectTrigger>
                <SelectContent>
                  {tourData.timeSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id.toString()}>
                      {slot.startTime} - {slot.endTime}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-semibold">
                  Select a Plan
                </h3>
                {shouldShowPlanComparison && (
                  <PlanComparisonDialog plans={tourData.plans} />
                )}
              </div>

              <RadioGroup
                value={selectedPlan?.toString()}
                onValueChange={(val) => setSelectedPlan(parseInt(val))}
                defaultValue={tourData.plans[0].id.toString()}
              >
                {sortedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={cn(
                      "relative flex items-center cursor-pointer border p-4 transition-colors rounded-md",
                      selectedPlan === plan.id
                        ? "border-primary"
                        : "border-muted"
                    )}
                  >
                    <RadioGroupItem
                      value={plan.id.toString()}
                      id={`plan-${plan.id}`}
                      className="opacity-0 absolute"
                    />
                    <Label
                      htmlFor={`plan-${plan.id}`}
                      className="flex flex-1 items-center gap-2 cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{plan.planName}</span>
                        <span className="text-sm text-muted-foreground">
                          ${plan.basePrice}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-2 md:gap-4">
              <h3 className="text-base md:text-lg font-semibold">
                How Many People?
              </h3>
              <ButtonGroup className="flex items-center w-full">
                <Input
                  type="number"
                  value={people}
                  onChange={handleInputChange}
                  min="1"
                  max={tourData.capacity}
                  className="w-20 text-center font-medium"
                  placeholder="0"
                  disabled
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPeople(Math.max(1, people - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setPeople(Math.min(tourData.capacity, people + 1))
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </ButtonGroup>
            </div>
            <div className="flex flex-col gap-2 md:gap-4">
              {currentPlan && (
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm md:text-base">Base Price</span>
                    <span className="text-sm md:text-base">
                      ${currentPlan.basePrice}
                    </span>
                  </div>
                  {extraPeople > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm md:text-base">
                        Extra People ({extraPeople})
                      </span>
                      <span className="text-sm md:text-base">
                        $
                        {(
                          extraPeople *
                          parseFloat(currentPlan.pricePerPerson || "0")
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm md:text-base font-medium">
                      Subtotal
                    </span>
                    <span className="text-sm md:text-base font-medium">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="w-full"
            size="lg"
            onClick={handleAddToCart}
            disabled={!selectedDate || !selectedPlan || !selectedTimeSlot}
          >
            Add To Cart
            <ShoppingBag />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
