require('dotenv').config();
const mysql = require('mysql2/promise');

async function testRDS() {
  console.log('🔍 Testing RDS Connection...');
  console.log('RDS Instance: food-ordering-db');
  console.log('Database: food_ordering');
  console.log('Host:', process.env.DB_HOST);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      connectTimeout: 10000
    });
    
    console.log('✅ RDS Connection successful!');
    
    // Test queries
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [menu] = await connection.execute('SELECT COUNT(*) as count FROM menu_items');
    const [admin] = await connection.execute("SELECT email FROM users WHERE role = 'admin' LIMIT 1");
    
    console.log('✅ Database ready:');
    console.log(`  - Users: ${users[0].count}`);
    console.log(`  - Menu items: ${menu[0].count}`);
    console.log(`  - Admin: ${admin[0]?.email || 'Not found'}`);
    
    await connection.end();
    console.log('🎉 All tests passed! Your application is ready.');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔧 Fix: Check RDS security group allows port 3306');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('🔧 Fix: Check username/password in .env file');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('🔧 Fix: Create database "food_ordering" in DBeaver first');
    }
  }
}

testRDS();