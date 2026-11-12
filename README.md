# RecallX – Spaced-Repetition Flashcards

RecallX is a full-stack flashcard application that helps learners remember information through spaced repetition. It schedules flashcard reviews based on user feedback, helping learners focus on cards they are more likely to forget.

## Features

- User registration, login, and logout
- Create, view, update, and delete flashcard decks
- Create, view, update, and delete flashcards
- Markdown-supported flashcard content
- Interactive flashcard review with Again, Hard, Good, and Easy ratings
- SM-2-inspired spaced-repetition scheduling
- Daily review queue across decks
- Configurable daily limit for new cards
- Timezone-aware review scheduling
- Dashboard with due cards, overdue cards, review activity, and streak statistics
- Review history
- Protected API routes and user-specific data access

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- Redux Toolkit
- RTK Query
- React Router
- Axios
- React Markdown
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs
- Cookie Parser

**Testing**
- Node.js Test Runner
- Supertest
- MongoDB Memory Server

## Project Structure

```text
RecallX/
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── tests/
│   ├── utils/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB database (local MongoDB or MongoDB Atlas)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/saurbu/RecallX.git
cd RecallX
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Start the backend:

```bash
npm run dev
```

The API runs at:

`http://localhost:5000`

### 3. Setup the frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite, normally:

`http://localhost:5173`

## Demo Account

Use the following account to explore the application:

| Field | Demo credentials |
|---|---|
| Email | demo@recallx.app |
| Password | RecallXDemo123 |

The demo account includes sample decks and flashcards.

To create or restore the demo data, run from the `server` directory:

```bash
npm run seed
```

The seed script checks for existing demo data before creating it.

## Spaced-Repetition Algorithm

RecallX uses an SM-2-inspired scheduling algorithm.

After reviewing a card, the learner selects one of four ratings:

- **Again:** The card needs to be reviewed again soon.
- **Hard:** The card was difficult to remember.
- **Good:** The card was remembered correctly.
- **Easy:** The card was remembered with little effort.

The backend calculates the next review date using the card's previous interval, repetition count, and ease factor.

The scheduling logic is kept on the server so that review intervals cannot be manipulated by the frontend.

## Database Design

The application uses MongoDB with four main models:

| Model | Purpose |
|---|---|
| User | Stores account information, password hash, timezone, and daily new-card limit |
| Deck | Stores flashcard deck details and owner |
| Card | Stores front/back content and spaced-repetition scheduling data |
| Review | Stores review history, rating, and next review date |

Cards and decks are associated with their owner. API operations use authenticated user information to prevent users from accessing other users' data.

Passwords are hashed before storage. Authentication uses JWT tokens in HTTP-only cookies.

## Running Tests

From the `server` directory:

```bash
npm test
```

The backend test suite covers authentication, deck and card operations, review submission, daily queue behavior, user access restrictions, and spaced-repetition calculations.

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| PORT | Backend server port |
| NODE_ENV | Application environment |
| CLIENT_URL | Frontend origin allowed by CORS |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret used to sign authentication tokens |

### Frontend

| Variable | Description |
|---|---|
| VITE_API_URL | Backend API base URL |

Never commit actual `.env` files or credentials.

## Design Decisions

- **MERN stack:** Provides a JavaScript-based full-stack architecture.
- **Redux Toolkit and RTK Query:** Manage application state and API requests.
- **HTTP-only cookies:** Keep authentication tokens inaccessible to frontend JavaScript.
- **Server-side scheduling:** Ensures review intervals are calculated consistently and securely.
- **Timezone-aware queue:** Determines daily reviews according to the user's configured timezone.
- **Separate models:** Keeps users, decks, cards, and review history organized and maintainable.

## Current Status

Implemented:
- Backend API and MongoDB models
- Authentication and protected routes
- Deck and flashcard CRUD
- Spaced-repetition scheduling
- Daily review queue