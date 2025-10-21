import { Wine, ShipWheel, Sparkle } from "lucide-react";
import type { Reason, FAQ } from "./types";

export const REASONS: Reason[] = [
  {
    title: "Adventure & Comfort",
    description: "The perfect blend for an unforgettable day.",
    icon: Wine,
  },
  {
    title: "Diverse Fleet",
    description: "From traditional pangas to luxury yachts.",
    icon: ShipWheel,
  },
  {
    title: "Signature Activities",
    description: "Sport fishing, whale watching, sunset cruises, and more.",
    icon: Sparkle,
  },
] as const;

export const FAQS: FAQ[] = [
  {
    question: "What kind of fish can I catch and in what season?",
    answer:
      "In Los Cabos, you can fish all year round. Depending on the season, it is common to catch dorado, tuna, marlin, wahoo, and roosterfish. We guide you on the best areas and available species based on the date of your trip.",
  },
  {
    question: "How long does the fishing tour last?",
    answer:
      "We offer trips starting from 6 hours, depending on the package and type of boat. Schedules can also be customized according to your preferences.",
  },
  {
    question: "Do I need a fishing license?",
    answer:
      "Yes, it is mandatory for each person participating in fishing. If you do not have one, we can help you obtain it before the trip.",
  },
  {
    question: "Does the price include fishing equipment?",
    answer:
      "Yes, all our packages include rods, reels, lures, and the support of the captain and crew. If you prefer, you can bring your own equipment.",
  },
  {
    question: "What happens if there is no fishing that day?",
    answer:
      "Fishing is a natural activity and depends on the sea conditions, but our captains know the best areas and techniques to maximize the chances of success.",
  },
  {
    question: "From which port do the boats depart?",
    answer:
      "We operate from Puerto Los Cabos in San José del Cabo. We can also coordinate departures from Cabo San Lucas depending on availability.",
  },
] as const;
