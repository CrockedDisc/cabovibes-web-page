import { relations } from "drizzle-orm/relations";
import { boatPlanPrices, reservationItems, locations, reservations, serviceTimeSlots, partners, boats, services, boatsMedia, amenities, planAmenities, payments, plans, locationDepartures } from "./schema";

export const reservationItemsRelations = relations(reservationItems, ({one}) => ({
	boatPlanPrice: one(boatPlanPrices, {
		fields: [reservationItems.boatPlanPriceId],
		references: [boatPlanPrices.id]
	}),
	location: one(locations, {
		fields: [reservationItems.locationId],
		references: [locations.id]
	}),
	reservation: one(reservations, {
		fields: [reservationItems.reservationId],
		references: [reservations.id]
	}),
	serviceTimeSlot: one(serviceTimeSlots, {
		fields: [reservationItems.serviceTimeSlotId],
		references: [serviceTimeSlots.id]
	}),
}));

export const boatPlanPricesRelations = relations(boatPlanPrices, ({one, many}) => ({
	reservationItems: many(reservationItems),
	planAmenities: many(planAmenities),
	boat: one(boats, {
		fields: [boatPlanPrices.boatId],
		references: [boats.id]
	}),
	plan: one(plans, {
		fields: [boatPlanPrices.planId],
		references: [plans.id]
	}),
}));

export const locationsRelations = relations(locations, ({many}) => ({
	reservationItems: many(reservationItems),
	locationDepartures: many(locationDepartures),
}));

export const reservationsRelations = relations(reservations, ({many}) => ({
	reservationItems: many(reservationItems),
	payments: many(payments),
}));

export const serviceTimeSlotsRelations = relations(serviceTimeSlots, ({one, many}) => ({
	reservationItems: many(reservationItems),
	service: one(services, {
		fields: [serviceTimeSlots.serviceId],
		references: [services.id]
	}),
}));

export const boatsRelations = relations(boats, ({one, many}) => ({
	partner: one(partners, {
		fields: [boats.partnerId],
		references: [partners.id]
	}),
	boatsMedias: many(boatsMedia),
	boatPlanPrices: many(boatPlanPrices),
	locationDepartures: many(locationDepartures),
}));

export const partnersRelations = relations(partners, ({many}) => ({
	boats: many(boats),
}));

export const servicesRelations = relations(services, ({many}) => ({
	serviceTimeSlots: many(serviceTimeSlots),
	plans: many(plans),
}));

export const boatsMediaRelations = relations(boatsMedia, ({one}) => ({
	boat: one(boats, {
		fields: [boatsMedia.boatId],
		references: [boats.id]
	}),
}));

export const planAmenitiesRelations = relations(planAmenities, ({one}) => ({
	amenity: one(amenities, {
		fields: [planAmenities.amenityId],
		references: [amenities.id]
	}),
	boatPlanPrice: one(boatPlanPrices, {
		fields: [planAmenities.boatPlanPriceId],
		references: [boatPlanPrices.id]
	}),
}));

export const amenitiesRelations = relations(amenities, ({many}) => ({
	planAmenities: many(planAmenities),
}));

export const paymentsRelations = relations(payments, ({one}) => ({
	reservation: one(reservations, {
		fields: [payments.reservationId],
		references: [reservations.id]
	}),
}));

export const plansRelations = relations(plans, ({one, many}) => ({
	boatPlanPrices: many(boatPlanPrices),
	service: one(services, {
		fields: [plans.serviceId],
		references: [services.id]
	}),
}));

export const locationDeparturesRelations = relations(locationDepartures, ({one}) => ({
	boat: one(boats, {
		fields: [locationDepartures.boatId],
		references: [boats.id]
	}),
	location: one(locations, {
		fields: [locationDepartures.locationId],
		references: [locations.id]
	}),
}));