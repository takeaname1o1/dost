import { db } from "../server/db";
import { users, companions, calls, transactions } from "../shared/schema";
import { sampleCompanions } from "../client/src/utils/mock-data";

async function createTables() {
  console.log("Creating database tables...");
  
  try {
    // Create tables
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        coins INTEGER NOT NULL DEFAULT 750
      );

      CREATE TABLE IF NOT EXISTS companions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        languages TEXT NOT NULL,
        interests TEXT NOT NULL,
        image_url TEXT NOT NULL,
        is_online BOOLEAN NOT NULL DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS calls (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        companion_id INTEGER NOT NULL,
        start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        duration INTEGER NOT NULL,
        type TEXT NOT NULL,
        coins_spent INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        coins INTEGER NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database tables created successfully!");
    
    // Seed companions
    const existingCompanions = await db.select().from(companions);
    if (existingCompanions.length === 0) {
      console.log("Seeding companions data...");
      for (const companion of sampleCompanions) {
        await db.insert(companions).values(companion);
      }
      console.log("Companions data seeded successfully!");
    } else {
      console.log("Companions data already exists, skipping seeding.");
    }
    
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

createTables()
  .then(() => {
    console.log("Migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });