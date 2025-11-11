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
  console.log('🔵 CAPTURE - Endpoint llamado');
  
  try {
    const body = await request.json();
    console.log('🔵 CAPTURE - Body recibido:', JSON.stringify(body, null, 2));
    
    const { orderID } = body;
    console.log('🔵 CAPTURE - orderID extraído:', orderID);

    if (!orderID || typeof orderID !== 'string') {
      console.error('🔴 CAPTURE - orderID inválido:', orderID);
      return NextResponse.json(
        { error: 'Order ID is required and must be a string' },
        { status: 400 }
      );
    }

    const ordersController = new OrdersController(paypalClient);
    
    // ✅ Llamada correcta: pasar un objeto con la propiedad 'id'
    console.log('🔵 CAPTURE - Llamando a captureOrder');
    const { result: capture } = await ordersController.captureOrder({
      id: orderID,
      prefer: 'return=representation'
    });
    
    console.log('🔵 CAPTURE - Captura exitosa:', capture.status);

    return NextResponse.json({
      status: capture.status,
      id: capture.id,
      details: capture,
    });
  } catch (error: any) {
    console.error('🔴 CAPTURE - Error:', error);
    console.error('🔴 CAPTURE - Error message:', error.message);
    
    return NextResponse.json(
      {
        error: error.message || 'Failed to capture order',
        details: error.result || error,
      },
      { status: 500 }
    );
  }
}
