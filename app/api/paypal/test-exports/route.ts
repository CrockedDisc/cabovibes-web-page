// app/api/paypal/test-exports/route.ts
import * as PayPalSDK from '@paypal/paypal-server-sdk';

export async function GET() {
  const exports = Object.keys(PayPalSDK);
  return Response.json({ exports });
}