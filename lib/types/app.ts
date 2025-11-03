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
