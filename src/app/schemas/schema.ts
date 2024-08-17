import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("fullname").notNull(),
  clerkId: text("clerkId").notNull().unique(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  stripeId: text("stripe_id"),
});

// Domain Table
export const domain = pgTable("domain", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
});

// ChatBot Table
export const chatBot = pgTable("chat_bot", {
  id: serial("id").primaryKey(),
  welcomeMessage: text("welcome_message"),
  icon: text("icon"),
  background: text("background"),
  textColor: text("text_color"),
  helpdesk: boolean("helpdesk").default(false),
});

// Billings Table
export const billings = pgTable("billings", {
  id: serial("id").primaryKey(),
  credits: integer("credits").default(10),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
});

// HelpDesk Table
export const helpDesk = pgTable("help_desk", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  domainId: integer("domain_id").references(() => domain.id, {
    onDelete: "cascade",
  }),
});

// FilterQuestions Table
export const filterQuestions = pgTable("filter_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answered: text("answered"),
  domainId: integer("domain_id").references(() => domain.id, {
    onDelete: "cascade",
  }),
});

// CustomerResponses Table
export const customerResponses = pgTable("customer_responses", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answered: text("answered"),
});

// ChatRoom Table
export const chatRoom = pgTable("chat_room", {
  id: serial("id").primaryKey(),
  live: boolean("live").default(false),
  mailed: boolean("mailed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  customerId: integer("customer_id").references(() => customer.id, {
    onDelete: "cascade",
  }),
});

// ChatMessage Table
export const chatMessage = pgTable("chat_message", {
  id: serial("id").primaryKey(),
  message: varchar("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  chatRoomId: integer("chat_room_id").references(() => chatRoom.id, {
    onDelete: "cascade",
  }),
});

// Customer Table
export const customer = pgTable("customer", {
  id: serial("id").primaryKey(),
  email: text("email"),
  domainId: integer("domain_id").references(() => domain.id, {
    onDelete: "cascade",
  }),
});

export const chatRoomRelations = relations(chatRoom, ({ many }) => ({
  messages: many(chatMessage),
}));

export const chatMessageRelations = relations(chatMessage, ({ one }) => ({
  chatRoom: one(chatRoom),
}));

export const customerRelations = relations(customer, ({ many }) => ({
  responses: many(customerResponses),
  chatRooms: many(chatRoom),
}));
