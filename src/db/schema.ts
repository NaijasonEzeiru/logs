import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  username: varchar({ length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  blocked: boolean("blocked").default(false).notNull(),
  lastLoginAt: timestamp("last_login_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const victimsTable = pgTable("victims", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  ownerId: text("owner_id")
    .references(() => usersTable.id)
    .notNull(),
  username: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  trial: integer("trial").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  victims: many(victimsTable),
}));

export const victimsRelations = relations(victimsTable, ({ one }) => ({
  owner: one(usersTable, {
    fields: [victimsTable.ownerId],
    references: [usersTable.id],
  }),
}));

export type Victim = typeof victimsTable.$inferSelect;
export type User = typeof usersTable.$inferSelect;
export type UserWithRelations = typeof usersTable.$inferSelect & {
  victims: Victim[];
};
