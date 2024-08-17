import {
  date,
  pgTable,
  serial,
  text,
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable("users_table", {
  id: serial("id").primaryKey(),
  fullName: text("fullname").notNull(),
  clerkId: text("clerkId").notNull().unique(),
  type: text("type").notNull(),
  createdAt: date("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: date("updatedAt", { mode: "date" }),
});
