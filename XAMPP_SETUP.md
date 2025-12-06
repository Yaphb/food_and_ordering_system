# XAMPP Local Setup

Quick setup guide for local development.

## Prerequisites

- XAMPP (Apache, MySQL)
- Node.js v14+
- npm

## 1. Install XAMPP

1. Download from [apachefriends.org](https://www.apachefriends.org)
2. Install with defaults
3. Start **MySQL** in XAMPP Control Panel

## 2. Create Database

**Using phpMyAdmin** (recommended):
1. Open `http://localhost/phpmyadmin`
2. Create database: `food_ordering`
3. Import `backend/database/schema.sql`
4. Import `backend/database/seed.sql`

**Using Command Line**:
```bash
mysql -u root food_ordering < backend/database/schema.sql
mysql -u root food_ordering < backend/database/seed.sql
```

## 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DB_TYPE=mysql
DB_HOST=localhost
DB_NAME=food_ordering
DB_USER=root
DB_PASSWORD=
JWT_SECRET=change_this_secret_key
FRONTEND_URL=http://localhost:3000
```

Start server:
```bash
npm start
```

Backend runs at `http://localhost:5000`

## 4. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env` (optional):
```env
REACT_APP_API_URL=http://localhost:5000
```

Start app:
```bash
npm start
```

Frontend opens at `http://localhost:3000`

## 5. Test

Login with:
- **Admin:** admin@foodorder.com / admin123
- **Staff:** staff@foodorder.com / staff123
- **Customer:** customer@foodorder.com / customer123

## Troubleshooting

**MySQL won't connect:**
- Check MySQL is running in XAMPP
- Verify empty password in `.env`

**Port in use:**
- Change `PORT=5001` in backend `.env`
- Or kill process: `netstat -ano | findstr :5000`

**CORS error:**
- Ensure backend is running
- Check `FRONTEND_URL` matches frontend

**Import failed:**
- Import schema.sql before seed.sql
- Use phpMyAdmin for easier import

## Tips

**Auto-restart backend:**
```bash
npm install -g nodemon
nodemon index.js
```

**Reset database:**
```bash
mysql -u root -e "DROP DATABASE food_ordering; CREATE DATABASE food_ordering;"
mysql -u root food_ordering < backend/database/schema.sql
mysql -u root food_ordering < backend/database/seed.sql
```

**Stop everything:**
- `Ctrl + C` in both terminals
- Stop MySQL in XAMPP
