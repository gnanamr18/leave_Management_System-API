require('dotenv').config();

module.exports = {
  schema: './src/db/schema.js',
  out: './src/db/migrations',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
}; 