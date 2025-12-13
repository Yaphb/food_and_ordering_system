require('dotenv').config();
const mysql = require('mysql2/promise');

async function testRDSConnection() {
  console.log('Testing RDS Connection...');
  console.log('Host:', process.env.DB_HOST);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
  console.log('Port:', process.env.DB_PORT);
  
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
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', rows);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ RDS Connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔍 Troubleshooting ECONNREFUSED:');
      console.log('1. Check RDS instance is running');
      console.log('2. Verify security group allows port 3306');
      console.log('3. Confirm RDS endpoint is correct');
    }
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n🔍 Troubleshooting ACCESS DENIED:');
      console.log('1. Check username/password are correct');
      console.log('2. Verify RDS master credentials');
    }
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n🔍 Troubleshooting BAD DATABASE:');
      console.log('1. Database "food_ordering" may not exist');
      console.log('2. Try connecting without specifying database first');
    }
  }
}

testRDSConnection();