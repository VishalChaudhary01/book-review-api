# 📚 Book Review API

A RESTful API built with Express.js, Prisma, and PostgreSQL for managing books and user-submitted reviews.

---

## 🚀 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/VishalChaudhary01/book-review-api.git
cd book-review-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` file and update add required values:

### 4. Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This will create the database tables based on your Prisma schema.

## 🧪 Running the API Locally

```bash
npm run dev
```

The server will run on http://localhost:5000

## 🛠 API Endpoints

### 🔐 Auth

#### Sign Up

```http
POST /auth/signup
```

Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Sign In

```http
POST /auth/signin
```

Body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 📚 Books

#### Create Book (Auth required)

```http
POST /books
Authorization: Bearer <token>
```

```json
{
  "title": "Atomic Habits",
  "description": "A book about habit building"
}
```

#### Get All Books

```http
GET /books
```

Query Params (optional):

- `author=authorId`
- `genre=fiction,non-fiction`
- `keyword=habits`
- `pageNumber=1`
- `pageSize=10`

#### Get Book By ID

```http
GET /books/:id
```

Returns the book along with average rating and paginated reviews.

### 💬 Reviews

#### Add Review (Auth required)

```http
POST /books/:id/reviews
Authorization: Bearer <token>
```

```json
{
  "rating": 4,
  "comment": "Loved the practical advice!"
}
```

#### Update Review (Auth required)

```http
PUT /reviews/:id
Authorization: Bearer <token>
```

```json
{
  "rating": 5,
  "comment": "Updated my opinion—best book ever!"
}
```

#### Delete Review (Auth required)

```http
DELETE /reviews/:id
Authorization: Bearer <token>
```

## 📬 Postman Collection

You can test all endpoints using this Postman collection:

[🔗 Download collection](./book-review-api.postman_collection.json)

Import it into Postman to get started quickly.

## 📦 Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Zod (validation)
- JWT for authentication
