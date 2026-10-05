# ShelfLife — Architecture

## Project Structure

```
ShelfLife/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login logic
│   │   ├── booksController.js # Google Books API proxy
│   │   └── shelfController.js # Shelf CRUD logic
│   ├── middleware/
│   │   └── auth.js            # JWT protect middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── ShelfBook.js       # ShelfBook schema
│   ├── routes/
│   │   ├── auth.js            # /api/auth/*
│   │   ├── books.js           # /api/books/*
│   │   └── shelf.js           # /api/shelf/*
│   ├── .env
│   └── server.js              # Express entry point
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js       # Axios instance with token interceptor
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx # Global auth state
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── MyShelf.jsx
        │   ├── SearchBooks.jsx
        │   └── BookDetail.jsx
        ├── App.jsx            # Router setup
        ├── main.jsx
        └── index.css
```

## Authentication

1. User registers or logs in via `POST /api/auth/register|login`.
2. The server validates credentials, hashes passwords with **bcryptjs**, and returns a **JWT** (7-day expiry).
3. The frontend stores the token in **localStorage**.
4. Every API request attaches it as `Authorization: Bearer <token>` via an Axios request interceptor.
5. The `protect` middleware on the backend verifies the JWT and attaches `req.user` to the request.
6. `userId` is always read from `req.user._id` (from the JWT), never from the request body.

## MongoDB Models

### User

| Field     | Type   | Notes                        |
|-----------|--------|------------------------------|
| name      | String | required                     |
| email     | String | required, unique, lowercase  |
| password  | String | bcrypt-hashed via pre-save   |

### ShelfBook

| Field         | Type     | Notes                               |
|---------------|----------|-------------------------------------|
| userId        | ObjectId | ref to User                         |
| googleBooksId | String   | unique book identifier              |
| title         | String   | required                            |
| author        | String   |                                     |
| cover         | String   | thumbnail URL                       |
| isbn          | String   |                                     |
| status        | String   | Want to Read / Reading / Read       |
| currentPage   | Number   | for Reading progress                |
| totalPages    | Number   | for Reading progress                |
| rating        | Number   | 1–5, only shown for Read books      |
| review        | String   | only shown for Read books           |
| createdAt     | Date     | auto                                |
| updatedAt     | Date     | auto                                |

## Google Books API Flow

1. Frontend sends `GET /api/books/search?q=<query>` with JWT.
2. Backend `booksController` calls `https://www.googleapis.com/books/v1/volumes` server-side.
3. It extracts: `googleBooksId`, `title`, `author`, `cover`, `isbn`, `totalPages`.
4. Returns the cleaned array to the frontend.
5. Google Books API key is optional (set in `.env`) — without it the request uses the free unauthenticated quota.

## Shelf Ownership & Security

- **GET /api/shelf** — queries `ShelfBook.find({ userId: req.user._id })`. Only the owner's books are returned.
- **GET /api/shelf/:id** — fetches book by ID, then checks `book.userId !== req.user._id` → 403 if mismatch.
- **PATCH /api/shelf/:id** — same ownership check before updating. Only `status`, `currentPage`, `totalPages`, `rating`, `review` can be modified.
- **DELETE /api/shelf/:id** — same ownership check before deletion.
- `userId` is never accepted from `req.body`; it always comes from the verified JWT payload.

## Frontend Routing

| Path         | Component     | Protected |
|--------------|---------------|-----------|
| /login       | Login         | No        |
| /register    | Register      | No        |
| /shelf       | MyShelf       | Yes       |
| /shelf/:id   | BookDetail    | Yes       |
| /search      | SearchBooks   | Yes       |
| /            | → /shelf      | —         |

`ProtectedRoute` redirects unauthenticated users to `/login`.
