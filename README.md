# 🎬 BookMyShow Lite++

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

> A premium, production-ready movie booking platform built with the MERN stack. Designed for high performance, real-time seat management, and a seamless user experience.

---

## 🌟 Key Features

### 🛠️ Admin Panel
- **Movie Management**: Full CRUD operations for movies with dynamic cast/crew management.
- **Show Scheduling**: Schedule movies to time slots with automatic seat initialization.
- **Theater Monitoring**: Real-time visibility into show occupancy and seat availability.

### 🎟️ Booking Experience
- **Dynamic Seat Grid**: Interactive 30-seat grid with real-time state handling (Available, Locked, Booked).
- **2-Minute Locking System**: Prevents conflicts by temporarily reserving seats while users complete their booking.
- **Conflict Prevention**: Robust backend logic ensures no two users can lock or book the same seat simultaneously.
- **Real-time Price Calculation**: Dynamic pricing based on seat position (Rows A, B, and C).

### 🛡️ Core Reliability
- **Expired Lock Release**: Automatic background cleanup of stale locks after 2 minutes.
- **Booking Conflict Handling**: Immediate feedback if a seat becomes unavailable during the checkout flow.
- **Booking History**: Detailed user dashboard to view past and upcoming movie reservations.
- **Responsive Design**: Flawless experience across Mobile, Tablet, and Desktop devices.

---

## 💻 Tech Stack

### Frontend
| Technology | Purpose |
| :--- | :--- |
| **React 19** | UI Library |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS 4** | Utility-first Styling |
| **Framer Motion** | Premium Animations |
| **React Hook Form** | Performant Form Handling |
| **Axios** | API Communication |
| **React Hot Toast** | Real-time Notifications |

### Backend & Database
| Technology | Purpose |
| :--- | :--- |
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **MongoDB** | NoSQL Database |
| **Mongoose** | ODM for MongoDB |
| **Express Validator** | Request Validation |

### Tools & Utilities
- **Lucide React**: Iconography
- **Morgan**: Request logging
- **Helmet**: Security headers
- **Dotenv**: Environment variable management

---

## 📂 Folder Structure

```text
/BookMyShow-Lite
├── /client                # Frontend (React + Vite)
│   ├── /src
│   │   ├── /animations    # Framer Motion variants
│   │   ├── /api           # Axios configuration
│   │   ├── /components    # Reusable UI components
│   │   ├── /context       # Auth & Global state
│   │   ├── /hooks         # Custom React hooks
│   │   ├── /layouts       # Main & Admin layouts
│   │   ├── /pages         # Page components
│   │   ├── /services      # API service layers
│   │   ├── /utils         # Helper functions
│   │   └── App.jsx        # Root component
│   └── tailwind.config.js
│
└── /server                # Backend (Node + Express)
    ├── /src
    │   ├── /controllers   # Business logic
    │   ├── /middlewares   # Auth & Error middlewares
    │   ├── /models        # Mongoose schemas
    │   ├── /routes        # API endpoints
    │   ├── /utils         # Reusable utilities
    │   ├── /validations   # Schema validations
    │   └── app.js         # Express app config
    └── server.js          # Entry point
```

---

## 🚀 Installation & Setup

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/SHIVAMSOLANKI12/Appzeto-Machine-Task.git
cd Appzeto-Machine-Task
```

### 3. Backend Setup
```bash
cd server
npm install
# Create .env from .env.example
cp .env.example .env
npm run dev
```

### 4. Frontend Setup
```bash
cd ../client
npm install
# Create .env from .env.example
cp .env.example .env
npm run dev
```

---

## 🔐 Environment Variables

### Backend (`/server/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend (`/client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🛣️ API Documentation

### Admin APIs
| Method | Route | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/admin/movies` | Create a new movie |
| `GET` | `/api/admin/movies` | Get all movies (Admin view) |
| `DELETE` | `/api/admin/movies/:id` | Remove a movie |
| `POST` | `/api/admin/shows` | Create a new show slot |
| `GET` | `/api/admin/shows` | Get all scheduled shows |

### User APIs
| Method | Route | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/movies` | Get available movies |
| `GET` | `/api/movies/:id` | Get movie details & cast |
| `GET` | `/api/shows` | Get shows for a movie |
| `POST` | `/api/seats/lock` | Temporarily lock seats (2 min) |
| `POST` | `/api/book` | Confirm booking and payment |
| `GET` | `/api/bookings` | View user's booking history |

---

## 💰 Seat Pricing Rules

The theater follows a tiered pricing model based on row categories:

| Row Range | Category | Price |
| :--- | :--- | :--- |
| **Seats 1 - 10** | Silver (Row A) | **₹150** |
| **Seats 11 - 20** | Gold (Row B) | **₹180** |
| **Seats 21 - 30** | Platinum (Row C) | **₹200** |

---

## 🔒 Seat Locking & Conflict Prevention

To ensure a smooth booking experience, we implemented a robust **Seat Locking Mechanism**:

1.  **Temporary Lock**: When a user selects a seat, it is locked in the database for **2 minutes**.
2.  **State Management**: During these 2 minutes, the seat status changes to `locked`, preventing other users from selecting it.
3.  **Conflict Prevention**: If two users click at the same time, the backend uses Atomic Operations to ensure only one user succeeds.
4.  **Auto-Release**: A background utility script constantly checks for expired locks. If a booking isn't completed within the timeout, the seats are automatically released back to `available`.
5.  **Double Booking Protection**: Even if a user bypasses the frontend, the final booking API re-verifies the seat status before committing to the database.

---

## 🛡️ Edge Cases Handled

- ✅ **Invalid Seat IDs**: Prevents booking seats that don't exist in the theater layout.
- ✅ **Duplicate Booking**: Prevents a seat from being booked twice for the same show.
- ✅ **Expired Lock Reuse**: Ensures seats are released immediately if the user leaves the checkout page.
- ✅ **Invalid IDs**: Robust validation for Movie, Show, and User ObjectIDs.
- ✅ **Rapid Clicks**: Frontend debouncing and backend locks handle rapid double-click attempts.
- ✅ **Booking Conflicts**: Handles scenarios where a seat is locked by User A just as User B attempts to view the grid.

---

## 🎨 Frontend Excellence

- **Dynamic Seat Grid**: Interactive SVG/CSS grid that updates colors based on status.
- **Framer Motion Animations**: Smooth page entries, card hovers, and modal transitions.
- **Toast Notifications**: Real-time feedback using `react-hot-toast` for all user actions.
- **Countdown Timer**: Visible 120-second timer on the booking page to show lock expiration.
- **Loading States**: Integrated skeletons and spinners for a zero-jank experience.

---

## 🏛️ Backend Architecture

- **MVC Structure**: Clear separation between Models, Views (Routes), and Controllers.
- **Middleware**: Custom middlewares for `auth`, `errorHandling`, and `requestLogging`.
- **Validation**: Schema-level validation using Mongoose and request-level validation using custom utilities.
- **Centralized Error Handling**: Unified error response format for consistent frontend debugging.
- **Reusable Utilities**: Shared logic for price calculation, date formatting, and lock management.

---

## 💡 Project Assumptions

- **Authentication**: For this machine round version, auth is simplified; `userId` is managed via local storage/context.
- **Theater Size**: The theater is currently fixed to a standard 30-seat configuration.
- **Payments**: Payment success is mocked to focus on the booking logic and state management.

---

## 🚩 Known Issues
- "Currently no known issues."

---

## 🚀 Future Improvements

- [ ] Full JWT-based Authentication & RBAC.
- [ ] Integration with Razorpay/Stripe Payment Gateway.
- [ ] Live updates using WebSockets (Socket.io) for real-time seat color changes across all users.
- [ ] Email notifications with QR Code tickets.

---

## 🔗 Deployment

- **Frontend**: [Link to Live Frontend](#)
- **Backend**: [Link to Live Backend](#)

---

## 👤 Author

**Developer**: Shivam Singh Rajput
**Role**: MERN Stack Developer
**Portfolio**: [Github/SHIVAMSOLANKI12](https://github.com/SHIVAMSOLANKI12)

---
*Created as part of a Technical Machine Round Assessment.*
