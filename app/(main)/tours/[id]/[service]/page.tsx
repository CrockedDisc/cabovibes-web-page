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
import { SERVICE_SLUG_MAP, unslugifyService } from "@/lib/utils/slugify";

type Props = {
  params: Promise<{ id: string; service: string }>; // ← Agregar service aquí
};

async function page({ params }: Props) {
  const { id, service: serviceSlug } = await params;

  const serviceName =
    SERVICE_SLUG_MAP[serviceSlug] || unslugifyService(serviceSlug);

  const TourDetails = await getTourDetails(Number(id), serviceName);

  if (!TourDetails) {
    return notFound();
  }

  const firstPlanId = TourDetails?.plans[0]?.id || 1;

  const showBookingSidebar =
    TourDetails.serviceName === "Sport Fishing" ||
    TourDetails.serviceName === "Sunset & Ballena";

  const showContactCard = TourDetails.serviceName === "Yacht Chartering";

  return (
    <div className="flex lg:flex-row flex-col gap-4 lg:gap-16 w-full">
      <div className="flex flex-col gap-4 flex-1">
        <header>
          <Carousel className="mb-2">
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
        {showBookingSidebar && (
          <>
            <BookingSidebar
              tourData={TourDetails}
              tourId={Number(id)}
              boatPlanPriceId={firstPlanId}
            />
          </>
        )}

        {showContactCard && (
          <>
            <ContactCard />
          </>
        )}

        {!showBookingSidebar && !showContactCard && (
          <p className="font-bold">No sidebar to show</p>
        )}
      </aside>
    </div>
  );
}

export default page;
