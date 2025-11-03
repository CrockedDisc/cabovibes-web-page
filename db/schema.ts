import {
  pgTable,
  unique,
  integer,
  varchar,
  foreignKey,
  timestamp,
  numeric,
  text,
  time,
  boolean,
  check,
  serial,
  index,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const mediaType = pgEnum("media_type", ["video", "image"]);
export const reservationStatus = pgEnum("reservation_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);
export const boatType = pgEnum("boat_type", [
  "Viking",
  "Superpanga",
  "Sport Fisher",
  "Sport Fishing Boat",
  "Luxury Yacht",
]);

export const amenities = pgTable(
  "Amenities",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "Amenities_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    name: varchar().notNull(),
  },
  (table) => [unique("Amenities_id_key").on(table.id)]
);

export const reservationItems = pgTable(
  "Reservation_Items",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "Reservation_Items_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    reservationId: integer("reservation_id").notNull(),
    boatPlanPriceId: integer("boat_plan_price_id").notNull(),
    serviceTimeSlotId: integer("service_time_slot_id").notNull(),
    locationId: integer("location_id").notNull(),
    startTime: timestamp("start_time", { withTimezone: true, mode: "string" }),
    pax: integer().notNull(),
    subtotal: numeric().notNull(),
    notes: text().notNull(),
    endTime: timestamp("end_time", { withTimezone: true, mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.boatPlanPriceId],
      foreignColumns: [boatPlanPrices.id],
      name: "Reservation_Items_boat_plan_price_id_fkey",
    }),
    foreignKey({
      columns: [table.locationId],
      foreignColumns: [locations.id],
      name: "Reservation_Items_location_id_fkey",
    }),
    foreignKey({
      columns: [table.reservationId],
      foreignColumns: [reservations.id],
      name: "Reservation_Items_reservation_id_fkey",
    }),
    foreignKey({
      columns: [table.serviceTimeSlotId],
      foreignColumns: [serviceTimeSlots.id],
      name: "Reservation_Items_service_time_slot_id_fkey",
    }),
    unique("Reservation_Items_id_key").on(table.id),
  ]
);

export const boats = pgTable(
  "Boats",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "Boats_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    name: varchar().notNull(),
    partnerId: integer("partner_id").notNull(),
    size: numeric().notNull(),
    capacity: integer().notNull(),
    features: text(),
    isPopular: boolean("is_popular").default(false).notNull(),
    type: boatType("type").default("Luxury Yacht").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.partnerId],
      foreignColumns: [partners.id],
      name: "Boats_partner_id_fkey",
    }),
    unique("Boats_id_key").on(table.id),
  ]
);

export const partners = pgTable(
  "Partners",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "Partners_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    name: varchar().notNull(),
    email: varchar(),
    phoneNumber: varchar("phone_number"),
  },
  (table) => [unique("Partners_id_key").on(table.id)]
);

export const serviceTimeSlots = pgTable(
  "Service_Time_Slots",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "Service_Time_Slots_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    serviceId: integer("service_id").notNull(),
    name: varchar().notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.serviceId],
      foreignColumns: [services.id],
      name: "Service_Time_Slots_service_id_fkey",
    }),
    unique("Service_Time_Slots_id_key").on(table.id),
  ]
);

export const boatsMedia = pgTable(
  "Boats_Media",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "Boats_Media_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    boatId: integer("boat_id").notNull(),
    mediaUrl: text("media_url").notNull(),
    mediaType: mediaType("media_type").notNull(),
    isFeatured: boolean("is_featured").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.boatId],
      foreignColumns: [boats.id],
      name: "Boats_Media_boat_id_fkey",
    }),
    unique("Boats_Media_id_key").on(table.id),
  ]
);

export const services = pgTable(
  "Services",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "Services_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    name: varchar().notNull(),
    description: text().notNull(),
  },
  (table) => [unique("Services_id_key").on(table.id)]
);

export const planAmenities = pgTable(
  "Plan_Amenities",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "Plan_Amenities_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    boatPlanPriceId: integer("boat_plan_price_id").notNull(),
    amenityId: integer("amenity_id").notNull(),
    isIncluded: boolean("is_included").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.amenityId],
      foreignColumns: [amenities.id],
      name: "Plan_Amenities_amenities_id_fkey",
    }),
    foreignKey({
      columns: [table.boatPlanPriceId],
      foreignColumns: [boatPlanPrices.id],
      name: "Plan_Amenities_boat_plan_price_id_fkey",
    }),
    unique("Plan_Amenities_id_key").on(table.id),
  ]
);

export const payments = pgTable(
  "payments",
  {
    id: serial().primaryKey().notNull(),
    reservationId: integer("reservation_id").notNull(),
    transactionId: varchar("transaction_id", { length: 255 }).notNull(),
    status: varchar({ length: 50 }).notNull(),
    amount: numeric({ precision: 10, scale: 2 }).notNull(),
    currency: varchar({ length: 10 }).default("USD").notNull(),
    payerEmail: text("payer_email"),
    paymentMethod: varchar("payment_method", { length: 50 })
      .default("paypal")
      .notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.reservationId],
      foreignColumns: [reservations.id],
      name: "fk_reservation",
    }).onDelete("cascade"),
    unique("payments_transaction_id_key").on(table.transactionId),
    check(
      "payments_status_check",
      sql`(status)::text = ANY ((ARRAY['PENDING'::character varying, 'COMPLETED'::character varying, 'FAILED'::character varying, 'CANCELLED'::character varying])::text[])`
    ),
  ]
);

export const boatPlanPrices = pgTable(
  "Boat_Plan_Prices",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "Boat_Plan_Prices_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    boatId: integer("boat_id").notNull(),
    planId: integer("plan_id"),
    basePrice: numeric("base_price").notNull(),
    freePax: integer("free_pax").notNull(),
    pricePerPerson: numeric("price_per_person"),
    duration: time().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.boatId],
      foreignColumns: [boats.id],
      name: "Boat_Plan_Prices_boat_id_fkey",
    }),
    foreignKey({
      columns: [table.planId],
      foreignColumns: [plans.id],
      name: "Boat_Plan_Prices_plan_id_fkey",
    }),
    unique("Boat_Plan_Prices_id_key").on(table.id),
  ]
);

export const reservations = pgTable(
  "Reservations",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "Reservation_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    guestName: varchar("guest_name"),
    guestLastname: varchar("guest_lastname"),
    guestPhone1: varchar("guest_phone_1"),
    guestPhone2: varchar("guest_phone_2"),
    guestHotel: varchar("guest_hotel"),
    guestHotelReservationName: varchar("guest_hotel_reservation_name"),
    guestRoomNumber: varchar("guest_room_number"),
    medicNotes: text("medic_notes"),
    reservationStatus:
      reservationStatus("reservation_status").default("pending"),
    total: numeric().default("0"),
  },
  (table) => [
    index("idx_reservation_pending").using(
      "btree",
      table.reservationStatus.asc().nullsLast().op("enum_ops")
    ),
    unique("Reservation_id_key").on(table.id),
  ]
);

export const plans = pgTable(
  "Plans",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "Plans_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    serviceId: integer("service_id").notNull(),
    name: varchar().notNull(),
    description: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.serviceId],
      foreignColumns: [services.id],
      name: "Plans_service_id_fkey",
    }),
    unique("Plans_id_key").on(table.id),
  ]
);

export const locations = pgTable("Locations", {
  id: integer().primaryKey().generatedByDefaultAsIdentity({
    name: "Locations_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
  }),
  name: varchar().notNull(),
});

export const locationDepartures = pgTable(
  "Location_Departures",
  {
    boatId: integer("boat_id").notNull(),
    locationId: integer("location_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.boatId],
      foreignColumns: [boats.id],
      name: "Locations_Departures_boat_id_fkey",
    }),
    foreignKey({
      columns: [table.locationId],
      foreignColumns: [locations.id],
      name: "Locations_Departures_location_id_fkey",
    }),
    primaryKey({
      columns: [table.boatId, table.locationId],
      name: "Locations_Departures_pkey",
    }),
  ]
);
