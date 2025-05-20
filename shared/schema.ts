import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  coins: integer("coins").notNull().default(750),
});

export const companions = pgTable("companions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  languages: text("languages").notNull(),
  interests: text("interests").notNull(),
  imageUrl: text("image_url").notNull(),
  isOnline: boolean("is_online").notNull().default(true),
});

export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  companionId: integer("companion_id").notNull(),
  startTime: timestamp("start_time").notNull().defaultNow(),
  duration: integer("duration").notNull(), // in seconds
  type: text("type").notNull(), // "audio" or "video"
  coinsSpent: integer("coins_spent").notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  coins: integer("coins").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCompanionSchema = createInsertSchema(companions).omit({ id: true });
export const insertCallSchema = createInsertSchema(calls).omit({ id: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Companion = typeof companions.$inferSelect;
export type InsertCompanion = z.infer<typeof insertCompanionSchema>;

export type Call = typeof calls.$inferSelect;
export type InsertCall = z.infer<typeof insertCallSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
