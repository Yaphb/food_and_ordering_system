# Food Ordering System

Minimalist designation food ordering system.

## Tech Stack

**Frontend:** React 19, React Router, Axios  
**Backend:** Node.js, Express, MySQL/MongoDB, JWT Auth  
**Design:** Apple-inspired (SF Pro Display, black/white palette)

## Features

- User authentication & role-based access
- Menu browsing with category filters
- Shopping cart & checkout
- Order tracking & status updates
- Admin dashboard (manage menu & orders)
- Staff dashboard (update order status)
- Responsive design
- Smart theme system (auto/light/dark modes)
- Persistent cart across sessions

## Quick Start (Windows)

Double-click `startup.bat` and choose:

1. **Setup** - First time installation (XAMPP or AWS)
2. **Start** - Run the application
3. **Stop** - Stop all processes
4. **Info** - View system status
5. **Reset Database** - Clear and reseed data



## Manual Setup

For detailed instructions:

- **Local Development** → [XAMPP_SETUP.md](./XAMPP_SETUP.md)
- **Cloud Deployment** → [AWS_SETUP.md](./AWS_SETUP.md)

## Default Login

After database seeding:

- **Admin:** admin@foodorder.com / admin123
- **Staff:** staff@foodorder.com / staff123
- **Customer:** customer@foodorder.com / customer123

## Project Structure

```
├── frontend/          # React app
│   └── src/
│       ├── components/
│       ├── pages/
│       └── context/
├── backend/           # Node.js API
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── database/
└── docs/             # Setup guides
```

## API Endpoints

**Auth:** `/api/auth/register`, `/api/auth/login`  
**Menu:** `/api/menu` (GET, POST, PUT, DELETE)  
**Orders:** `/api/orders` (GET, POST), `/api/orders/:id/status` (PUT)

## Theme System

**Non-Logged-In Users:**
- Automatic theme based on Malaysia time (UTC+8)
- Dark mode: 6 PM - 6 AM
- Light mode: 6 AM - 6 PM
- Updates automatically every minute

**Logged-In Users:**
- Choose from Light, Dark, or Auto themes
- Preferences saved to user account (server-side)
- Access via Profile → Preferences
- Theme syncs across all devices

**On Logout:**
- Theme preference is retained in localStorage
- When logging back in, saved theme is automatically restored
- Cart and order history are also retained

## License

MIT
