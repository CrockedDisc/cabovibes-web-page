// lib/utils/slugify.ts
export function slugifyService(serviceName: string): string {
  return serviceName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/[^\w-]/g, "");
}

export function unslugifyService(slug: string): string {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/And/g, "&");
}

// Mapeo exacto para evitar inconsistencias
export const SERVICE_SLUG_MAP: Record<string, string> = {
  "sport-fishing": "Sport Fishing",
  "sunset-and-ballena": "Sunset & Ballena",
  "yacht-chartering": "Yacht Chartering",
};

export const SERVICE_NAME_TO_SLUG: Record<string, string> = {
  "Sport Fishing": "sport-fishing",
  "Sunset & Ballena": "sunset-and-ballena",
  "Yacht Chartering": "yacht-chartering",
};
