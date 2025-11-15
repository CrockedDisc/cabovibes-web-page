// app/tours/[id]/page.tsx
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
import ContactCard from "@/components/ContactCard"; // ✅ Nuevo componente
import { AspectRatio } from "@/components/ui/aspect-ratio";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { MoveHorizontal } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

async function page({ params }: Props) {
  const { id } = await params;
  
  // ✅ Primero obtenemos el tour para saber su servicio
  const TourDetails = await getTourDetails(Number(id));

  if (!TourDetails) {
    return notFound();
  }

  // ✅ Determinar qué componente mostrar según el servicio
  const showBookingSidebar = TourDetails.serviceName === "Sport Fishing" || 
                             TourDetails.serviceName === "Sunset & Ballenas";
  const showContactCard = TourDetails.serviceName === "Yacht Chartering";

  return (
    <div className="flex lg:flex-row flex-col gap-4 lg:gap-16 w-full">
      <div className="flex flex-col gap-4 flex-1">
        <header>
          <Carousel>
            <CarouselContent>
              {TourDetails.media.map((mediaUrl, index) => (
                <CarouselItem key={mediaUrl} className="max-w-7xl">
                  <AspectRatio
                    ratio={16 / 9}
                    className="rounded-md overflow-hidden"
                  >
                    <Image
                      src={mediaUrl}
                      alt={TourDetails.name}
                      fill
                      priority={index === 0}
                      loading={index > 0 ? "lazy" : "eager"}
                      className="object-cover"
                    />
                  </AspectRatio>
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
        </header>

        <section className="flex w-full gap-2 md:gap-4 flex-col">
          <span className="text-lg md:text-2xl font-bold">
            {TourDetails.name}
          </span>
          <span className="text-base md:text-xl font-semibold">
            {TourDetails.size} feets
          </span>
          <div className="text-base md:text-xl font-normal">
            <MarkdownRenderer content={TourDetails.features || ""} />
          </div>

          <span className="text-lg md:text-2xl font-bold">Itinerary</span>

          <div className="text-base md:text-xl font-normal">
            <MarkdownRenderer content={TourDetails.itinerary || ""} />
          </div>
        </section>
      </div>

      <aside className="flex flex-col lg:w-96">
        {/* ✅ Mostrar BookingSidebar solo para ciertos servicios */}
        {showBookingSidebar && (
          <BookingSidebar
            tourData={TourDetails}
            tourId={Number(id)}
            boatPlanPriceId={TourDetails.plans[0].id}
          />
        )}

        {/* ✅ Mostrar ContactCard para Yacht Chartering */}
        {showContactCard && <ContactCard />}
      </aside>
    </div>
  );
}

export default page;
