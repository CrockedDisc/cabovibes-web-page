// db/queries/tour-complete.ts
import { db, boats, boatsMedia } from "@/db";
import { eq, and} from "drizzle-orm";
import { TourData } from "@/lib/types/app";


export async function getTourDetails(
  tourId: number,
  serviceName: string
): Promise<TourData | null> {
  // 1. Obtener datos del bote con todas las relaciones
  const tour = await db.query.boats.findFirst({
        where: and(
      eq(boats.id, tourId),
      eq(boats.isActive, true)  // ✅ Solo si está activo
    ),
    columns: {
      id: true,
      name: true,
      size: true,
      capacity: true,
      features: true,
      type: true,
      isActive: true,
    },
    with: {
      // Media
      media: {
        where: eq(boatsMedia.mediaType, "image"),
        columns: {
          mediaUrl: true,
        },
      },
      // Locations
      departures: {
        with: {
          location: {
            columns: {
              name: true,
            },
          },
        },
      },
      // Plan Prices con amenities
      planPrices: {
        columns: {
          id: true,
          basePrice: true,
          freePax: true,
          pricePerPerson: true,
          duration: true,
        },
        with: {
          plan: {
            columns: {
              name: true,
              description: true,
            },
            with: {
              service: {
                columns: {
                  id: true,
                  name: true,
                  description: true,
                },
                with: {
                  // ✅ Time slots del servicio
                  timeSlots: {
                    columns: {
                      id: true,
                      name: true,
                      startTime: true,
                      endTime: true,
                    },
                  },
                },
              },
            },
          },
          // ✅ Amenities del plan
          planAmenities: {
            columns: {
              isIncluded: true,
            },
            with: {
              amenity: {
                columns: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!tour) return null;

  // Filtrar planes que pertenecen al servicio especificado
  const servicePlans = tour.planPrices.filter(
    (pp) => pp.plan?.service?.name === serviceName
  );

  // Obtener time slots (son los mismos para todos los planes del servicio)
  const timeSlots =
    servicePlans[0]?.plan?.service?.timeSlots.map((ts) => ({
      id: ts.id,
      name: ts.name,
      startTime: ts.startTime,
      endTime: ts.endTime,
    })) ?? [];

  return {
    id: tour.id,
    name: tour.name,
    size: tour.size,
    capacity: tour.capacity,
    features: tour.features,
    type: tour.type,
    media: tour.media.map((m) => m.mediaUrl),
    locations: tour.departures.map((d) => d.location.name),
    itinerary: servicePlans[0]?.plan?.service?.description ?? "",
    plans: servicePlans.map((pp) => ({
      id: pp.id,
      planName: pp.plan?.name ?? "Unknown",
      planDescription: pp.plan?.description ?? "",
      basePrice: pp.basePrice,
      freePax: pp.freePax,
      pricePerPerson: pp.pricePerPerson,
      duration: pp.duration,
      amenities: pp.planAmenities.map((a) => ({
        id: a.amenity.id,
        name: a.amenity.name,
        isIncluded: a.isIncluded,
      })),
    })),
    timeSlots,
    
  };
}
