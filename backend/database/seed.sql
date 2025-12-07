-- Seed Data for Food Ordering System
-- Run this after schema.sql

USE food_ordering;

-- Clear existing data (optional - comment out if you want to keep existing data)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert sample users
-- Password for all users: "123456" (hashed with bcrypt)
INSERT INTO users (email, name, password, role, phone, address, theme_preference) VALUES
('admin@gmail.com', 'Admin User', '$2b$10$K4sbr.W0RKjmpN6B05uSAe.O0q9vkQDQKRqH52KE7qnrqduYJDAVS', 'admin', '555-0001', '123 Admin Street, City, State 12345', 'light'),
('staff@gmail.com', 'Staff Member', '$2b$10$K4sbr.W0RKjmpN6B05uSAe.O0q9vkQDQKRqH52KE7qnrqduYJDAVS', 'staff', '555-0002', '456 Staff Avenue, City, State 12345', 'light'),
('johndoe@gmail.com', 'John Doe', '$2b$10$K4sbr.W0RKjmpN6B05uSAe.O0q9vkQDQKRqH52KE7qnrqduYJDAVS', 'customer', '555-0003', '789 Customer Lane, City, State 12345', 'light'),
('janesmith@gmail.com', 'Jane Smith', '$2b$10$K4sbr.W0RKjmpN6B05uSAe.O0q9vkQDQKRqH52KE7qnrqduYJDAVS', 'customer', '555-0004', '321 Buyer Boulevard, City, State 12345', 'light');

-- Insert sample menu items (Prices in Malaysian Ringgit - RM)
INSERT INTO menu_items (name, description, price, category, image, available) VALUES
-- Appetizers
('Caesar Salad', 'Fresh romaine lettuce with parmesan cheese and croutons', 38.50, 'appetizer', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', TRUE),
('Chicken Wings', 'Crispy wings with your choice of sauce', 55.00, 'appetizer', 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400', TRUE),
('Mozzarella Sticks', 'Golden fried mozzarella with marinara sauce', 34.00, 'appetizer', 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400', TRUE),

-- Main Courses
('Grilled Salmon', 'Fresh Atlantic salmon with vegetables and rice', 105.00, 'main', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', TRUE),
('Beef Burger', 'Juicy beef patty with cheese, lettuce, and tomato', 68.00, 'main', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', TRUE),
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 80.00, 'main', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', TRUE),
('Pasta Carbonara', 'Creamy pasta with bacon and parmesan', 72.00, 'main', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', TRUE),
('Chicken Teriyaki', 'Grilled chicken with teriyaki glaze and steamed rice', 85.00, 'main', 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400', TRUE),

-- Desserts
('Chocolate Cake', 'Rich chocolate cake with chocolate frosting', 34.00, 'dessert', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', TRUE),
('Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 38.00, 'dessert', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', TRUE),
('Cheesecake', 'New York style cheesecake with berry compote', 36.00, 'dessert', 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400', TRUE),

-- Beverages
('Fresh Orange Juice', 'Freshly squeezed orange juice', 21.00, 'beverage', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', TRUE),
('Iced Coffee', 'Cold brew coffee with ice', 25.00, 'beverage', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400', TRUE),
('Lemonade', 'Homemade fresh lemonade', 17.00, 'beverage', 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', TRUE),
('Smoothie', 'Mixed berry smoothie', 30.00, 'beverage', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400', TRUE);

-- Insert sample orders (using user IDs 3 and 4 - the customers)
INSERT INTO orders (user_id, total_price, status, delivery_address, phone, notes) VALUES
(3, 195.00, 'delivered', '789 Customer Lane, City, State 12345', '555-0003', 'Please ring doorbell'),
(4, 143.50, 'preparing', '321 Buyer Boulevard, City, State 12345', '555-0004', 'Leave at door'),
(3, 122.00, 'pending', '789 Customer Lane, City, State 12345', '555-0003', NULL);

-- Insert order items (using menu item IDs 1-15 and order IDs 1-3)
INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES
-- Order 1 items
(1, 5, 2, 68.00),  -- 2x Beef Burger
(1, 9, 1, 34.00),  -- 1x Chocolate Cake
(1, 13, 2, 25.00),  -- 2x Iced Coffee

-- Order 2 items
(2, 6, 1, 80.00),  -- 1x Margherita Pizza
(2, 12, 2, 21.00),  -- 2x Orange Juice
(2, 1, 1, 38.50),   -- 1x Caesar Salad

-- Order 3 items
(3, 4, 1, 105.00),  -- 1x Grilled Salmon
(3, 14, 1, 17.00);  -- 1x Lemonade

-- Display summary
SELECT 'Database seeded successfully!' as message;

SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_menu_items FROM menu_items;
SELECT COUNT(*) as total_orders FROM orders;
SELECT COUNT(*) as total_order_items FROM order_items;

-- Show sample data
SELECT 'Sample Users:' as info;
SELECT id, email, name, role FROM users;

SELECT 'Sample Menu Items by Category:' as info;
SELECT category, COUNT(*) as count FROM menu_items GROUP BY category;

SELECT 'Sample Orders:' as info;
SELECT id, user_id, total_price, status, created_at FROM orders;
