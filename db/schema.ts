import { pgEnum } from "drizzle-orm/pg-core";

export const classificationTierEnum = pgEnum("classification_tier", [
  "basic",
  "premium",
  "luxury",
]);

export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);

import {
  pgTable,
  integer,
  varchar,
  text,
  numeric,
  serial,
  bigserial,
  date,
  time,
  timestamp,
  bigint,
  primaryKey,
  foreignKey,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").unique(),
  phone: varchar("phone").unique(),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  address: varchar("address"),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  description: text("description"),
});

export const boats = pgTable(
  "boats",
  {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull().unique(),
    partnerId: integer("partner_id").references(() => partners.id),
    classificationTier: classificationTierEnum("classification_tier")
      .notNull()
      .default("basic"),
    size: numeric("size"),
    capacity: integer("capacity"),
    features: text("features"),
  },
  (table) => [check("boats_capacity_check", sql`${table.capacity} > 0`)]
);

export const plans = pgTable("plans", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id),
  level: text("level").notNull(),
  name: text("name").notNull(),
  description: text("description"),
});

export const serviceTimeSlots = pgTable("service_time_slots", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id),
  name: text("name").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
});

export const reservations = pgTable(
  "reservations",
  {
    id: serial("id").primaryKey(),
    guestName: varchar("guest_name").notNull(),
    guestEmail: varchar("guest_email").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    total: numeric("total").notNull(),
    status: reservationStatusEnum("status").notNull().default("pending"),
  },
  (table) => [check("reservations_total_check", sql`${table.total} >= 0`)]
);

export const boatDepartureLocations = pgTable(
  "boat_departure_locations",
  {
    boatId: integer("boat_id")
      .notNull()
      .references(() => boats.id),
    locationId: integer("location_id")
      .notNull()
      .references(() => locations.id),
  },
  (table) => [primaryKey({ columns: [table.boatId, table.locationId] })]
);

export const boatPlanPrices = pgTable(
  "boat_plan_prices",
  {
    id: serial("id").primaryKey(),
    boatId: integer("boat_id")
      .notNull()
      .references(() => boats.id),
    planId: bigint("plan_id", { mode: "bigint" })
      .notNull()
      .references(() => plans.id),
    basePrice: numeric("base_price").notNull(),
  },
  (table) => [
    check("boat_plan_prices_base_price_check", sql`${table.basePrice} >= 0`),
  ]
);

export const boatServices = pgTable(
  "boat_services",
  {
    boatId: integer("boat_id")
      .notNull()
      .references(() => boats.id),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id),
    capacityFree: integer("capacity_free"),
    basePrice: numeric("base_price"),
  },
  (table) => [
    primaryKey({ columns: [table.boatId, table.serviceId] }),
    check("boat_services_capacity_free_check", sql`${table.capacityFree} > 0`),
    check("boat_services_base_price_check", sql`${table.basePrice} >= 0`),
  ]
);

export const reservationItems = pgTable(
  "reservation_items",
  {
    id: serial("id").primaryKey(),
    reservationId: integer("reservation_id")
      .notNull()
      .references(() => reservations.id),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id),
    boatId: integer("boat_id")
      .notNull()
      .references(() => boats.id),
    planId: bigint("plan_id", { mode: "bigint" }).references(() => plans.id),
    boatPlanPriceId: integer("boat_plan_price_id").references(
      () => boatPlanPrices.id
    ),
    pax: integer("pax").notNull(),
    selectedLocationId: integer("selected_location_id").references(
      () => locations.id
    ),
    slotId: bigint("slot_id", { mode: "bigint" }).references(
      () => serviceTimeSlots.id
    ),
    serviceDate: date("service_date"),
    basePrice: numeric("base_price"),
    subtotal: numeric("subtotal"),
    note: text("note"),
  },
  (table) => [
    check("reservation_items_pax_check", sql`${table.pax} > 0`),
    check("reservation_items_base_price_check", sql`${table.basePrice} >= 0`),
    check("reservation_items_subtotal_check", sql`${table.subtotal} >= 0`),
  ]
);
