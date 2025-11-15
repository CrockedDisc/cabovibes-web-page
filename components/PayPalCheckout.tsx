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
import { toast } from "sonner";
interface PayPalCheckoutProps {
  cartItems: any[];
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  disabled?: boolean;
}

function SubmitPayment({ isPaying, disabled }: { isPaying: boolean; disabled?: boolean }) {
  const { cardFieldsForm } = usePayPalCardFields();

  const handleClick = async () => {
    if (disabled) {
      toast.error("Please complete the checkout form first", {
        position: "top-center",
      });
      return;
    }
    
    if (!cardFieldsForm) {
      toast.error("Please complete all card fields", {
        position: "top-center",
      });
      return;
    }
    try {
      const state = await cardFieldsForm.getState();
      if (!state.isFormValid) {
        toast.error("Please complete all card fields", {
          position: "top-center",
        });
        return;
      }
      console.log("Card state before submit:", state.cards); // Muestra { number: { brand: 'visa' } }
      await cardFieldsForm.submit();
    } catch (error: any) {
      console.error("Error al procesar el pago con tarjeta:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPaying || disabled}
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 mt-4"
    >
      {isPaying ? "Processing..." : disabled ? "Complete Checkout First" : "Pay Now"}
    </button>
  );
}

export default function PayPalCheckout({
  cartItems,
  onSuccess,
  onError,
  disabled = false,
}: PayPalCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    setLoading(true);
    try {
      console.log("🔵 createOrder - Enviando cartItems:", cartItems);

      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems }),
      });

      const data = await response.json();
      console.log("🔵 createOrder - Order ID creado:", data.id);

      if (!response.ok) throw new Error(data.error || "Failed to create order");
      if (!data.id) throw new Error("No se recibió order ID");

      return data.id;
    } catch (error) {
      console.error("🔴 Error en createOrder:", error);
      setLoading(false);
      onError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Para PayPalButtons (async, con actions)
  const onApproveButtons = async (data: any, actions: any) => {
    setLoading(true);
    try {
      console.log("🟢 onApproveButtons - Data:", data);
      const orderID = data.orderID;

      if (!orderID) {
        throw new Error("No orderID en PayPal Buttons");
      }

      await captureOrder(orderID);
    } catch (error) {
      console.error("🔴 Error en onApproveButtons:", error);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Para Card Fields (NO async, solo data)
  const onApproveCardFields = (data: { orderID: string }) => {
    console.log("🟢 onApproveCardFields - Data:", data);
    console.log("🟢 onApproveCardFields - orderID:", data.orderID);

    if (!data.orderID) {
      console.error("🔴 No orderID en Card Fields");
      onError(new Error("No orderID received from Card Fields"));
      return;
    }

    // Llamar a captureOrder de forma asíncrona pero sin await
    setLoading(true);
    captureOrder(data.orderID)
      .catch((error) => {
        console.error("🔴 Error en onApproveCardFields:", error);
        onError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Función auxiliar para capturar la orden
  const captureOrder = async (orderID: string) => {
    console.log("🟢 captureOrder - Capturando orderID:", orderID);

    const response = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderID }),
    });

    const details = await response.json();
    console.log("🟢 captureOrder - Response:", details);

    if (!response.ok) {
      throw new Error(details.error || "Failed to capture order");
    }

    onSuccess(details);
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
        intent: "capture",
        components: "buttons,card-fields",
        enableFunding: "card",
        debug: true,
      }}
    >
      {disabled && (
        <div className="mb-4 p-3 bg-muted rounded-md text-sm text-muted-foreground text-center">
          Complete the checkout form to enable payment
        </div>
      )}
      
      <div className={`space-y-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Botones de PayPal */}
        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-3">Pay with PayPal</h3>
          <PayPalButtons
            style={{
              disableMaxWidth: true,
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal",
            }}
            disabled={loading || disabled}
            createOrder={createOrder}
            onApprove={onApproveButtons}
            onError={onError}
          />
        </div>

        {/* Separador */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or pay with credit card
            </span>
          </div>
        </div>

        {/* Card Fields */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Pay with Credit Card</h3>
          <PayPalCardFieldsProvider
            createOrder={createOrder}
            onApprove={onApproveCardFields}
            onError={onError}
          >
            <PayPalCardFieldsForm />
            <SubmitPayment isPaying={loading} disabled={disabled} />
          </PayPalCardFieldsProvider>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
