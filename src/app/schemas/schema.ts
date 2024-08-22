import {
  relations,
  sql,
} from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const role = pgEnum("role", ["user", "assistant"]);
export const plans = pgEnum("plans", ["STANDARD", "PRO", "ULTIMATE"]);

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
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
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  icon: varchar("icon").notNull(),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
  campaignId: uuid("campaignId").references(() => campaigns.id),
});

// ChatBot Table
export const chatBot = pgTable("chat_bot", {
  id: uuid("id").primaryKey().defaultRandom(),
  welcomeMessage: text("welcome_message"),
  icon: text("icon"),
  background: text("background"),
  textColor: text("text_color"),
  helpdesk: boolean("helpdesk").default(false),
  domainId: uuid("domain_id").references(() => domain.id, {
    onDelete: "cascade",
  }),
});

// Billings Table
export const billings = pgTable("billings", {
  id: uuid("id").primaryKey().defaultRandom(),
  plan: plans("plan").notNull().default("STANDARD"),
  credits: integer("credits").default(10),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
});

// HelpDesk Table
export const helpDesk = pgTable("help_desk", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  domainId: uuid("domain_id").references(() => domain.id, {
    onDelete: "cascade",
  }),
});

// FilterQuestions Table
export const filterQuestions = pgTable("filter_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answered: text("answered"),
  domainId: uuid("domain_id").references(() => domain.id, {
    onDelete: "cascade",
  }),
});

// CustomerResponses Table
export const customerResponses = pgTable("customer_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answered: text("answered"),
  customerId: uuid("customer_id").references(() => customer.id, {
    onDelete: "cascade",
  }),
});

// ChatRoom Table
export const chatRooms = pgTable("chat_room", {
  id: uuid("id").primaryKey().defaultRandom(),
  live: boolean("live").default(false),
  mailed: boolean("mailed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  customerId: uuid("customer_id").references(() => customer.id, {
    onDelete: "cascade",
  }),
});

// ChatMessage Table
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  message: varchar("message").notNull(),
  role: role("role"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  chatRoomId: uuid("chat_room_id").references(() => chatRooms.id, {
    onDelete: "cascade",
  }),
  seen: boolean("seen").default(false),
});

// Customer Table
export const customer = pgTable("customer", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email"),
  domainId: uuid("domain_id").references(() => domain.id, {
    onDelete: "cascade",
  }),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date").notNull(),
  slot: text("slot").notNull(),
  email: text("email").notNull(),
  customerId: uuid("customer_id").references(() => customer.id, {
    onDelete: "cascade",
  }),
  domainId: uuid("domainId").defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Campaign table
export const campaigns = pgTable("campaigns", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  customers: text("customers").array().notNull(),
  template: text("template"),
  userId: uuid("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Campaign table
export const products = pgTable("products", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: uuid("price").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  domainId: uuid("domain_id").references(() => domain.id, {
    onDelete: "cascade",
  }),
});

export const campaignRelations = relations(campaigns, ({ many }) => ({
  domain: many(domain),
}));

export const userRelations = relations(users, ({ many }) => ({
  domain: many(domain),
  campaign: many(campaigns),
  subscription: many(billings),
}));

export const domainRelations = relations(domain, ({ one, many }) => ({
  user: one(users, {
    fields: [domain.userId],
    references: [users.id],
  }),
  campaign: one(campaigns, {
    fields: [domain.campaignId],
    references: [campaigns.id],
  }),
  chatBot: one(chatBot),
  helpdesk: many(helpDesk),
  filterQuestions: many(filterQuestions),
  products: many(products),
  customers: many(customer),
}));

export const chatRoomRelations = relations(chatRooms, ({ many }) => ({
  messages: many(chatMessages),
}));

export const customerRelations = relations(customer, ({ many }) => ({
  questions: many(customerResponses),
  chatRoom: many(chatRooms),
  booking: many(bookings),
}));
