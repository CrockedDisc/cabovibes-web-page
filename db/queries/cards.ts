import { db, boatsMedia, plans, services } from "@/db";
import { CardData } from "@/lib/types/app";
import { eq, and } from "drizzle-orm";

type GetToursParams = {
  planName?: string;
  serviceName?: string;
};

export async function getToursForCards(
  params: GetToursParams = {}
): Promise<CardData[]> {
  const { planName = "Standard", serviceName } = params;

  const tours = await db.query.boats.findMany({
    columns: {
      id: true,
      name: true,
      size: true,
      capacity: true,
      isPopular: true,
      type: true,
    },
    with: {
      media: {
        where: eq(boatsMedia.isFeatured, true),
        limit: 1,
        columns: {
          mediaUrl: true,
        },
      },
      planPrices: {
        columns: {
          basePrice: true,
          duration: true,
        },
        with: {
          plan: {
            columns: {
              name: true,
            },
            with: {
              service: {
                columns: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return tours
    .map((boat) => {
      const targetPlanPrice = boat.planPrices.find((pp) => {
        const matchesPlan = pp.plan?.name === planName;
        const matchesService =
          !serviceName || pp.plan?.service?.name === serviceName;
        return matchesPlan && matchesService;
      });

      if (!targetPlanPrice) {
        return null;
      }

      return {
        id: boat.id,
        name: boat.name,
        size: boat.size,
        capacity: boat.capacity,
        image: boat.media[0]?.mediaUrl ?? null,
        basePrice: targetPlanPrice.basePrice,
        duration: targetPlanPrice.duration,
        isPopular: boat.isPopular,
        type: boat.type,
        planName: targetPlanPrice.plan?.name ?? "Unknown",
        serviceName: targetPlanPrice.plan?.service?.name ?? "Unknown",
      } as CardData;
    })
    .filter((tour): tour is CardData => tour !== null);
}