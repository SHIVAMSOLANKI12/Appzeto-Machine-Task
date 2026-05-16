# BookMyShow Lite++ 🎬

A premium, production-ready Movie Ticket Booking platform built with the MERN stack. Designed for high performance, atomic transactions (seat locking), and a luxurious user experience.

## 🚀 Features

### **User Experience**
- **Immersive Discovery:** Modern movie listing with genre and language filters.
- **Dynamic Seat Selection:** High-end cinema hall visualizer with tiered pricing (Classic, Prime, Recliner).
- **Atomic Seat Locking:** Prevents double-booking via a 3-minute lock timer.
- **Smart Booking History:** Track past bookings with automated movie poster matching.
- **Responsive Design:** Optimized for Mobile, Tablet, and Desktop.

### **Admin Dashboard**
- **Inventory Management:** Add/Edit/Delete Movies and Shows.
- **Dynamic Cast Inputs:** Manage complex movie metadata.
- **User Management:** Promote users to admin roles.

### **Technical Architecture**
- **Frontend:** React.js, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose).
- **Security:** JWT Authentication, Helmet, CORS, Bcrypt password hashing.
- **Patterns:** MVC Architecture, Error Handling Middleware, Axios Interceptors.

---

## 🛠️ Installation & Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/SHIVAMSOLANKI12/Appzeto-Machine-Task.git
cd Appzeto-Machine-Task
```

### **2. Backend Setup**
1. Navigate to server: `cd server`
2. Install dependencies: `npm install`
3. Configure `.env`: Create a `.env` file based on `.env.example`.
4. Start development server: `npm run dev`

### **3. Frontend Setup**
1. Navigate to client: `cd client`
2. Install dependencies: `npm install`
3. Configure `.env`: Create a `.env` file based on `.env.example`.
4. Start development server: `npm run dev`

---

## 🔑 Admin Promotion
To promote a user to Admin, use the provided utility script in the `server` directory:
```bash
node make-admin.js <user_email>
```

---

## 📖 API Documentation

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | Register new user | Public |
| `/api/auth/login` | POST | Login user | Public |
| `/api/movies` | GET | Fetch all movies | Public |
| `/api/shows/details/:id` | GET | Fetch show & seat layout | Public |
| `/api/seats/lock` | POST | Lock seats for 3 mins | Protected |
| `/api/book` | POST | Confirm booking | Protected |
| `/api/admin/movies` | POST | Add new movie | Admin |

---

## 🏗️ Project Structure

```text
├── client/
│   ├── src/
│   │   ├── animations/     # Framer motion variants
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page layouts (User & Admin)
│   │   ├── services/       # API abstraction layer
│   │   └── utils/          # Formatters & Helpers
├── server/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API endpoints
│   │   └── middlewares/    # Security & Error handling
```

---

## ⚖️ Pricing Logic
- **Classic (Rows 1-10):** ₹150
- **Prime (Rows 11-20):** ₹180
- **Recliner (Rows 21-30):** ₹200

---

Developed with ❤️ by **Antigravity AI** for the Appzeto Machine Round.
