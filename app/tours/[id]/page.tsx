import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";
import { getTourDetails } from "@/db/queries/tours";
import { notFound } from "next/navigation";
import BookingSidebar from "@/components/BookingSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

async function page({ params }: Props) {
  const { id } = await params;

  const TourDetails = await getTourDetails(Number(id), "Sport Fishing");

  if (!TourDetails) {
    return notFound();
  }

  return (
    <>
      <div className="flex lg:flex-row flex-col gap-4 lg:gap-16 w-full">
        <div className="flex flex-col gap-4">
          <header className="flex flex-col">
            <Carousel>
              <CarouselContent>
                {TourDetails.media.map((mediaUrl) => (
                  <CarouselItem key={mediaUrl} className="aspect-video">
                    <Image
                      src={mediaUrl}
                      alt={TourDetails.name}
                      width={1000}
                      height={1000}
                      priority
                      className="object-cover rounded-md"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:flex" />
              <CarouselNext className="hidden lg:flex" />
            </Carousel>
          </header>
          <section className="flex w-full gap-2 md:gap-4 flex-col">
            <span className="text-lg md:text-2xl font-bold">
              {TourDetails.name}
            </span>
            <span className="text-base md:text-xl font-semibold">
              {TourDetails.size} feets
            </span>
            <p className="text-base md:text-xl font-normal">
              {TourDetails.features}
            </p>
            <span className="text-lg md:text-2xl font-bold">
              Itinerary
            </span>
            <p className="text-base md:text-xl font-normal">
              {TourDetails.itinerary}
            </p>
          </section>
        </div>
        <aside className="flex flex-col">
          <BookingSidebar
            tourData={TourDetails}
            tourId={Number(id)}
            boatPlanPriceId={TourDetails.plans[0].id}
          />
        </aside>
      </div>
    </>
  );
}

export default page;
