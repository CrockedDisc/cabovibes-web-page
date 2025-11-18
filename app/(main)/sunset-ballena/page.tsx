import React from "react";
import { getToursForCards } from "@/db/queries/cards";
import { PLAN_GROUPS } from "@/constants/plans";
import Header from "@/components/Header";
import { CardData } from "@/lib/types/app";
import TourCard from "@/components/TourCard";

async function page() {
  const tours: CardData[] = await getToursForCards({
    planNames: ["Sunset & Ballena"],
    serviceName: "Sunset & Ballena",
  });
  return (
    <>
      <Header
        ratio={16 / 9}
        image="/images/what-are-you-interested-in/sunset-ballena.jpg"
        ariaLabel="Sunset & Ballena"
        title="Sunset & Ballena"
        description="Experience an unforgettable Los Cabos sunset as you cruise along the coast with golden skies and views of the Arch. A perfect moment to relax, take photos, and enjoy the unique Pacific atmosphere."
      />
      <section>
        <h2 className="text-xl sm:text-3xl md:text-5xl font-bold">Our Fleet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tours.map((tour) => (
            <div key={tour.id} className="flex flex-col col-span-1">
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default page;
