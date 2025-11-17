import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { CardData } from "@/lib/types/app";
import { UsersRound, Clock, ArrowUpRight } from "lucide-react";
import { formatDuration } from "../lib/utils/format";
import Link from "next/link";
import { SERVICE_NAME_TO_SLUG, slugifyService } from "../lib/utils/slugify";

type Props = {
  tour: CardData;
};

function TourCard({ tour }: Props) {
  const serviceSlug = SERVICE_NAME_TO_SLUG[tour.serviceName] || slugifyService(tour.serviceName);
  return (
    <article className="flex aspect-auto sm:aspect-9/16">
      <Card className="w-full shadow-none">
        <CardHeader>
          <Link href={`/tours/${tour.id}/${serviceSlug}`}>
            {tour.image ? (
              <Image
                src={tour.image}
                alt={tour.name}
                width={256}
                height={256}
                className="aspect-square w-full rounded-sm object-cover"
                priority
              />
            ) : (
              <div className="aspect-square w-full rounded-sm flex items-center justify-center bg-muted">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col">
          <CardTitle className="flex justify-between gap-2 h-8">
            <span>{tour.name}</span>
            <span>${tour.basePrice}</span>
          </CardTitle>
          <CardDescription>
            <span>{tour.size} ft.</span>
          </CardDescription>
          <div className="flex items-center gap-2">
            <UsersRound className="h-4 w-4" />
            <span>{tour.capacity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(tour.duration)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <CardAction>
            <Button asChild>
              <Link href={`/tours/${tour.id}/${serviceSlug}`}>
                Book now <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </article>
  );
}

export default TourCard;
