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

## License

MIT
