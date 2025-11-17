// app/order-confirmation/[id]/page.tsx
import { db } from "@/db";
import { reservations, reservationItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;

  // ✅ Obtener la reserva de la base de datos
  const [reservation] = await db
    .select()
    .from(reservations)
    .where(eq(reservations.id, parseInt(id)))
    .limit(1);

  if (!reservation) {
    return notFound();
  }

  // ✅ Obtener los items de la reserva
  const items = await db
    .select()
    .from(reservationItems)
    .where(eq(reservationItems.reservationId, parseInt(id)));

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Reservation Confirmed!
          </CardTitle>
          <CardDescription className="text-lg">
            Thank you for your booking. Your reservation has been confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información de la reserva */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Reservation Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Reservation ID
                </p>
                <p className="font-medium">#{reservation.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">
                  {reservation.reservationStatus}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Guest Name</p>
                <p className="font-medium">
                  {reservation.guestName} {reservation.guestLastname}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{reservation.guestEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{reservation.guestPhone1}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-medium text-lg">
                  ${parseFloat(reservation.total || "0").toFixed(2)} USD
                </p>
              </div>
            </div>
          </div>

          {/* Items de la reserva */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Booked Tours</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Tour #{item.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.startTime!).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.startTime!).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(item.endTime!).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${parseFloat(item.subtotal).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.pax} {item.pax === 1 ? "person" : "people"}
                      </p>
                    </div>
                  </div>
                  {item.notes && (
                    <p className="text-sm text-muted-foreground italic">
                      Note: {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Información del hotel (si existe) */}
          {reservation.guestHotel && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Hotel Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hotel Name</p>
                  <p className="font-medium">{reservation.guestHotel}</p>
                </div>
                {reservation.guestRoomNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Room Number
                    </p>
                    <p className="font-medium">
                      {reservation.guestRoomNumber}
                    </p>
                  </div>
                )}
                {reservation.guestHotelReservationName && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">
                      Reservation Name
                    </p>
                    <p className="font-medium">
                      {reservation.guestHotelReservationName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notas médicas (si existen) */}
          {reservation.medicNotes && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Medical Notes</h3>
              <p className="text-sm text-muted-foreground">
                {reservation.medicNotes}
              </p>
            </div>
          )}

          {/* Email de confirmación */}
          <div className="border-t pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to{" "}
              <span className="font-medium">{reservation.guestEmail}</span>
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild>
              <Link href="/sport-fishing">Book Another Tour</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
