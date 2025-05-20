import { 
  users, type User, type InsertUser,
  companions, type Companion, type InsertCompanion,
  calls, type Call, type InsertCall,
  transactions, type Transaction, type InsertTransaction
} from "@shared/schema";
import { sampleCompanions } from "../client/src/utils/mock-data";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companions: Map<number, Companion>;
  private calls: Map<number, Call>;
  private transactions: Map<number, Transaction>;
  
  private userIdCounter: number;
  private callIdCounter: number;
  private transactionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.companions = new Map();
    this.calls = new Map();
    this.transactions = new Map();
    
    this.userIdCounter = 1;
    this.callIdCounter = 1;
    this.transactionIdCounter = 1;
    
    // Initialize with sample companions
    this.initCompanions();
  }

  private initCompanions() {
    sampleCompanions.forEach(companion => {
      this.companions.set(companion.id, companion);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...userData, id, coins: 750 }; // Start with 750 coins
    this.users.set(id, user);
    return user;
  }
  
  async updateUserCoins(id: number, coins: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, coins };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Companion operations
  async getCompanions(): Promise<Companion[]> {
    return Array.from(this.companions.values());
  }
  
  async getCompanion(id: number): Promise<Companion | undefined> {
    return this.companions.get(id);
  }
  
  // Call operations
  async getCalls(): Promise<Call[]> {
    return Array.from(this.calls.values());
  }
  
  async getCallsByUserId(userId: number): Promise<Call[]> {
    return Array.from(this.calls.values()).filter(
      (call) => call.userId === userId
    );
  }
  
  async createCall(callData: InsertCall): Promise<Call> {
    const id = this.callIdCounter++;
    const call: Call = { ...callData, id };
    this.calls.set(id, call);
    return call;
  }
  
  // Transaction operations
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }
  
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId
    );
  }
  
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const transaction: Transaction = { 
      ...transactionData, 
      id, 
      timestamp: new Date() 
    };
    this.transactions.set(id, transaction);
    return transaction;
  }
}

export const storage = new MemStorage();
