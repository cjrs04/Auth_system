# Auth App

A simple full-stack authentication system with login, signup, and logout functionality. Built with a vanilla JS frontend and a Node.js/Express backend connected to MongoDB.

---

## Tech Stack

**Frontend:** HTML, CSS, Vanilla JavaScript  
**Backend:** Node.js, Express  
**Database:** MongoDB Atlas (via Mongoose)  
**Auth:** JWT (JSON Web Tokens) + bcrypt password hashing

---

## Project Structure

```
├── public/
│   ├── index.html        # Frontend UI
│   ├── auth.js           # Frontend login/signup/logout logic
│   └── style.css         # Styles
├── routes/
│   └── auth.js           # Signup, login, logout routes
├── models/
│   └── user.js           # Mongoose user schema + JWT/password methods
├── middleware/
│   └── midauth.js        # JWT verification middleware
├── utils/
│   └── validate.js       # Signup input validation
├── app.js                # Express app entry point
└── .env                  # Environment variables (not committed)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- A [MongoDB Atlas](https://www.mongodb.com) account (free tier is fine)

### 1. Clone the repo

```bash
git clone https://github.com/cjrs04/Auth_system
cd Auth_system
```

### 2. Install dependencies

```bash
npm install express mongoose cors bcryptjs jsonwebtoken validator cookie-parser dotenv
```

### 3. Set up environment variables

Create a `.env` file in the root of the project:

```env
MONGO_URI=
JWT_SECRET=your_long_random_secret_here
PORT=3000
```


### 4. Run the server

```bash
node app.js
```

You should see:
```
Connected to MongoDB
Server running on port 3000
```

### 5. Open the frontend

Open `public/index.html` with a local server such as VS Code Live Server. The app will be available at:

```
http://127.0.0.1:5500/public/index.html
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|--------------|------------------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Log in, returns JWT |
| POST | `/auth/logout` | Clears the auth cookie |

### Password requirements

Passwords must be at least 8 characters and include an uppercase letter, a number, and a symbol.

---

## Environment Variables

| Variable | Description |
|-------------|--------------------------------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `PORT` | Port the server runs on (default 3000) |

---

## Known Limitations


- No refresh token — sessions expire after 1 hour and the user must log in again
- No password reset or email verification flow
