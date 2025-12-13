require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const sampleUsers = [
  {
    email: 'admin@gmail.com',
    name: 'Admin User',
    password: '123456',
    role: 'admin',
    phone: '555-0001',
    address: '123 Admin Street, City, State 12345'
  },
  {
    email: 'staff@gmail.com',
    name: 'Staff Member',
    password: '123456',
    role: 'staff',
    phone: '555-0002',
    address: '456 Staff Avenue, City, State 12345'
  },
  {
    email: 'johndoe@gmail.com',
    name: 'John Doe',
    password: '123456',
    role: 'customer',
    phone: '555-0003',
    address: '789 Customer Lane, City, State 12345'
  },
  {
    email: 'janesmith@gmail.com',
    name: 'Jane Smith',
    password: '123456',
    role: 'customer',
    phone: '555-0004',
    address: '553 Maple Avenue, Springfield, IL 62704'
  }
];

const sampleMenuItems = [
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese and croutons',
    price: 38.50,
    category: 'appetizer',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400'
  },
  {
    name: 'Chicken Wings',
    description: 'Crispy wings with your choice of sauce',
    price: 55.00,
    category: 'appetizer',
    image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400'
  },
  {
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with vegetables and rice',
    price: 105.00,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400'
  },
  {
    name: 'Beef Burger',
    description: 'Juicy beef patty with cheese, lettuce, and tomato',
    price: 68.00,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 80.00,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'
  },
  {
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon and parmesan',
    price: 72.00,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400'
  },
  {
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with chocolate frosting',
    price: 34.00,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 38.00,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400'
  },
  {
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice',
    price: 21.00,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400'
  },
  {
    name: 'Iced Coffee',
    description: 'Cold brew coffee with ice',
    price: 25.00,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400'
  }
];

async function seedRDS() {
  let connection;
  
  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  RDS DATABASE SEEDING');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Connect to RDS
    console.log('Connecting to RDS MySQL...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });
    
    console.log('✓ Connected to RDS successfully\n');
    
    // Seed users
    console.log('Seeding users...');
    let usersCreated = 0;
    let usersSkipped = 0;
    
    for (const user of sampleUsers) {
      try {
        // Check if user already exists
        const [existing] = await connection.execute(
          'SELECT id FROM users WHERE email = ?',
          [user.email]
        );
        
        if (existing.length > 0) {
          console.log(`⊘ Skipped ${user.role}: ${user.email} (already exists)`);
          usersSkipped++;
          continue;
        }
        
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        await connection.execute(
          `INSERT INTO users (email, name, password, role, phone, address)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [user.email, user.name, hashedPassword, user.role, user.phone, user.address]
        );
        
        console.log(`✓ Created ${user.role}: ${user.email} (password: 123456)`);
        usersCreated++;
      } catch (error) {
        console.log(`✗ Failed to create ${user.email}: ${error.message}`);
      }
    }

    // Seed menu items
    console.log('\nSeeding menu items...');
    let itemsCreated = 0;
    let itemsSkipped = 0;
    
    for (const item of sampleMenuItems) {
      try {
        // Check if item already exists
        const [existing] = await connection.execute(
          'SELECT id FROM menu_items WHERE name = ?',
          [item.name]
        );
        
        if (existing.length > 0) {
          console.log(`⊘ Skipped: ${item.name} (already exists)`);
          itemsSkipped++;
          continue;
        }
        
        await connection.execute(
          `INSERT INTO menu_items (name, description, price, category, image, available)
           VALUES (?, ?, ?, ?, ?, TRUE)`,
          [item.name, item.description, item.price, item.category, item.image]
        );
        
        console.log(`✓ Added: ${item.name} (RM ${item.price})`);
        itemsCreated++;
      } catch (error) {
        console.log(`✗ Failed to create ${item.name}: ${error.message}`);
      }
    }

    console.log('\n✓ RDS Database seeding completed!');
    console.log('\nSummary:');
    console.log(`- Users: ${usersCreated} created, ${usersSkipped} skipped`);
    console.log(`- Menu items: ${itemsCreated} created, ${itemsSkipped} skipped`);
    
    if (usersCreated > 0) {
      console.log('\nDefault Accounts (password: 123456):');
      console.log('- Admin: admin@gmail.com');
      console.log('- Staff: staff@gmail.com');
      console.log('- Customer: johndoe@gmail.com, janesmith@gmail.com');
    }
    
    console.log('\nNext steps:');
    console.log('1. Test login with DBeaver');
    console.log('2. Start your Node.js application');
    console.log('3. Access frontend and test login');
    
  } catch (error) {
    console.error('\n✗ Error seeding RDS:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Run setupRDS.js first to create tables');
    console.error('2. Check RDS connection settings');
    console.error('3. Verify database exists and is accessible');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedRDS();