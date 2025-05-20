import { db } from "../server/db";

async function updateTransactionsTable() {
  console.log("Updating transactions table with crypto payment fields...");
  
  try {
    // Alter the transactions table to add new columns
    await db.execute(`
      ALTER TABLE transactions 
      ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS crypto_currency TEXT,
      ADD COLUMN IF NOT EXISTS crypto_amount TEXT;
    `);

    console.log("Transactions table updated successfully!");
    
  } catch (error) {
    console.error("Error updating transactions table:", error);
  }
}

updateTransactionsTable()
  .then(() => {
    console.log("Migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });