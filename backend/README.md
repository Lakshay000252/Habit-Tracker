# HabitAI Backend

Production-ready REST API for AI-Powered Daily Habit Tracker & Motivation Assistant.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JWT (JSON Web Tokens)
- **AI:** OpenAI GPT / Google Gemini API
- **Email:** Nodemailer
- **Security:** Helmet, Rate Limiting, CORS, bcrypt
- **Validation:** express-validator
- **Logging:** Winston + Morgan
- **Docs:** Swagger UI

## Project Structure

```
backend/
├── config/          # Database & JWT configuration
├── controllers/     # Route handlers (MVC controllers)
├── middleware/       # Auth, error handling, validation
├── models/          # Mongoose schemas
├── routes/          # Express route definitions
├── services/        # Business logic (AI, Email, Analytics)
├── utils/           # Helper functions
├── docs/            # Swagger & Postman collection
├── seeds/           # Database seed script
├── logs/            # Application logs
├── .env             # Environment variables
├── server.js        # Entry point
└── package.json
```

## Features

- User authentication (register, login, JWT, refresh tokens)
- Profile management (get, update, change password)
- Habit CRUD with categories & filtering
- Daily progress tracking with streak system
- Dashboard analytics (completion rates, productivity scores)
- AI-powered motivation messages (mood-based)
- Smart habit suggestions (data-driven)
- Automatic achievement/unlock system
- Email notifications (welcome, password reset, achievements)
- Swagger API documentation
- Rate limiting & security best practices

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh-token` | Refresh JWT token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password/:token` | Reset password |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PUT | `/api/user/profile` | Update profile |
| PUT | `/api/user/change-password` | Change password |

### Habits
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/habits` | Create habit |
| GET | `/api/habits` | Get all habits |
| GET | `/api/habits/:id` | Get single habit |
| PUT | `/api/habits/:id` | Update habit |
| DELETE | `/api/habits/:id` | Delete habit |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/progress/complete` | Mark habit completed |
| POST | `/api/progress/incomplete` | Mark habit incomplete |
| GET | `/api/progress/history` | Get progress history |
| GET | `/api/progress/daily` | Get daily progress |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard analytics |
| GET | `/api/analytics/habit/:habitId` | Habit-specific analytics |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/motivate` | Get AI motivation |
| POST | `/api/ai/suggestions` | Get smart suggestions |

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key (optional) or Google Gemini API key (optional)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Copy `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.xxxxx.mongodb.net/habitai
JWT_SECRET=your_super_secret_key
OPENAI_API_KEY=sk-...     # Optional
GEMINI_API_KEY=...         # Optional
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
CLIENT_URL=http://localhost:3000
```

### Seed Database

```bash
npm run seed
```

Test accounts created:
| Name | Email | Password |
|------|-------|----------|
| John Doe | john@example.com | password123 |
| Jane Smith | jane@example.com | password123 |
| Admin | admin@habitai.com | admin123456 |

### Run Server

```bash
# Development
npm run dev

# Production
npm start
```

Server starts at `http://localhost:5000`

## API Documentation

Once running, visit:
- **Swagger UI:** `http://localhost:5000/api-docs`
- **Health Check:** `http://localhost:5000/api/health`

## Postman Collection

Import `docs/HabitAI_Postman.json` into Postman. Set `{{JWT_TOKEN}}` and `{{habitId}}` variables from responses.

## AI Integration

The backend supports two AI providers:

1. **OpenAI** (default): Set `AI_PROVIDER=openai` and provide `OPENAI_API_KEY`
2. **Google Gemini**: Set `AI_PROVIDER=gemini` and provide `GEMINI_API_KEY`

If neither API key is set, the system uses built-in fallback responses.

## Frontend Connection

Update the React frontend's API base URL in your `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Authentication Flow

1. Register or login to get JWT token
2. Include token in headers: `Authorization: Bearer <token>`
3. Token expires based on `JWT_EXPIRE` (default: 30 days)
4. Use refresh token to get a new JWT without re-login
