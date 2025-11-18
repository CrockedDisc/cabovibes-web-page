// app/api/paypal/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment, OrdersController, CheckoutPaymentIntent } from '@paypal/paypal-server-sdk';

// Inicializar el cliente de PayPal
const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID || "",
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
  },
  environment: process.env.PAYPAL_MODE === 'live' ? Environment.Production : Environment.Sandbox,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItems } = body;
    const ordersController = new OrdersController(paypalClient);

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    const total = cartItems.reduce((sum: number, item: any) => sum + item.subtotal, 0);

    // Solo dos argumentos: el request body y (opcional) opciones/prefs
    const collect = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: 'USD',
              value: total.toFixed(2),
            },
          },
        ],
      },
      prefer: 'return=representation',
    };
    // El segundo argumento (prefer) puede pasarse en un options object si es necesario
    const { result: order } = await ordersController.createOrder(collect);
    return NextResponse.json({ id: order.id });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || 'Failed to create order',
        details: error,
      },
      { status: 500 }
    );
  }
}
