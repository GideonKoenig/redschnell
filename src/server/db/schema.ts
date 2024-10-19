import { sql } from "drizzle-orm";
import { index, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "~/db/auth";
import { createTable } from "~/server/db/utils";
export {
    users,
    accounts,
    accountsRelations,
    sessions,
    sessionsRelations,
    verificationTokens,
} from "~/db/auth";

export const posts = createTable(
    "post",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 256 }),
        createdById: varchar("created_by", { length: 255 })
            .notNull()
            .references(() => users.id),
        createdAt: timestamp("created_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
            () => new Date(),
        ),
    },
    (example) => ({
        createdByIdIdx: index("created_by_idx").on(example.createdById),
        nameIndex: index("name_idx").on(example.name),
    }),
);
