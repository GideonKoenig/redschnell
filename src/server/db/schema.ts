import { sql } from "drizzle-orm";
import { index, json, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "~/server/db/auth";
import { createTable } from "~/server/db/utils";
export {
    users,
    accounts,
    accountsRelations,
    verificationTokens,
} from "~/server/db/auth";

export const files = createTable(
    "files",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        baseId: uuid("baseId"),
        type: varchar("type", { length: 64 }).notNull(),
        name: varchar("name", { length: 512 }).default("").notNull(),
        url: varchar("url", { length: 1024 }).notNull(),
        owner: varchar("owner", { length: 255 })
            .notNull()
            .references(() => users.id),
        createdAt: timestamp("created_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (sample) => ({
        idIdx: index("files_id_idx").on(sample.id),
        ownerIndex: index("files_owner_idx").on(sample.owner),
    }),
);

export const models = createTable(
    "models",
    {
        name: varchar("name", { length: 512 }).primaryKey(),
        type: varchar("type", { length: 64 }).notNull(),
    },
    (sample) => ({
        nameIdx: index("models_name_idx").on(sample.name),
    }),
);

export const transcripts = createTable(
    "transcripts",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        fileId: uuid("fileId")
            .notNull()
            .references(() => files.id),
        model: varchar("name", { length: 512 })
            .notNull()
            .references(() => models.name),
        transcript: json("transcript").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (sample) => ({
        fileIdIdx: index("transcripts_fileId_idx").on(sample.fileId),
        idIndex: index("transcriptsid_idx").on(sample.id),
    }),
);

export const chats = createTable(
    "chats",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        owner: varchar("owner", { length: 255 })
            .notNull()
            .references(() => users.id),
        name: varchar("name", { length: 512 }).default("").notNull(),
        model: varchar("name", { length: 512 })
            .notNull()
            .references(() => models.name),
        createdAt: timestamp("created_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (sample) => ({
        idIdx: index("chats_id_idx").on(sample.id),
        ownerIndex: index("chats_owner_idx").on(sample.owner),
    }),
);

export const messages = createTable(
    "messages",
    {
        chatId: uuid("id")
            .notNull()
            .references(() => chats.id),
        role: varchar("role", { length: 64 }).notNull(),
        text: varchar("text").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (sample) => ({
        chatIdIdx: index("messages_chatId_idx").on(sample.chatId),
    }),
);
