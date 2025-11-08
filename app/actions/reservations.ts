'use server';

import { getReservedDates } from '@/db/queries/reservations';

export async function fetchReservedDates(boatPlanPriceId: number) {
  return await getReservedDates(boatPlanPriceId);
}