ALTER TABLE "Amenities" ADD CONSTRAINT "Amenities_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "Boat_Plan_Prices" ADD CONSTRAINT "Boat_Plan_Prices_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "Boats" ADD CONSTRAINT "Boats_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "Boats_Media" ADD CONSTRAINT "Boats_Media_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "Services" ADD CONSTRAINT "Services_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "Partners" ADD CONSTRAINT "Partners_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "Plans" ADD CONSTRAINT "Plans_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "Plan_Amenities" ADD CONSTRAINT "Plan_Amenities_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "Locations" ADD CONSTRAINT "Locations_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "Service_Time_Slots" ADD CONSTRAINT "Service_Time_Slots_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "Reservation_Items" ADD CONSTRAINT "Reservation_Items_id_unique" UNIQUE("id");