import { sql } from "drizzle-orm";
import { index, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "~/server/db/auth";
import { createTable } from "~/server/db/utils";
export { users, accounts, accountsRelations, verificationTokens } from "~/server/db/auth";

/**
model Chat {
    id        String   @id @default(cuid())
    name      String
    createdAt DateTime @default(now())
    lastUsed  DateTime @default(now())
    model     String
    messages  String // When changing to postgres -> change to String[]
    meeting   Meeting  @relation(fields: [meetingId], references: [id])
    meetingId String

    @@index([id])
}

model Summary {
    id          String    @id @default(cuid())
    createdAt   DateTime?
    model       String?
    summary     String?
    status      String // When changing to postgres -> change status to Enum from String
    meeting     Meeting   @relation(fields: [meetingId], references: [id])
    meetingId   String    @unique
    rawResponse String? // When changing to postgres -> change rawResponses to Json from String

    @@index([id])
}

model Transcript {
    id                   String    @id @default(cuid())
    createdAt            DateTime?
    model                String?
    text                 String?
    transcriptParagraphs String?
    status               String // When changing to postgres -> change status to Enum from String
    meeting              Meeting   @relation(fields: [meetingId], references: [id])
    meetingId            String    @unique
    rawResponse          String? // When changing to postgres -> change rawResponses to Json from String

    @@index([id])
}

model Meeting {
    id          String          @id @default(cuid())
    name        String
    createdAt   DateTime        @default(now())
    url         String
    createdBy   User            @relation(fields: [createdById], references: [id])
    createdById String
    user        MeetingToUser[]
    transcript  Transcript?
    summary     Summary?
    chats       Chat[]

    @@index([id])
}

model MeetingToUser {
    meeting   Meeting @relation(fields: [meetingId], references: [id])
    meetingId String
    user      User    @relation(fields: [userId], references: [id])
    userId    String

    @@id([meetingId, userId])
}
*/

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
        updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
    },
    (example) => ({
        createdByIdIdx: index("created_by_idx").on(example.createdById),
        nameIndex: index("name_idx").on(example.name),
    }),
);
