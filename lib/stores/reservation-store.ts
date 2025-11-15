// lib/stores/reservation-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ReservationItem = {
  id: string;
  boatId: number;
  boatPlanPriceId: number;
  boatName: string;
  boatImage: string | null;
  planName: string;
  selectedDate: string;
  timeSlot: { id: number; name: string; startTime: string; endTime: string };
  people: number;
  freePax: number;
  basePrice: number;
  pricePerPerson: number;
  subtotal: number;
  locationId: number;
  notes?: string;
};

export type CheckoutData = {
  name: string;
  lastname: string;
  email: string;
  phones: { phone: string }[];
  hotel?: string;
  reservation_number?: string;
  room_number?: string;
  medic_note?: string;
};

interface ReservationStore {
  items: ReservationItem[];
  checkoutData: CheckoutData | null;
  isCheckoutComplete: boolean;

  addToCart: (
    item: Omit<ReservationItem, "selectedDate"> & { selectedDate: Date }
  ) => void;
  removeFromCart: (id: string) => void;
  updatePeople: (id: string, people: number) => void;
  getTotal: () => number;
  clearCart: () => void;
  setCheckoutData: (data: CheckoutData) => void;
  setCheckoutComplete: (complete: boolean) => void;
  clearReservation: () => void;
}

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set, get) => ({
      items: [],
      checkoutData: null,
      isCheckoutComplete: false,

      addToCart: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              selectedDate: item.selectedDate.toISOString(),
              // ✅ Asegurar que notes tenga un valor por defecto si no viene
              notes: item.notes || '',
            },
          ],
        })),

      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updatePeople: (id, people) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const extraPeople = Math.max(0, people - item.freePax);
              const subtotal =
                item.basePrice + extraPeople * item.pricePerPerson;
              return { ...item, people, subtotal };
            }
            return item;
          }),
        })),

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.subtotal, 0);
      },

      clearCart: () => set({ items: [] }),

      setCheckoutData: (data) => set({ checkoutData: data }),

      setCheckoutComplete: (complete) => set({ isCheckoutComplete: complete }),

      clearReservation: () =>
        set({
          items: [],
          checkoutData: null,
          isCheckoutComplete: false,
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
