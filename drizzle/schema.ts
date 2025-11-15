import { pgTable, unique, integer, varchar, foreignKey, timestamp, numeric, text, index, boolean, time, check, serial, primaryKey, pgView, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const boatType = pgEnum("boat_type", ['Viking', 'Superpanga', 'Sport Fisher', 'Sport Fishing Boat', 'Luxury Yacht'])
export const mediaType = pgEnum("media_type", ['video', 'image'])
export const reservationStatus = pgEnum("reservation_status", ['pending', 'confirmed', 'cancelled', 'completed'])


export const amenities = pgTable("Amenities", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "Amenities_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar().notNull(),
}, (table) => [
	unique("Amenities_id_key").on(table.id),
]);

export const reservationItems = pgTable("Reservation_Items", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "Reservation_Items_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	reservationId: integer("reservation_id").notNull(),
	boatPlanPriceId: integer("boat_plan_price_id").notNull(),
	serviceTimeSlotId: integer("service_time_slot_id").notNull(),
	locationId: integer("location_id").notNull(),
	startTime: timestamp("start_time", { withTimezone: true, mode: 'string' }),
	pax: integer().notNull(),
	subtotal: numeric().notNull(),
	notes: text().notNull(),
	endTime: timestamp("end_time", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.boatPlanPriceId],
			foreignColumns: [boatPlanPrices.id],
			name: "Reservation_Items_boat_plan_price_id_fkey"
		}),
	foreignKey({
			columns: [table.locationId],
			foreignColumns: [locations.id],
			name: "Reservation_Items_location_id_fkey"
		}),
	foreignKey({
			columns: [table.reservationId],
			foreignColumns: [reservations.id],
			name: "Reservation_Items_reservation_id_fkey"
		}),
	foreignKey({
			columns: [table.serviceTimeSlotId],
			foreignColumns: [serviceTimeSlots.id],
			name: "Reservation_Items_service_time_slot_id_fkey"
		}),
	unique("Reservation_Items_id_key").on(table.id),
]);

export const boats = pgTable("Boats", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "Boats_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar().notNull(),
	partnerId: integer("partner_id").notNull(),
	size: numeric().notNull(),
	capacity: integer().notNull(),
	features: text(),
	isPopular: boolean("is_popular").default(false).notNull(),
	type: boatType().default('Luxury Yacht').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
}, (table) => [
	index("idx_boats_is_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	foreignKey({
			columns: [table.partnerId],
			foreignColumns: [partners.id],
			name: "Boats_partner_id_fkey"
		}),
	unique("Boats_id_key").on(table.id),
]);

export const partners = pgTable("Partners", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "Partners_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar().notNull(),
	email: varchar(),
	phoneNumber: varchar("phone_number"),
}, (table) => [
	unique("Partners_id_key").on(table.id),
]);

export const serviceTimeSlots = pgTable("Service_Time_Slots", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "Service_Time_Slots_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	serviceId: integer("service_id").notNull(),
	name: varchar().notNull(),
	startTime: time("start_time").notNull(),
	endTime: time("end_time").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.serviceId],
			foreignColumns: [services.id],
			name: "Service_Time_Slots_service_id_fkey"
		}),
	unique("Service_Time_Slots_id_key").on(table.id),
]);

export const boatsMedia = pgTable("Boats_Media", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "Boats_Media_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	boatId: integer("boat_id").notNull(),
	mediaUrl: text("media_url").notNull(),
	mediaType: mediaType("media_type").notNull(),
	isFeatured: boolean("is_featured").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.boatId],
			foreignColumns: [boats.id],
			name: "Boats_Media_boat_id_fkey"
		}),
	unique("Boats_Media_id_key").on(table.id),
]);

export const services = pgTable("Services", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "Services_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar().notNull(),
	description: text().notNull(),
}, (table) => [
	unique("Services_id_key").on(table.id),
]);

export const planAmenities = pgTable("Plan_Amenities", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "Plan_Amenities_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	boatPlanPriceId: integer("boat_plan_price_id").notNull(),
	amenityId: integer("amenity_id").notNull(),
	isIncluded: boolean("is_included").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.amenityId],
			foreignColumns: [amenities.id],
			name: "Plan_Amenities_amenities_id_fkey"
		}),
	foreignKey({
			columns: [table.boatPlanPriceId],
			foreignColumns: [boatPlanPrices.id],
			name: "Plan_Amenities_boat_plan_price_id_fkey"
		}),
	unique("Plan_Amenities_id_key").on(table.id),
]);

export const payments = pgTable("payments", {
	id: serial().primaryKey().notNull(),
	reservationId: integer("reservation_id").notNull(),
	transactionId: varchar("transaction_id", { length: 255 }).notNull(),
	status: varchar({ length: 50 }).notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	currency: varchar({ length: 10 }).default('USD').notNull(),
	payerEmail: text("payer_email"),
	paymentMethod: varchar("payment_method", { length: 50 }).default('paypal').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.reservationId],
			foreignColumns: [reservations.id],
			name: "fk_reservation"
		}).onDelete("cascade"),
	unique("payments_transaction_id_key").on(table.transactionId),
	check("payments_status_check", sql`(status)::text = ANY ((ARRAY['PENDING'::character varying, 'COMPLETED'::character varying, 'FAILED'::character varying, 'CANCELLED'::character varying])::text[])`),
]);

export const reservations = pgTable("Reservations", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "Reservation_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	guestName: varchar("guest_name").notNull(),
	guestLastname: varchar("guest_lastname").notNull(),
	guestPhone1: varchar("guest_phone_1").notNull(),
	guestPhone2: varchar("guest_phone_2"),
	guestHotel: varchar("guest_hotel"),
	guestHotelReservationName: varchar("guest_hotel_reservation_name"),
	guestRoomNumber: varchar("guest_room_number"),
	medicNotes: text("medic_notes"),
	reservationStatus: reservationStatus("reservation_status").default('pending').notNull(),
	total: numeric().default('0').notNull(),
	guestEmail: varchar("guest_email").notNull(),
}, (table) => [
	index("idx_reservation_pending").using("btree", table.reservationStatus.asc().nullsLast().op("enum_ops")),
	unique("Reservation_id_key").on(table.id),
]);

export const boatPlanPrices = pgTable("Boat_Plan_Prices", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "Boat_Plan_Prices_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	boatId: integer("boat_id").notNull(),
	planId: integer("plan_id"),
	basePrice: numeric("base_price").notNull(),
	freePax: integer("free_pax").notNull(),
	pricePerPerson: numeric("price_per_person"),
	duration: time().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.boatId],
			foreignColumns: [boats.id],
			name: "Boat_Plan_Prices_boat_id_fkey"
		}),
	foreignKey({
			columns: [table.planId],
			foreignColumns: [plans.id],
			name: "Boat_Plan_Prices_plan_id_fkey"
		}),
	unique("Boat_Plan_Prices_id_key").on(table.id),
]);

export const plans = pgTable("Plans", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "Plans_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	serviceId: integer("service_id").notNull(),
	name: varchar().notNull(),
	description: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.serviceId],
			foreignColumns: [services.id],
			name: "Plans_service_id_fkey"
		}),
	unique("Plans_id_key").on(table.id),
]);

export const locations = pgTable("Locations", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "Locations_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar().notNull(),
});

export const locationDepartures = pgTable("Location_Departures", {
	boatId: integer("boat_id").notNull(),
	locationId: integer("location_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.boatId],
			foreignColumns: [boats.id],
			name: "Locations_Departures_boat_id_fkey"
		}),
	foreignKey({
			columns: [table.locationId],
			foreignColumns: [locations.id],
			name: "Locations_Departures_location_id_fkey"
		}),
	primaryKey({ columns: [table.boatId, table.locationId], name: "Locations_Departures_pkey"}),
]);
export const boatsFullView = pgView("boats_full_view", {	boatId: integer("boat_id"),
	boatName: varchar("boat_name"),
	size: numeric(),
	capacity: integer(),
	features: text(),
	type: boatType(),
	isPopular: boolean("is_popular"),
	isActive: boolean("is_active"),
	partnerName: varchar("partner_name"),
	partnerEmail: varchar("partner_email"),
	partnerPhone: varchar("partner_phone"),
	departureLocations: text("departure_locations"),
	plansAndPrices: text("plans_and_prices"),
	amenities: text(),
	mediaUrls: text("media_urls"),
}).as(sql`SELECT b.id AS boat_id, b.name AS boat_name, b.size, b.capacity, b.features, b.type, b.is_popular, b.is_active, p.name AS partner_name, p.email AS partner_email, p.phone_number AS partner_phone, string_agg(DISTINCT l.name::text, ', '::text) AS departure_locations, string_agg(DISTINCT (((((((((pl.name::text || ' ('::text) || s.name::text) || ') - Base: $'::text) || bpp.base_price::text) || ' | Free pax: '::text) || bpp.free_pax::text) || ' | Extra per pax: $'::text) || COALESCE(bpp.price_per_person::text, '0'::text)) || ' | Duration: '::text) || bpp.duration::text, ' '::text) AS plans_and_prices, string_agg(DISTINCT ((a.name::text || ' ('::text) || CASE WHEN pa.is_included THEN 'Incluida'::text ELSE 'Adicional'::text END) || ')'::text, ', '::text) AS amenities, string_agg(DISTINCT bm.media_url, ', '::text) AS media_urls FROM "Boats" b LEFT JOIN "Partners" p ON p.id = b.partner_id LEFT JOIN "Location_Departures" ld ON ld.boat_id = b.id LEFT JOIN "Locations" l ON l.id = ld.location_id LEFT JOIN "Boat_Plan_Prices" bpp ON bpp.boat_id = b.id LEFT JOIN "Plans" pl ON pl.id = bpp.plan_id LEFT JOIN "Services" s ON s.id = pl.service_id LEFT JOIN "Plan_Amenities" pa ON pa.boat_plan_price_id = bpp.id LEFT JOIN "Amenities" a ON a.id = pa.amenity_id LEFT JOIN "Boats_Media" bm ON bm.boat_id = b.id GROUP BY b.id, b.name, b.size, b.capacity, b.features, b.type, b.is_popular, b.is_active, p.name, p.email, p.phone_number`);

export const boatsPlansPricesView = pgView("boats_plans_prices_view", {	boatId: integer("boat_id"),
	boatName: varchar("boat_name"),
	size: numeric(),
	capacity: integer(),
	type: boatType(),
	isPopular: boolean("is_popular"),
	isActive: boolean("is_active"),
	partnerName: varchar("partner_name"),
	planId: integer("plan_id"),
	planName: varchar("plan_name"),
	planDescription: text("plan_description"),
	serviceName: varchar("service_name"),
	serviceDescription: text("service_description"),
	boatPlanPriceId: integer("boat_plan_price_id"),
	basePrice: numeric("base_price"),
	freePax: integer("free_pax"),
	pricePerPerson: numeric("price_per_person"),
	duration: time(),
	amenities: text(),
	departureLocations: text("departure_locations"),
	mediaUrls: text("media_urls"),
}).as(sql`SELECT b.id AS boat_id, b.name AS boat_name, b.size, b.capacity, b.type, b.is_popular, b.is_active, p.name AS partner_name, pl.id AS plan_id, pl.name AS plan_name, pl.description AS plan_description, s.name AS service_name, s.description AS service_description, bpp.id AS boat_plan_price_id, bpp.base_price, bpp.free_pax, bpp.price_per_person, bpp.duration, string_agg(DISTINCT ((a.name::text || ' ('::text) || CASE WHEN pa.is_included THEN 'Incluida'::text ELSE 'Adicional'::text END) || ')'::text, ', '::text) AS amenities, string_agg(DISTINCT l.name::text, ', '::text) AS departure_locations, string_agg(DISTINCT bm.media_url, ', '::text) AS media_urls FROM "Boats" b LEFT JOIN "Partners" p ON p.id = b.partner_id LEFT JOIN "Boat_Plan_Prices" bpp ON bpp.boat_id = b.id LEFT JOIN "Plans" pl ON pl.id = bpp.plan_id LEFT JOIN "Services" s ON s.id = pl.service_id LEFT JOIN "Plan_Amenities" pa ON pa.boat_plan_price_id = bpp.id LEFT JOIN "Amenities" a ON a.id = pa.amenity_id LEFT JOIN "Location_Departures" ld ON ld.boat_id = b.id LEFT JOIN "Locations" l ON l.id = ld.location_id LEFT JOIN "Boats_Media" bm ON bm.boat_id = b.id GROUP BY b.id, b.name, b.size, b.capacity, b.type, b.is_popular, b.is_active, p.name, pl.id, pl.name, pl.description, s.name, s.description, bpp.id, bpp.base_price, bpp.free_pax, bpp.price_per_person, bpp.duration`);

export const reservationItemsDetailsView = pgView("reservation_items_details_view", {	reservationItemId: integer("reservation_item_id"),
	reservationId: integer("reservation_id"),
	guestFirstname: varchar("guest_firstname"),
	guestLastname: varchar("guest_lastname"),
	guestFullname: text("guest_fullname"),
	guestPhone: varchar("guest_phone"),
	guestHotel: varchar("guest_hotel"),
	paymentStatus: varchar("payment_status", { length: 50 }),
	paymentAmount: numeric("payment_amount", { precision: 10, scale:  2 }),
	paymentCurrency: varchar("payment_currency", { length: 10 }),
	paymentMethod: varchar("payment_method", { length: 50 }),
	paymentDate: timestamp("payment_date", { withTimezone: true, mode: 'string' }),
	pax: integer(),
	subtotal: numeric(),
	notes: text(),
	startTime: timestamp("start_time", { withTimezone: true, mode: 'string' }),
	endTime: timestamp("end_time", { withTimezone: true, mode: 'string' }),
	boatName: varchar("boat_name"),
	planName: varchar("plan_name"),
	serviceName: varchar("service_name"),
	locationName: varchar("location_name"),
	reservationTotal: numeric("reservation_total"),
	reservationStatus: reservationStatus("reservation_status"),
}).as(sql`SELECT ri.id AS reservation_item_id, r.id AS reservation_id, r.guest_name AS guest_firstname, r.guest_lastname, concat(r.guest_name, ' ', r.guest_lastname) AS guest_fullname, r.guest_phone_1 AS guest_phone, r.guest_hotel, pay.status AS payment_status, pay.amount AS payment_amount, pay.currency AS payment_currency, pay.payment_method, pay.created_at AS payment_date, ri.pax, ri.subtotal, ri.notes, ri.start_time, ri.end_time, b.name AS boat_name, pl.name AS plan_name, s.name AS service_name, l.name AS location_name, r.total AS reservation_total, r.reservation_status FROM "Reservation_Items" ri JOIN "Reservations" r ON r.id = ri.reservation_id LEFT JOIN payments pay ON pay.reservation_id = r.id LEFT JOIN "Boat_Plan_Prices" bpp ON bpp.id = ri.boat_plan_price_id LEFT JOIN "Boats" b ON b.id = bpp.boat_id LEFT JOIN "Plans" pl ON pl.id = bpp.plan_id LEFT JOIN "Services" s ON s.id = pl.service_id LEFT JOIN "Locations" l ON l.id = ri.location_id`);