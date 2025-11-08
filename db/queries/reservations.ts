// db/queries/reservations.ts
import { db, reservationItems, boatPlanPrices } from "@/db";
import { eq } from "drizzle-orm";

export type ReservedDate = {
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
};

/**
 * Obtiene todas las fechas reservadas para un bote específico
 */
export async function getReservedDates(
  boatPlanPriceId: number
): Promise<ReservedDate[]> {
  const reservations = await db.query.reservationItems.findMany({
    where: eq(reservationItems.boatPlanPriceId, boatPlanPriceId),
    columns: {
      startTime: true,
      endTime: true,
    },
  });

  // Convertir timestamps a fechas (YYYY-MM-DD) y agrupar por día
  const dateMap = new Map<string, { startTime: string; endTime: string }[]>();

  reservations.forEach((res) => {
    if (!res.startTime) return;

    const date = new Date(res.startTime).toISOString().split('T')[0]; // YYYY-MM-DD
    const startTime = new Date(res.startTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const endTime = res.endTime
      ? new Date(res.endTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : '';

    if (!dateMap.has(date)) {
      dateMap.set(date, []);
    }
    dateMap.get(date)!.push({ startTime, endTime });
  });

  return Array.from(dateMap.entries()).map(([date, times]) => ({
    date,
    startTime: times[0].startTime,
    endTime: times[0].endTime,
  }));
}

/**
 * Determina si una fecha está disponible considerando reservas y fecha actual
 */
export function isDateAvailable(
  date: Date,
  reservedDates: ReservedDate[]
): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // No permitir fechas anteriores a hoy
  if (date < today) {
    return false;
  }

  // Verificar si está en fechas reservadas
  const dateStr = date.toISOString().split('T')[0];
  return !reservedDates.some((rd) => rd.date === dateStr);
}
