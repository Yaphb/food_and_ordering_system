require('dotenv').config();
const mysql = require('mysql2/promise');

async function createRDSDatabase() {
  console.log('Creating RDS Database...');
  
  try {
    // Connect without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      connectTimeout: 10000
    });
    
    console.log('✅ Connected to RDS server');
    
    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS food_ordering CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Database "food_ordering" created/verified');
    
    // Show databases
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('📋 Available databases:');
    databases.forEach(db => {
      const dbName = Object.values(db)[0];
      console.log(`  - ${dbName}`);
    });
    
    await connection.end();
    console.log('\n✅ Database setup complete!');
    console.log('Next step: Run npm run setup-rds to create tables');
    
  } catch (error) {
    console.error('❌ Failed to create database:');
    console.error('Error:', error.message);
  }
}

createRDSDatabase();