import { type Config } from "drizzle-kit";
import { env } from "~/env";

// After changing the schema, run `pnpm db:generate` and commit the new file in ./drizzle. Deploys apply it on start.
export default {
    schema: "./src/server/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
} satisfies Config;
