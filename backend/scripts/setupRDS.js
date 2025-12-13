require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupRDS() {
  let connection;
  
  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  RDS DATABASE SETUP');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Create connection to RDS
    console.log('Connecting to RDS MySQL...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });
    
    console.log('✓ Connected to RDS successfully\n');
    
    // Create database if not exists
    console.log(`Creating database: ${process.env.DB_NAME}`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.execute(`USE ${process.env.DB_NAME}`);
    console.log('✓ Database ready\n');
    
    // Read and execute schema
    console.log('Setting up database schema...');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Remove CREATE DATABASE and USE statements (we already did this)
    const cleanSchema = schemaSQL
      .replace(/CREATE DATABASE.*?;/gi, '')
      .replace(/USE.*?;/gi, '')
      .trim();
    
    await connection.execute(cleanSchema);
    console.log('✓ Schema created successfully\n');
    
    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`✓ Created ${tables.length} tables:`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`  - ${tableName}`);
    });
    
    console.log('\n✓ RDS Database setup completed!');
    console.log('\nNext steps:');
    console.log('1. Run: node scripts/seedRDS.js (to add sample data)');
    console.log('2. Test connection with DBeaver');
    console.log('3. Start your application');
    
  } catch (error) {
    console.error('\n✗ Error setting up RDS:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check RDS endpoint in .env file');
    console.error('2. Verify RDS security group allows port 3306');
    console.error('3. Confirm RDS instance is running');
    console.error('4. Check username/password are correct');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupRDS();