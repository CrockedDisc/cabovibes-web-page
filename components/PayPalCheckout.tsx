// app/components/PayPalCheckout.tsx
"use client";
import {
  PayPalScriptProvider,
  PayPalButtons,
  PayPalCardFieldsProvider,
  PayPalCardFieldsForm,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import { useState } from "react";

interface PayPalCheckoutProps {
  cartItems: any[];
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

function SubmitPayment({ isPaying }: { isPaying: boolean }) {
  const { cardFieldsForm } = usePayPalCardFields();

  const handleClick = async () => {
    if (!cardFieldsForm) {
      alert("Los campos de tarjeta no están disponibles. Verifica la configuración de PayPal.");
      return;
    }
    try {
      const state = await cardFieldsForm.getState();
      if (!state.isFormValid) {
        alert("Por favor completa todos los campos de la tarjeta.");
        return;
      }
      await cardFieldsForm.submit();
    } catch {
      alert("Error al procesar el pago con tarjeta. Intenta de nuevo.");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPaying}
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 mt-4"
    >
      {isPaying ? "Procesando..." : "Pagar con Tarjeta"}
    </button>
  );
}

export default function PayPalCheckout({
  cartItems,
  onSuccess,
  onError,
}: PayPalCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create order");
      return data.id;
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async ({ orderID }: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID }),
      });
      const details = await response.json();
      if (!response.ok) throw new Error(details.error || "Failed to capture order");
      onSuccess(details);
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
        intent: "capture",
        components: "buttons,card-fields",
        enableFunding: "card",
        debug: process.env.NODE_ENV === "development",
      }}
    >
      <div className="space-y-6">
        {/* Botones de PayPal */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Pagar con PayPal</h3>
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal",
            }}
            disabled={loading}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
          />
        </div>
        {/* Separador */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O paga con tarjeta</span>
          </div>
        </div>
        {/* Card Fields */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Pagar con Tarjeta</h3>
          <PayPalCardFieldsProvider
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
          >
            <PayPalCardFieldsForm />
            <SubmitPayment isPaying={loading} />
          </PayPalCardFieldsProvider>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
