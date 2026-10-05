# ShelfLife

A personal book tracking application built for the **ProStackHub Full Stack Development Internship — Task 1**.

## Features

- JWT-based user authentication (register, login)
- Search books via the Google Books API (auto-fills title, author, cover, ISBN)
- Add books to your personal shelf
- Track reading status: **Want to Read**, **Reading**, **Read**
- Reading progress bar (current page / total pages)
- Give a personal rating (1–5 stars) for finished books
- Write a review for finished books
- Protected routes — each user can only see and edit their own shelf

## Tech Stack

| Layer     | Technology                                |
|-----------|-------------------------------------------|
| Frontend  | React, Vite, React Router, Axios, Plain CSS |
| Backend   | Node.js, Express, MongoDB, Mongoose       |
| Auth      | JWT, bcryptjs                             |
| External  | Google Books API                          |

## Setup

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally on port 27017

### Backend

```bash
cd backend
npm install
# Edit .env — set MONGO_URI and JWT_SECRET
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

## API Endpoints

### Auth

| Method | Endpoint               | Description         |
|--------|------------------------|---------------------|
| POST   | /api/auth/register     | Register new user   |
| POST   | /api/auth/login        | Login, returns JWT  |

### Books

| Method | Endpoint               | Description                        |
|--------|------------------------|------------------------------------|
| GET    | /api/books/search?q=   | Search Google Books (protected)    |

### Shelf (all protected)

| Method | Endpoint         | Description                        |
|--------|------------------|------------------------------------|
| POST   | /api/shelf       | Add book to shelf                  |
| GET    | /api/shelf       | Get authenticated user's shelf     |
| GET    | /api/shelf/:id   | Get single shelf book              |
| PATCH  | /api/shelf/:id   | Update status, progress, rating    |
| DELETE | /api/shelf/:id   | Remove book from shelf             |

## Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/shelflife
JWT_SECRET=your_secret_here
GOOGLE_BOOKS_API_KEY=   # optional, increases API quota
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

1. Deploy the backend to any Node.js host (Render, Railway, etc.)
2. Set environment variables on the host
3. Build and deploy the frontend (`npm run build`) to Vercel or Netlify
4. Update `VITE_API_URL` to your hosted backend URL before building
