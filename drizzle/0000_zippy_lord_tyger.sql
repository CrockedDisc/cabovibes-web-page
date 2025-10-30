CREATE TYPE "public"."media_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."reservation_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TABLE "Amenities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Boat_Plan_Prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"boat_id" integer NOT NULL,
	"plan_id" integer,
	"base_price" numeric NOT NULL,
	"free_pax" integer NOT NULL,
	"price_per_person" numeric,
	"duration" time NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Boats" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"partner_id" integer NOT NULL,
	"size" numeric NOT NULL,
	"capacity" integer NOT NULL,
	"features" text
);
--> statement-breakpoint
CREATE TABLE "Boats_Media" (
	"id" serial PRIMARY KEY NOT NULL,
	"boat_id" integer NOT NULL,
	"media_url" text NOT NULL,
	"media_type" "media_type" NOT NULL,
	"is_featured" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Services" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar,
	"phone_number" varchar
);
--> statement-breakpoint
CREATE TABLE "Plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Plan_Amenities" (
	"id" serial PRIMARY KEY NOT NULL,
	"boat_plan_price_id" integer NOT NULL,
	"amenity_id" integer NOT NULL,
	"is_included" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Location_Departures" (
	"boat_id" integer NOT NULL,
	"location_id" integer NOT NULL,
	CONSTRAINT "Location_Departures_boat_id_location_id_pk" PRIMARY KEY("boat_id","location_id")
);
--> statement-breakpoint
CREATE TABLE "Service_Time_Slots" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"guest_name" varchar,
	"guest_lastname" varchar,
	"guest_phone_1" varchar,
	"guest_phone_2" varchar,
	"guest_hotel" varchar,
	"guest_hotel_reservation_name" varchar,
	"guest_room_number" varchar,
	"medic_notes" text,
	"reservation_status" "reservation_status" DEFAULT 'pending',
	"total" numeric DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "Reservation_Items" (
	"id" serial PRIMARY KEY NOT NULL,
	"reservation_id" integer NOT NULL,
	"boat_plan_price_id" integer NOT NULL,
	"service_time_slot_id" integer NOT NULL,
	"location_id" integer NOT NULL,
	"start_time" timestamp with time zone,
	"pax" integer NOT NULL,
	"subtotal" numeric NOT NULL,
	"notes" text NOT NULL,
	"end_time" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"reservation_id" integer NOT NULL,
	"transaction_id" varchar NOT NULL,
	"status" varchar NOT NULL,
	"amount" numeric NOT NULL,
	"currency" varchar DEFAULT 'USD' NOT NULL,
	"payer_email" text,
	"payment_method" varchar DEFAULT 'paypal' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "payments_transaction_id_unique" UNIQUE("transaction_id"),
	CONSTRAINT "status_check" CHECK ("payments"."status" = ANY (ARRAY['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']))
);
--> statement-breakpoint
ALTER TABLE "Boat_Plan_Prices" ADD CONSTRAINT "Boat_Plan_Prices_boat_id_Boats_id_fk" FOREIGN KEY ("boat_id") REFERENCES "public"."Boats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Boat_Plan_Prices" ADD CONSTRAINT "Boat_Plan_Prices_plan_id_Plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."Plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Boats" ADD CONSTRAINT "Boats_partner_id_Partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."Partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Boats_Media" ADD CONSTRAINT "Boats_Media_boat_id_Boats_id_fk" FOREIGN KEY ("boat_id") REFERENCES "public"."Boats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Plans" ADD CONSTRAINT "Plans_service_id_Services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."Services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Plan_Amenities" ADD CONSTRAINT "Plan_Amenities_boat_plan_price_id_Boat_Plan_Prices_id_fk" FOREIGN KEY ("boat_plan_price_id") REFERENCES "public"."Boat_Plan_Prices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Plan_Amenities" ADD CONSTRAINT "Plan_Amenities_amenity_id_Amenities_id_fk" FOREIGN KEY ("amenity_id") REFERENCES "public"."Amenities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Location_Departures" ADD CONSTRAINT "Location_Departures_boat_id_Boats_id_fk" FOREIGN KEY ("boat_id") REFERENCES "public"."Boats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Location_Departures" ADD CONSTRAINT "Location_Departures_location_id_Locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."Locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Service_Time_Slots" ADD CONSTRAINT "Service_Time_Slots_service_id_Services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."Services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Reservation_Items" ADD CONSTRAINT "Reservation_Items_reservation_id_Reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."Reservations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Reservation_Items" ADD CONSTRAINT "Reservation_Items_boat_plan_price_id_Boat_Plan_Prices_id_fk" FOREIGN KEY ("boat_plan_price_id") REFERENCES "public"."Boat_Plan_Prices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Reservation_Items" ADD CONSTRAINT "Reservation_Items_service_time_slot_id_Service_Time_Slots_id_fk" FOREIGN KEY ("service_time_slot_id") REFERENCES "public"."Service_Time_Slots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Reservation_Items" ADD CONSTRAINT "Reservation_Items_location_id_Locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."Locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_reservation_id_Reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."Reservations"("id") ON DELETE no action ON UPDATE no action;