// Applies pending migrations from ./drizzle. `pnpm start` runs this before the server, so every deploy migrates the database first.
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const connection = postgres(url, { max: 1, onnotice: () => {} });
await migrate(drizzle(connection), { migrationsFolder: "./drizzle" });
await connection.end();
