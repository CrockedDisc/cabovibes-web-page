// db/index.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./relations";

// ✅ Singleton pattern para evitar múltiples conexiones
declare global {
  var dbClient: postgres.Sql | undefined;
}

// ✅ Reutilizar la conexión existente o crear una nueva
const client = global.dbClient ?? postgres(process.env.DATABASE_URL_SESSION!, {
  prepare: false,
  max: 10, // Número máximo de conexiones en el pool
  idle_timeout: 20, // Cerrar conexiones inactivas después de 20 segundos
  connect_timeout: 10, // Timeout para establecer conexión
});

// ✅ En desarrollo, guardar la conexión en global para reutilizarla
if (process.env.NODE_ENV !== 'production') {
  global.dbClient = client;
}

export const db = drizzle(client, {
  schema: {
    ...schema,
    ...relations,
  },
  casing: "snake_case",
});

if (process.env.NODE_ENV !== 'production') {
  process.on('SIGINT', async () => {
    await client.end();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await client.end();
    await client.end();
    process.exit(0);
  });
}

export * from './schema';
export * from './relations';

