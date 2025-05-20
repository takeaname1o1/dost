import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertCallSchema, insertTransactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Login/Register route (simplified for demo - just username, no password)
  app.post("/api/login", async (req, res) => {
    try {
      const { username } = req.body;
      
      if (!username || typeof username !== "string") {
        return res.status(400).json({ message: "Username is required" });
      }
      
      // Check if user exists
      let user = await storage.getUserByUsername(username);
      
      // If not, create new user
      if (!user) {
        user = await storage.createUser({ username });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get companions
  app.get("/api/companions", async (req, res) => {
    try {
      const companions = await storage.getCompanions();
      res.json(companions);
    } catch (error) {
      console.error("Error getting companions:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get calls for user
  app.get("/api/calls", async (req, res) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : null;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const calls = await storage.getCallsByUserId(userId);
      res.json(calls);
    } catch (error) {
      console.error("Error getting calls:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Record a new call
  app.post("/api/calls", async (req, res) => {
    try {
      const callData = insertCallSchema.parse(req.body);
      const call = await storage.createCall(callData);
      res.status(201).json(call);
    } catch (error) {
      console.error("Error creating call:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Update user coins
  app.patch("/api/users/:id/coins", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const { coins } = req.body;
      
      if (typeof coins !== "number" || coins < 0) {
        return res.status(400).json({ message: "Valid coins amount required" });
      }
      
      const updatedUser = await storage.updateUserCoins(userId, coins);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating coins:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Record a transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get transactions for a user
  app.get("/api/transactions", async (req, res) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : null;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const transactions = await storage.getTransactionsByUserId(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error getting transactions:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
