const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { Pool } = require('pg');
require('dotenv').config();

// Migration function
const runMigration = async () => {
  console.log('Running migrations...');
  
  // Create a PostgreSQL connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  const db = drizzle(pool);
  
  // Run migrations
  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('Migrations completed successfully');
    
    // Close the pool
    await pool.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
};

// Run migrations
runMigration(); 