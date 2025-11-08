import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import type { ReservationItem as ReservationItemType } from "@/lib/stores/reservation-store";
import { Calendar, Clock, UsersRound, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useReservationStore } from "@/lib/stores/reservation-store";

function CartItem({ item }: { item: ReservationItemType }) {
  const removeFromCart = useReservationStore((state) => state.removeFromCart);

  const formattedDate = new Date(item.selectedDate).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Card className="flex flex-row w-full gap-2 lg:gap-4 py-2">
      <CardHeader className="w-40 p-4 items-center">
        <Link href={`/tours/${item.id}`}>
          <AspectRatio ratio={1 / 1} className="relative overflow-hidden rounded-sm">
            {item.boatImage ? (
              <Image
                src={item.boatImage}
                fill
                alt={item.boatName}
                className="object-cover"
                priority
              />
            ) : (
              <div className="aspect-square w-full rounded-sm flex items-center justify-center bg-muted">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </AspectRatio>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row justify-between w-full px-2 lg:px-6">
        <div className="flex flex-col gap-2 justify-center">
          <CardTitle className="text-sm md:text-base">{item.boatName}</CardTitle>
          <CardDescription className="flex flex-row sm:flex-col gap-2">
            {item.planName}
            <span className="text-sm font-semibold">${item.subtotal.toFixed(2)}</span>
          </CardDescription>
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <span className="flex flex-row items-center gap-2 font-normal text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" /> {formattedDate}
          </span>
          <span className="flex flex-row items-center gap-2 font-normal text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /> {item.timeSlot.name}
          </span>
          <span className="flex flex-row items-center gap-2 font-normal text-sm text-muted-foreground">
            <UsersRound className="h-4 w-4" /> {item.people}{" "}
            {item.people === 1 ? "person" : "people"}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => removeFromCart(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CartItem;
