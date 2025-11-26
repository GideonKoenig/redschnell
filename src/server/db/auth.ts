import { relations } from "drizzle-orm";
import {
    index,
    text,
    timestamp,
    boolean,
    varchar,
    pgEnum,
} from "drizzle-orm/pg-core";
import { DEFAULT_MODEL } from "~/lib/transcription-models";
import { createTable } from "~/server/db/utils";

export const userRoleEnum = pgEnum("user_role", ["free", "paid", "admin"]);

export const user = createTable(
    "user",
    {
        id: varchar("id", { length: 255 }).notNull().primaryKey(),
        name: varchar("name", { length: 255 }),
        email: varchar("email", { length: 255 }).notNull().unique(),
        emailVerified: boolean("email_verified").notNull().default(false),
        image: varchar("image", { length: 255 }),
        role: userRoleEnum("role").notNull().default("free"),
        autoTranscribe: boolean("auto_transcribe").notNull().default(false),
        transcriptionModel: varchar("transcription_model", { length: 64 })
            .notNull()
            .default(DEFAULT_MODEL),
        showTimestamps: boolean("show_timestamps").notNull().default(true),
        showSpeakers: boolean("show_speakers").notNull().default(true),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
    },
    (u) => ({
        emailIdx: index("user_email_idx").on(u.email),
    }),
);

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
}));

export const session = createTable(
    "session",
    {
        id: varchar("id", { length: 255 }).notNull().primaryKey(),
        userId: varchar("user_id", { length: 255 })
            .notNull()
            .references(() => user.id),
        token: varchar("token", { length: 255 }).notNull().unique(),
        expiresAt: timestamp("expires_at").notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
    },
    (s) => ({
        userIdIdx: index("session_user_id_idx").on(s.userId),
        tokenIdx: index("session_token_idx").on(s.token),
    }),
);

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const account = createTable(
    "account",
    {
        id: varchar("id", { length: 255 }).notNull().primaryKey(),
        userId: varchar("user_id", { length: 255 })
            .notNull()
            .references(() => user.id),
        accountId: varchar("account_id", { length: 255 }).notNull(),
        providerId: varchar("provider_id", { length: 255 }).notNull(),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        idToken: text("id_token"),
        password: text("password"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
    },
    (a) => ({
        userIdIdx: index("account_user_id_idx").on(a.userId),
    }),
);

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const verification = createTable(
    "verification",
    {
        id: varchar("id", { length: 255 }).notNull().primaryKey(),
        identifier: varchar("identifier", { length: 255 }).notNull(),
        value: varchar("value", { length: 255 }).notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
    },
    (v) => ({
        identifierIdx: index("verification_identifier_idx").on(v.identifier),
    }),
);
