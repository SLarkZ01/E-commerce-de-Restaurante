import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as esquema from "./schema";

const cliente = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  ssl: "require",
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle({ client: cliente, schema: esquema });
