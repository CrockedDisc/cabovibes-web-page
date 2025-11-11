// app/checkout/page.tsx
"use client";

import PayPalCheckout from "@/components/PayPalCheckout";
import { useReservationStore } from "@/lib/stores/reservation-store";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  
  // Tus items del carrito (de Zustand)
  const cartItems = useReservationStore((state) => state.items); // obtener de tu store

  const handleSuccess = (details: any) => {
    console.log("Payment successful:", details);
    // Guardar la orden en tu base de datos
    // Limpiar el carrito
    // Redirigir a página de confirmación
    router.push(`/order-confirmation/${details.id}`);
  };

  const handleError = (error: any) => {
    console.error("Payment error:", error);
    // Mostrar mensaje de error al usuario
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <PayPalCheckout
        cartItems={cartItems}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}
