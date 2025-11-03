import React from "react";
import {
  Button,
} from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import { CardData } from "@/lib/types/app";
import { UsersRound, Clock, ArrowUpRight } from "lucide-react";
import { formatDuration } from '../lib/utils/format';

type Props = {
  tour: CardData;
};

function TourCard({ tour }: Props) {
  return (
    <article className="flex aspect-auto sm:aspect-9/16">
      <Card className="w-full shadow-none">
        <CardHeader>
          {tour.image ? (
            <Image
              src={tour.image}
              alt={tour.name}
              width={128}
              height={128}
              className="aspect-square w-full rounded-sm object-cover"
            />
          ) : (
            <div className="aspect-square w-full rounded-sm flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
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
            <UsersRound className="h-4 w-4"/>
              <span>{tour.capacity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4"/>
              <span>{formatDuration(tour.duration)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <CardAction>
            <Button>
              Book now
              <ArrowUpRight className="h-4 w-4" />
              </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </article>
  );
}

export default TourCard;
