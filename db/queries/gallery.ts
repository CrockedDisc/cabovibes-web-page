// db/queries/gallery.ts
import { db, boatsMedia } from "@/db";
import { eq } from "drizzle-orm";

export async function getGalleryImages() {
  const images = await db.query.boatsMedia.findMany({
    where: eq(boatsMedia.mediaType, "image"),
    columns: {
      id: true,
      mediaUrl: true,
    },
    with: {
      boat: {
        columns: {
          name: true,
        },
      },
    },
  });

  return images.map((img) => ({
    id: img.id,
    url: img.mediaUrl,
    alt: img.boat?.name || "Cabovibes Gallery",
  }));
}
