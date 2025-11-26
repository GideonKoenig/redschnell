import { relations, sql } from "drizzle-orm";
import {
    index,
    integer,
    json,
    pgEnum,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { user } from "~/server/db/auth";
import { createTable } from "~/server/db/utils";

export {
    userRoleEnum,
    user,
    userRelations,
    account,
    accountRelations,
    session,
    sessionRelations,
    verification,
} from "~/server/db/auth";

export const sources = createTable(
    "source",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: varchar("name", { length: 512 }).notNull(),
        url: varchar("url", { length: 1024 }).notNull(),
        duration: integer("duration"),
        owner: varchar("owner", { length: 255 })
            .notNull()
            .references(() => user.id),
        createdAt: timestamp("created_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (source) => ({
        idIdx: index("source_id_idx").on(source.id),
        ownerIdx: index("source_owner_idx").on(source.owner),
    }),
);

export const sourcesRelations = relations(sources, ({ one }) => ({
    owner: one(user, { fields: [sources.owner], references: [user.id] }),
    transcript: one(transcripts),
}));

export const transcriptStatusEnum = pgEnum("transcript_status", [
    "pending",
    "processing",
    "completed",
    "failed",
]);

export const transcriptionModelEnum = pgEnum("transcription_model", [
    "fal-ai/whisper",
    "fal-ai/wizper",
]);

export const transcripts = createTable(
    "transcript",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        sourceId: uuid("source_id")
            .notNull()
            .unique()
            .references(() => sources.id, { onDelete: "cascade" }),
        status: transcriptStatusEnum("status").notNull().default("pending"),
        model: transcriptionModelEnum("model").notNull(),
        content: json("content"),
        processedContent: json("processed_content"),
        error: varchar("error", { length: 1024 }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        completedAt: timestamp("completed_at", { withTimezone: true }),
    },
    (transcript) => ({
        idIdx: index("transcript_id_idx").on(transcript.id),
        sourceIdIdx: index("transcript_source_id_idx").on(transcript.sourceId),
    }),
);

export const transcriptsRelations = relations(transcripts, ({ one }) => ({
    source: one(sources, {
        fields: [transcripts.sourceId],
        references: [sources.id],
    }),
}));
