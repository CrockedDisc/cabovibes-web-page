// app/components/PayPalCheckout.tsx
"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { toast } from "sonner";

interface PayPalCheckoutProps {
  cartItems: any[];
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  disabled?: boolean;
}

export default function PayPalCheckout({
  cartItems,
  onSuccess,
  onError,
  disabled = false,
}: PayPalCheckoutProps) {
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // CREATE ORDER
  // ---------------------------
  const createOrder = async () => {
    if (disabled) {
      toast.error("Please complete the checkout form first", {
        position: "top-center",
      });
      throw new Error("Checkout incomplete");
    }

    setLoading(true);

    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to create order");
      if (!data.id) throw new Error("No se recibió order ID");

      return data.id;
    } catch (error) {
      console.error("🔴 Error en createOrder:", error);
      onError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // CAPTURE ORDER
  // ---------------------------
  const captureOrder = async (orderID: string) => {
    const response = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderID }),
    });

    const details = await response.json();

    if (!response.ok) {
      throw new Error(details.error || "Failed to capture order");
    }

    return details;
  };

  // ---------------------------
  // ON APPROVE
  // (PayPal y Tarjeta usan ESTE flujo)
  // ---------------------------
  const onApprove = async (data: any, actions: any) => {
    setLoading(true);

    try {
      if (!data.orderID) {
        throw new Error("No orderID returned from PayPal");
      }

      const result = await captureOrder(data.orderID);
      onSuccess(result);
    } catch (error) {
      console.error("❌ Error in onApprove:", error);
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
        components: "buttons,funding-eligibility",
        enableFunding: "card",
        debug: false, // Cambia a true si necesitas debugging
      }}
    >
      {disabled && (
        <div className="mb-4 p-3 bg-muted rounded-md text-sm text-muted-foreground text-center">
          Complete the checkout form to enable payment
        </div>
      )}

      <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
        <PayPalButtons
          style={{
            disableMaxWidth: true,
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          disabled={loading || disabled}
          forceReRender={[cartItems, disabled]}
        />
      </div>
    </PayPalScriptProvider>
  );
}
