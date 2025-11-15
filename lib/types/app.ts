export type CardData = {
  id: number;
  name: string;
  size: string;
  capacity: number;
  image: string | null;
  basePrice: string;
  duration: string;
  isPopular: boolean;
  type:
    | "Viking"
    | "Superpanga"
    | "Sport Fisher"
    | "Sport Fishing Boat"
    | "Luxury Yacht";
  planName: string;
  serviceName: string;
};

export type TourData = {
  id: number;
  name: string;
  size: string;
  capacity: number;
  features: string | null;
  type: string;
  serviceName: string;
  
  // Media
  media: string[];
  
  // Locations
  locations: string[];

  itinerary: string;
  
  // Plans (filtrado por servicio)
  plans: Array<{
    id: number;
    planName: string;
    planDescription: string;
    basePrice: string;
    freePax: number;
    pricePerPerson: string | null;
    duration: string;
    amenities: Array<{
      id: number;
      name: string;
      isIncluded: boolean;
    }>;
  }>;
  
  // Time slots
  timeSlots: Array<{
    id: number;
    name: string;
    startTime: string;
    endTime: string;
  }>;
};

