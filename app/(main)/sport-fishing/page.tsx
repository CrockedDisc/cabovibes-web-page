import React from "react";
import { MoveHorizontal } from "lucide-react";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getToursForCards } from "@/db/queries/cards";
import TourCard from "@/components/TourCard";
import { CardData } from "@/lib/types/app";
import { BOAT_TYPE_TABS } from "@/constants/boats";
import { PLAN_GROUPS } from "@/constants/plans";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

type TabKey = keyof typeof BOAT_TYPE_TABS;

const TAB_CONFIG: Array<{
  id: TabKey;
  label: string;
}> = [
  { id: "VIKINGS_SPORT_FISHERS", label: "Vikings & Sport Fishers" },
  { id: "SUPERPANGAS", label: "Superpangas" },
  { id: "SPORT_FISHING_BOATS", label: "Sport Fishing Boats" },
];

async function page() {
  const tours: CardData[] = await getToursForCards({
    planNames: PLAN_GROUPS.BASE_PLANS,
    serviceName: "Sport Fishing",
  });
  return (
    <>
      <Header
        ratio={16 / 9}
        image="/images/what-are-you-interested-in/sport-fishing.jpg"
        ariaLabel="Sport fishing"
        title="Sport Fishing"
        description="Enjoy sport fishing in Los Cabos with expert captains, pro-grade gear, and the thrill of catching marlin or dorado."
      />
      <section className="hidden sm:flex w-full flex-col">
        <Tabs
          defaultValue="popular"
          className="w-full items-center justify-center gap-4"
        >
          <TabsList>
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
            {TAB_CONFIG.map(({ id, label }) => (
              <TabsTrigger key={id} value={id}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="popular" className="w-full">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="p-1">
                {tours
                  .filter((tour) => tour.isPopular)
                  .map((tour) => (
                    <CarouselItem
                      key={tour.id}
                      className="basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <TourCard tour={tour} />
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:flex" />
              <CarouselNext className="hidden lg:flex" />
            </Carousel>
          </TabsContent>
          {TAB_CONFIG.map(({ id }) => (
            <TabsContent key={id} value={id} className="w-full">
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent className="p-1">
                  {tours
                    .filter((tour) =>
                      (BOAT_TYPE_TABS[id] as readonly string[]).includes(
                        tour.type
                      )
                    )
                    .map((tour) => (
                      <CarouselItem
                        key={tour.id}
                        className="basis-1/2 md:basis-1/3 lg:basis-1/4"
                      >
                        <TourCard tour={tour} />
                      </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:flex" />
                <CarouselNext className="hidden lg:flex" />
              </Carousel>
            </TabsContent>
          ))}
        </Tabs>
        <span className="text-muted-foreground text-xs">
          <MoveHorizontal className="h-4 w-4" />
          Swipe to see more
        </span>
      </section>
      <section className="flex flex-col sm:hidden w-full gap-4">
        <h2 className="text-xl font-bold">Most Popular</h2>
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="p-1">
            {tours
              .filter((tour) => tour.isPopular)
              .map((tour) => (
                <CarouselItem key={tour.id}>
                  <TourCard tour={tour} />
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
        <span className="text-muted-foreground text-xs">
          <MoveHorizontal className="h-4 w-4" />
          Swipe to see more
        </span>
      </section>
      <section className="flex flex-col sm:hidden w-full gap-4">
        <h2 className="text-xl font-bold">Vikings & Sport Fishers</h2>
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="p-1">
            {tours
              .filter(
                (tour) => tour.type === "Viking" || tour.type === "Sport Fisher"
              )
              .map((tour) => (
                <CarouselItem key={tour.id}>
                  <TourCard tour={tour} />
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
        <span className="text-muted-foreground text-xs">
          <MoveHorizontal className="h-4 w-4" />
          Swipe to see more
        </span>
      </section>
      <section className="flex flex-col sm:hidden w-full gap-4">
        <h2 className="text-xl font-bold">Superpangas</h2>
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="p-1">
            {tours
              .filter((tour) => tour.type === "Superpanga")
              .map((tour) => (
                <CarouselItem key={tour.id}>
                  <TourCard tour={tour} />
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
        <span className="text-muted-foreground text-xs">
          <MoveHorizontal className="h-4 w-4" />
          Swipe to see more
        </span>
      </section>
      <section className="flex flex-col sm:hidden w-full gap-4">
        <h2 className="text-xl font-bold">Sport Fishing Boats</h2>
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="p-1">
            {tours
              .filter((tour) => tour.type === "Sport Fishing Boat")
              .map((tour) => (
                <CarouselItem key={tour.id}>
                  <TourCard tour={tour} />
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
        <span className="text-muted-foreground text-xs">
          <MoveHorizontal className="h-4 w-4" />
          Swipe to see more
        </span>
      </section>
    </>
  );
}

export default page;
