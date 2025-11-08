// lib/stores/reservation-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ReservationItem = {
  id: string; // UUID o timestamp
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
};

interface ReservationStore {
  items: ReservationItem[];

  // Agregar al carrito
  addToCart: (
    item: Omit<ReservationItem, "selectedDate"> & { selectedDate: Date }
  ) => void;

  // Remover del carrito
  removeFromCart: (id: string) => void;

  // Actualizar cantidad de personas
  updatePeople: (id: string, people: number) => void;

  // Obtener total
  getTotal: () => number;

  // Limpiar carrito
  clearCart: () => void;
}

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              selectedDate: item.selectedDate.toISOString(), // ✅ Convertir Date a string
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
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
