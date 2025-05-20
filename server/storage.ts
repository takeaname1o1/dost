import { 
  users, type User, type InsertUser,
  companions, type Companion, type InsertCompanion,
  calls, type Call, type InsertCall,
  transactions, type Transaction, type InsertTransaction
} from "@shared/schema";
import { sampleCompanions } from "../client/src/utils/mock-data";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCoins(id: number, coins: number): Promise<User | undefined>;
  
  // Companion operations
  getCompanions(): Promise<Companion[]>;
  getCompanion(id: number): Promise<Companion | undefined>;
  
  // Call operations
  getCalls(): Promise<Call[]>;
  getCallsByUserId(userId: number): Promise<Call[]>;
  createCall(call: InsertCall): Promise<Call>;
  
  // Transaction operations
  getTransactions(): Promise<Transaction[]>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        coins: 750, // Start with 750 coins
      })
      .returning();
    return user;
  }
  
  async updateUserCoins(id: number, coins: number): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ coins })
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }
  
  // Companion operations
  async getCompanions(): Promise<Companion[]> {
    return await db.select().from(companions);
  }
  
  async getCompanion(id: number): Promise<Companion | undefined> {
    const [companion] = await db.select().from(companions).where(eq(companions.id, id));
    return companion || undefined;
  }
  
  // Call operations
  async getCalls(): Promise<Call[]> {
    return await db.select().from(calls);
  }
  
  async getCallsByUserId(userId: number): Promise<Call[]> {
    return await db.select().from(calls).where(eq(calls.userId, userId));
  }
  
  async createCall(callData: InsertCall): Promise<Call> {
    const [call] = await db.insert(calls).values(callData).returning();
    return call;
  }
  
  // Transaction operations
  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions);
  }
  
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }
  
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(transactionData).returning();
    return transaction;
  }
}

// Initialize the database with sample companions
async function initializeCompanions() {
  try {
    const existingCompanions = await db.select().from(companions);
    
    // Only seed if no companions exist yet
    if (existingCompanions.length === 0) {
      console.log("Seeding companions data...");
      await db.insert(companions).values(sampleCompanions);
    }
  } catch (error) {
    console.error("Error initializing companions:", error);
  }
}

// Initialize the database
initializeCompanions();

export const storage = new DatabaseStorage();
