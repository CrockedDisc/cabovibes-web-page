import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import type { ReservationItem as ReservationItemType } from "@/lib/stores/reservation-store";
import { Calendar, Clock, UsersRound, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useReservationStore } from "@/lib/stores/reservation-store";
import { usePathname } from "next/navigation";

function CartItem({ item }: { item: ReservationItemType }) {
  const pathname = usePathname();

  const isOnPaymentPage = pathname === "/checkout/payment";

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
    <Card className="flex flex-col sm:flex-row w-full gap-2 lg:gap-4 py-2">
      <CardHeader className="w-full sm:w-40 p-4 items-center">
        <Link href={`/tours/${item.id}`}>
          <div className="aspect-[4/3] sm:aspect-square relative overflow-hidden rounded-sm">
            {item.boatImage ? (
              <Image
                src={item.boatImage}
                fill
                alt={item.boatName}
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full rounded-sm flex items-center justify-center bg-muted">
                <span className="text-muted-foreground text-xs">No image</span>
              </div>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row sm:justify-between w-full px-6 sm:px-2 lg:px-6 gap-4 sm:gap-0">
        <div className="flex flex-row sm:flex-col gap-2 justify-start sm:justify-center">
          <CardTitle className="text-sm md:text-base">
            {item.boatName}
          </CardTitle>
          <CardDescription className="flex flex-row sm:flex-col gap-2">
            {item.planName}
            <span className="text-sm font-semibold">
              ${item.subtotal.toFixed(2)}
            </span>
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
      <CardFooter className="">
        <Button
          size="icon"
          variant="ghost"
          className="hidden sm:flex"
          onClick={() => removeFromCart(item.id)}
          disabled={isOnPaymentPage}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          className="flex sm:hidden w-full"
          onClick={() => removeFromCart(item.id)}
          disabled={isOnPaymentPage}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CartItem;
