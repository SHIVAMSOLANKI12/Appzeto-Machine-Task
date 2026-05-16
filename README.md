# Appzeto MERN Boilerplate

A production-ready, scalable MERN stack boilerplate designed for machine-round interviews and rapid prototyping.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, React Router DOM, Lucide React
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Security**: Helmet, CORS, Morgan, Bcryptjs, JSON Web Token
- **Validation**: Express-validator
- **Architecture**: ES Modules, REST API, Modular Folder Structure

## Project Structure

```text
root/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── api/         # Axios instance & interceptors
│   │   ├── animations/  # Framer Motion variants
│   │   ├── components/  # Atomic components (common, layout, ui)
│   │   ├── layouts/     # Page wrapper layouts
│   │   ├── routes/      # React Router configuration
│   │   └── ...
├── server/              # Node.js backend
│   ├── src/
│   │   ├── config/      # DB & other configurations
│   │   ├── middlewares/ # Global error handling, auth, etc.
│   │   ├── utils/       # Async handler, helpers
│   │   └── ...
└── package.json         # Root orchestration
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm run install-all
   ```
   *Alternatively, run `npm install` in root, client, and server folders separately.*

2. **Environment Variables**:
   - Rename `server/.env.example` to `server/.env` and update your MongoDB URI and JWT Secret.
   - Rename `client/.env.example` to `client/.env` (default is usually fine).

3. **Run the Application**:
   ```bash
   npm run dev
   ```
   This will start both the backend (port 5000) and frontend (port 5173) concurrently.

## Features Included

- **Scalable Architecture**: Clean separation of concerns (MVC-like for backend, modular for frontend).
- **Global Error Handling**: Centralized error middleware in the backend.
- **Async Handler**: Utility to avoid try-catch boilerplate in controllers.
- **API Health Check**: Built-in `/api/health` route.
- **Axios Interceptors**: Automatically attaches JWT tokens to requests and handles 401 responses.
- **Page Transitions**: Smooth animations using Framer Motion.
- **Modern UI**: Clean, minimal design with Tailwind CSS and Inter typography.

## Coding Standards

- **ES Modules**: `import/export` syntax throughout the project.
- **Maintainability**: Clear naming conventions and modular folder structure.
- **Interview Quality**: Clean code with comments where necessary, following industry best practices.
