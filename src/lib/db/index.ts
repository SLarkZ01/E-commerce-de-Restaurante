import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as esquema from "./schema";

const cliente = postgres(process.env.DATABASE_URL!, {
  prepare: false,
});

export const db = drizzle({ client: cliente, schema: esquema });
