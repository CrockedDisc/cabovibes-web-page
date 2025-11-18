// app/api/paypal/capture-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment, OrdersController } from '@paypal/paypal-server-sdk';

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
    
    const { orderID } = body;

    if (!orderID || typeof orderID !== 'string') {
      return NextResponse.json(
        { error: 'Order ID is required and must be a string' },
        { status: 400 }
      );
    }

    const ordersController = new OrdersController(paypalClient);
    
    const { result: capture } = await ordersController.captureOrder({
      id: orderID,
      prefer: 'return=representation'
    });
    
    return NextResponse.json({
      status: capture.status,
      id: capture.id,
      details: capture,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || 'Failed to capture order',
        details: error.result || error,
      },
      { status: 500 }
    );
  }
}
