# ShelfLife

A full-stack personal book tracking application built for the **ProStackHub Full Stack Development Internship — Task 1**.

ShelfLife allows users to search for books, add them to their personal shelf, track reading progress, and manage their reading status.

## Live Demo

**Frontend:**  
https://pro-stack-hub-shelf-life-opal.vercel.app/

**Backend:**  
https://prostackhub-shelflife-ie8f.onrender.com

## Features

- JWT-based user authentication
- User registration and login
- Search books using the Google Books API
- Automatically fetch book title, author, cover, ISBN, and page count
- Add books to a personal shelf
- Track reading status:
  - Want to Read
  - Reading
  - Read
- Track reading progress
- Add a 1–5 star rating
- Write a personal review
- Protected routes
- User-specific shelves
- Users can only view and modify their own books

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, Axios, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| External API | Google Books API |
| Deployment | Vercel, Render |

## Project Structure

```text
ShelfLife/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── booksController.js
│   │   └── shelfController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── ShelfBook.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── books.js
│   │   └── shelf.js
│   ├── .env
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── MyShelf.jsx
        │   ├── SearchBooks.jsx
        │   └── BookDetail.jsx
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

## Local Setup

### Prerequisites

- Node.js 18 or higher
- MongoDB
- Google Books API key

### 1. Clone the Repository

```bash
git clone https://github.com/Surya-Pratap-Singh108/ProStackHub_ShelfLife.git
cd ProStackHub_ShelfLife
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

Start the backend:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Books

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books/search?q=` | Search books using Google Books API |

### Shelf

All shelf endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/shelf` | Add a book to the shelf |
| GET | `/api/shelf` | Get the authenticated user's shelf |
| GET | `/api/shelf/:id` | Get a single shelf book |
| PATCH | `/api/shelf/:id` | Update status, progress, rating, or review |
| DELETE | `/api/shelf/:id` | Remove a book from the shelf |

## Authentication & Authorization

ShelfLife uses **JWT authentication** to protect user-specific resources.

After login, the server provides a JWT containing the authenticated user's identity.

Protected routes verify the token before allowing access to shelf operations.

Each shelf book is associated with its owner, ensuring that users can only access and modify their own books.

## Environment Variables

### Backend

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

For production, the frontend uses the deployed backend URL.

## Deployment

### Backend

The backend is deployed using **Render**.

https://prostackhub-shelflife-ie8f.onrender.com

### Frontend

The frontend is deployed using **Vercel**.

https://pro-stack-hub-shelf-life-opal.vercel.app/

The production frontend communicates with the deployed backend through the `VITE_API_URL` environment variable.

## Security

- Passwords are hashed using bcryptjs.
- Authentication is handled using JWT.
- Protected API routes require authentication.
- Users cannot access other users' shelves.
- Sensitive environment variables are stored in `.env` and should not be committed to the repository.

## Future Improvements

Some possible improvements include:

- Pagination for book search
- Book categories and filters
- Reading goals and statistics
- Dark mode
- Better book recommendations
- Social features for sharing shelves

## Author

**Surya Pratap Singh**

B.Tech Computer Science Engineering

GitHub:  
https://github.com/Surya-Pratap-Singh108
