// app/api/reservations/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reservations, reservationItems } from "@/db/schema";

// 📧 IMPORTAR RESEND + LA PLANTILLA
import { render } from "@react-email/render";
import { resend } from "@/lib/resend";
import ReservationConfirmation from "@/emails/ReservationConfirmation";

export async function POST(request: NextRequest) {
  try {
    const { paypalOrderId, checkoutData, cartItems } = await request.json();

    if (
      !paypalOrderId ||
      !checkoutData ||
      !cartItems ||
      cartItems.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    const total = cartItems.reduce(
      (sum: number, item: any) => sum + item.subtotal,
      0
    );

    const [reservation] = await db
      .insert(reservations)
      .values({
        guestName: checkoutData.name,
        guestLastname: checkoutData.lastname,
        guestEmail: checkoutData.email,
        guestPhone1: checkoutData.phones[0].phone,
        guestPhone2: checkoutData.phones[1]?.phone || null,
        guestHotel: checkoutData.hotel || null,
        guestHotelReservationName: checkoutData.reservation_number || null,
        guestRoomNumber: checkoutData.room_number || null,
        medicNotes: checkoutData.medic_note || null,
        reservationStatus: "confirmed",
        total: total.toString(),
      })
      .returning();

    const itemsToInsert = cartItems.map((item: any) => {
      // Obtener la fecha seleccionada (sin conversión a UTC)
      const selectedDate = new Date(item.selectedDate);

      // Parsear start_time del slot (formato "06:00:00" o "13:30:00")
      const [startHours, startMinutes, startSeconds = 0] =
        item.timeSlot.startTime.split(":").map(Number);
      const startTime = new Date(selectedDate);
      startTime.setHours(startHours, startMinutes, startSeconds, 0);

      // Parsear end_time del slot (formato "11:30:00" o "19:00:00")
      const [endHours, endMinutes, endSeconds = 0] = item.timeSlot.endTime
        .split(":")
        .map(Number);
      const endTime = new Date(selectedDate);
      endTime.setHours(endHours, endMinutes, endSeconds, 0);

      // ✅ Formatear a timestamp sin zona horaria (timestamp without timezone)
      const formatTimestamp = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      const startTimeFormatted = formatTimestamp(startTime);
      const endTimeFormatted = formatTimestamp(endTime);

      return {
        reservationId: reservation.id,
        boatPlanPriceId: item.boatPlanPriceId,
        serviceTimeSlotId: item.timeSlot.id,
        locationId: item.locationId || 1,
        startTime: startTimeFormatted,
        endTime: endTimeFormatted, // ✅ "2025-11-15 19:00:00"
        pax: item.people,
        subtotal: item.subtotal.toString(),
        notes: item.notes || "",
      };
    });

    await db.insert(reservationItems).values(itemsToInsert);

    try {
      await resend.emails.send({
        from: "booking@confirmation.cabovibes.tours",
        to: [
          reservation.guestEmail, // cliente
          "contact@cabovibes.tours", // tu copia interna (o el correo que quieras)
        ],
        subject: "Your Reservation has been confirmed!🎣✨",
        html: await render(
          ReservationConfirmation({
            name: reservation.guestName,
            reservationId: reservation.id,
            total: total,
            items: cartItems.map((i: any) => ({
              title: i.title,
              people: i.people,
              date: i.selectedDate,
              time: `${i.timeSlot.startTime} - ${i.timeSlot.endTime}`,
            })),
          })
        ),
      });
    } catch (emailError) {
    }

    return NextResponse.json({
      success: true,
      id: reservation.id,
      message: "Reservation created successfully",
      reservation: {
        id: reservation.id,
        guestName: reservation.guestName,
        guestEmail: reservation.guestEmail,
        total: total,
        status: reservation.reservationStatus,
      },
    });
  } catch (error: any) {

    return NextResponse.json(
      {
        error: error.message || "Failed to create reservation",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
