# 🌍 Natours — REST API Documentation

> **A production-grade Tour Booking API** built with Node.js, Express, and MongoDB  
> Version **2.0.0** · Base URL: `https://natoursadventures.onrender.com/api/v1`

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Architecture & Tech Stack](#-architecture--tech-stack)
3. [Authentication](#-authentication)
4. [API Conventions](#-api-conventions)
5. [Tours](#-tours)
6. [Users & Authentication](#-users--authentication)
7. [Reviews](#-reviews)
8. [Bookings](#-bookings)
9. [Favourites](#-favourites)
10. [Error Handling](#-error-handling)
11. [Data Models](#-data-models)

---

## 🔭 Overview

**Natours** is a full-stack tour booking platform exposing a RESTful API that supports:

- **CRUD operations** on Tours, Users, Reviews, Bookings, and Favourites
- **JWT-based authentication** with cookie support
- **Role-based access control** (`user`, `guide`, `lead-guide`, `admin`)
- **Geospatial queries** — find tours within a radius, calculate distances
- **Stripe payment integration** — checkout sessions & webhook handling
- **Advanced query features** — filtering, sorting, field limiting, pagination
- **Image upload & processing** — powered by Multer + Sharp
- **Transactional emails** — welcome emails & password reset via SendGrid / Mailtrap
- **Security hardening** — rate limiting, Helmet, NoSQL injection sanitization, HPP

---

## 🏗 Architecture & Tech Stack

| Layer           | Technology                                                    |
| --------------- | ------------------------------------------------------------- |
| **Runtime**     | Node.js ≥ 20                                                  |
| **Framework**   | Express 4                                                     |
| **Database**    | MongoDB (Mongoose 8 ODM)                                      |
| **Auth**        | JWT (jsonwebtoken) + bcryptjs                                 |
| **Payments**    | Stripe Checkout                                               |
| **File Upload** | Multer → Sharp (resize/compress)                              |
| **Email**       | Nodemailer (SendGrid prod / Mailtrap dev)                     |
| **Templating**  | Pug (server-rendered views)                                   |
| **Security**    | Helmet, express-rate-limit, express-mongo-sanitize, HPP, CORS |
| **Deployment**  | Render / Heroku-ready with trust proxy                        |

### Design Patterns

- **Factory Handler Pattern** — Generic `getAll`, `getOne`, `createOne`, `updateOne`, `deleteOne` handlers via `handlerFactory.js`
- **Middleware Chaining** — Auth → Validation → Business Logic → Response
- **Nested Routes** — `POST /tours/:tourId/reviews` merges into the Reviews router
- **Virtual Populate** — Tour reviews loaded on demand without persisting refs

---

## 🔐 Authentication

All protected endpoints require a **JWT Bearer token** in the `Authorization` header or an `httpOnly` cookie named `jwt`.

```
Authorization: Bearer <your_jwt_token>
```

### Roles & Permissions

| Role         | Capabilities                                                         |
| ------------ | -------------------------------------------------------------------- |
| `user`       | Browse tours, book tours, write/edit own reviews, manage favourites  |
| `guide`      | View monthly plans                                                   |
| `lead-guide` | Create/update/delete tours, view bookings & plans                    |
| `admin`      | Full access — manage all users, tours, bookings, reviews, favourites |

### Rate Limiting

- **100 requests per hour** per IP on all `/api` routes
- Returns `429 Too Many Requests` when exceeded

---

## 📐 API Conventions

### Response Format

All responses follow the **JSend** specification:

```json
{
  "status": "success",
  "results": 10,
  "data": {
    "data": [ ... ]
  }
}
```

### Query Features (on all `getAll` endpoints)

| Feature          | Example                           | Description                                 |
| ---------------- | --------------------------------- | ------------------------------------------- |
| **Filter**       | `?difficulty=easy&price[gte]=500` | MongoDB operators: `gte`, `gt`, `lte`, `lt` |
| **Sort**         | `?sort=-price,ratingAverage`      | Prefix `-` for descending                   |
| **Field Select** | `?fields=name,price,duration`     | Comma-separated field names                 |
| **Paginate**     | `?page=2&limit=10`                | Default limit: 100                          |

### Allowed Filter Fields (HPP Whitelist)

`duration`, `ratingQuantity`, `ratingAverage`, `maxGroupSize`, `difficulty`, `price`

---

## 🏔 Tours

Base path: `/api/v1/tours`

### Endpoints

| Method   | Endpoint                                            | Auth | Role                           | Description                           |
| -------- | --------------------------------------------------- | ---- | ------------------------------ | ------------------------------------- |
| `GET`    | `/`                                                 | —    | Public                         | Get all tours (with query features)   |
| `GET`    | `/:id`                                              | —    | Public                         | Get a single tour (populates reviews) |
| `POST`   | `/`                                                 | ✅   | `admin`, `lead-guide`          | Create a new tour                     |
| `PATCH`  | `/:id`                                              | ✅   | `admin`, `lead-guide`          | Update a tour (supports image upload) |
| `DELETE` | `/:id`                                              | ✅   | `admin`, `lead-guide`          | Delete a tour                         |
| `GET`    | `/top-5-cheap`                                      | —    | Public                         | Alias: top 5 cheapest, highest-rated  |
| `GET`    | `/tour-stats`                                       | —    | Public                         | Aggregated statistics by difficulty   |
| `GET`    | `/monthly-plan/:year`                               | ✅   | `admin`, `lead-guide`, `guide` | Tour starts per month for a year      |
| `GET`    | `/tours-within/:distance/center/:latlng/unit/:unit` | —    | Public                         | Tours within a radius (geospatial)    |
| `GET`    | `/distances/:latlng/unit/:unit`                     | —    | Public                         | Distances to all tours from a point   |

### Example — Get All Tours

```
GET /api/v1/tours?difficulty=easy&sort=-price&fields=name,price,duration&page=1&limit=5
```

```json
{
  "status": "success",
  "results": 5,
  "data": {
    "data": [
      {
        "_id": "5c88fa8cf4afda39709c2955",
        "name": "The Sea Explorer",
        "duration": 7,
        "price": 497,
        "difficulty": "medium",
        "ratingAverage": 4.8,
        "ratingQuantity": 23,
        "maxGroupSize": 15,
        "summary": "Exploring the jaw-dropping US east coast by foot and by boat",
        "imageCover": "tour-2-cover.jpg",
        "startLocation": {
          "type": "Point",
          "coordinates": [-80.128473, 25.781842],
          "address": "301 Biscayne Blvd, Miami, FL 33132",
          "description": "Miami, USA"
        },
        "guides": [
          { "_id": "...", "name": "...", "email": "...", "photo": "..." }
        ]
      }
    ]
  }
}
```

### Example — Geospatial: Tours Within 300 miles of NYC

```
GET /api/v1/tours/tours-within/300/center/40.7128,-74.0060/unit/mi
```

### Image Upload (PATCH)

Upload `imageCover` (1 file) and `images` (up to 3 files) as `multipart/form-data`. Images are auto-resized to **2000×1333px** JPEG at 90% quality.

---

## 👤 Users & Authentication

Base path: `/api/v1/users`

### Public Endpoints (No Auth)

| Method  | Endpoint                | Description                               |
| ------- | ----------------------- | ----------------------------------------- |
| `POST`  | `/signup`               | Register a new user (sends welcome email) |
| `POST`  | `/login`                | Login with email & password               |
| `GET`   | `/logout`               | Clear JWT cookie                          |
| `POST`  | `/forgotPassword`       | Request password reset email              |
| `PATCH` | `/resetPassword/:token` | Reset password with token                 |

### Protected Endpoints (Logged-in Users)

| Method   | Endpoint            | Description                                 |
| -------- | ------------------- | ------------------------------------------- |
| `GET`    | `/me`               | Get current user's profile                  |
| `PATCH`  | `/updateMe`         | Update name, email, or photo (multipart)    |
| `PATCH`  | `/updateMyPassword` | Change password (requires current password) |
| `DELETE` | `/deleteMe`         | Deactivate account (soft delete)            |

### Admin-Only Endpoints

| Method   | Endpoint | Description                       |
| -------- | -------- | --------------------------------- |
| `GET`    | `/`      | Get all users                     |
| `GET`    | `/:id`   | Get a user by ID                  |
| `PATCH`  | `/:id`   | Update a user (not for passwords) |
| `DELETE` | `/:id`   | Permanently delete a user         |

### Example — Sign Up

```
POST /api/v1/users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "test1234",
  "passwordConfirm": "test1234"
}
```

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "664a1b2c3d4e5f6a7b8c9d0e",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "photo": "default.jpg"
    }
  }
}
```

### Example — Update Profile with Photo

```
PATCH /api/v1/users/updateMe
Content-Type: multipart/form-data
Authorization: Bearer <token>

name: John Updated
photo: <file>
```

User photos are auto-resized to **500×500px** JPEG.

---

## ⭐ Reviews

Base path: `/api/v1/reviews`  
Nested path: `/api/v1/tours/:tourId/reviews`

> **Business rule:** Users can only review tours they have booked. Duplicate reviews per tour are prevented.

### Endpoints (All Protected)

| Method   | Endpoint | Auth | Role            | Description                                               |
| -------- | -------- | ---- | --------------- | --------------------------------------------------------- |
| `GET`    | `/`      | ✅   | Any             | Get all reviews (filterable by `tourId` via nested route) |
| `GET`    | `/:id`   | ✅   | Any             | Get a single review                                       |
| `POST`   | `/`      | ✅   | `user`          | Create a review (booking required, no duplicates)         |
| `PATCH`  | `/:id`   | ✅   | `user`, `admin` | Update a review                                           |
| `DELETE` | `/:id`   | ✅   | `user`, `admin` | Delete a review                                           |

### Example — Create Review (Nested Route)

```
POST /api/v1/tours/5c88fa8cf4afda39709c2955/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "review": "Amazing tour! The views were breathtaking.",
  "rating": 5
}
```

> ℹ️ **Auto-calculation:** When a review is created, updated, or deleted, the tour's `ratingAverage` and `ratingQuantity` are automatically recalculated via Mongoose middleware.

---

## 💳 Bookings

Base path: `/api/v1/bookings`  
Nested paths: `/api/v1/tours/:tourId/bookings` · `/api/v1/users/:userId/bookings`

### Endpoints

| Method   | Endpoint                    | Auth | Role                  | Description                      |
| -------- | --------------------------- | ---- | --------------------- | -------------------------------- |
| `GET`    | `/checkout-session/:tourId` | ✅   | Any                   | Create a Stripe checkout session |
| `GET`    | `/`                         | ✅   | `admin`, `lead-guide` | Get all bookings                 |
| `GET`    | `/:id`                      | ✅   | `admin`, `lead-guide` | Get a booking by ID              |
| `POST`   | `/`                         | ✅   | `admin`, `lead-guide` | Manually create a booking        |
| `PATCH`  | `/:id`                      | ✅   | `admin`, `lead-guide` | Update a booking                 |
| `DELETE` | `/:id`                      | ✅   | `admin`, `lead-guide` | Delete a booking                 |

### Checkout Flow

```
GET /api/v1/bookings/checkout-session/5c88fa8cf4afda39709c2955?startDate=2025-06-15&numPeople=2
Authorization: Bearer <token>
```

**How it works:**

1. Client requests a checkout session with `tourId`, `startDate`, and `numPeople`
2. Server validates date availability & reserves spots
3. Returns a Stripe session → client redirects to Stripe Checkout
4. On success: booking is created via **Stripe webhook** (`checkout.session.completed`) or **redirect fallback**
5. Duplicate bookings (same user + tour + date) are prevented via unique compound index

### Webhook Endpoint

```
POST /webhook-checkout
Content-Type: application/json (raw body for Stripe signature verification)
```

---

## ❤️ Favourites

Base path: `/api/v1/favourites`

### Endpoints (All Protected)

| Method   | Endpoint          | Auth | Role    | Description                             |
| -------- | ----------------- | ---- | ------- | --------------------------------------- |
| `POST`   | `/toggle/:tourId` | ✅   | Any     | Toggle favourite on/off for a tour      |
| `GET`    | `/check/:tourId`  | ✅   | Any     | Check if current user favourited a tour |
| `GET`    | `/my-favourites`  | ✅   | Any     | Get all favourited tours (populated)    |
| `GET`    | `/`               | ✅   | `admin` | Get all favourites (admin)              |
| `DELETE` | `/:id`            | ✅   | `admin` | Delete a favourite (admin)              |

### Example — Toggle Favourite

```
POST /api/v1/favourites/toggle/5c88fa8cf4afda39709c2955
Authorization: Bearer <token>
```

**Response (added):**

```json
{ "status": "success", "data": { "favourited": true } }
```

**Response (removed):**

```json
{ "status": "success", "data": { "favourited": false } }
```

---

## ⚠️ Error Handling

All errors return a consistent structure:

```json
{
  "status": "fail",
  "message": "Descriptive error message"
}
```

### HTTP Status Codes

| Code  | Meaning                                           |
| ----- | ------------------------------------------------- |
| `200` | OK — Request succeeded                            |
| `201` | Created — Resource created                        |
| `204` | No Content — Successful deletion                  |
| `400` | Bad Request — Validation error or malformed input |
| `401` | Unauthorized — Missing or invalid authentication  |
| `403` | Forbidden — Insufficient role permissions         |
| `404` | Not Found — Resource does not exist               |
| `429` | Too Many Requests — Rate limit exceeded           |
| `500` | Internal Server Error — Unexpected server failure |

### Development vs Production

- **Development:** Full error stack trace + error details returned
- **Production:** Clean, user-friendly error messages only

---

## 📦 Data Models

### Tour

| Field            | Type       | Required | Description                       |
| ---------------- | ---------- | -------- | --------------------------------- |
| `name`           | String     | ✅       | Unique, 10–40 chars               |
| `slug`           | String     | —        | Auto-generated from name          |
| `duration`       | Number     | ✅       | Duration in days                  |
| `maxGroupSize`   | Number     | ✅       | Maximum participants              |
| `difficulty`     | String     | ✅       | `easy` · `medium` · `difficult`   |
| `ratingAverage`  | Number     | —        | 1.0–5.0, default 4.5              |
| `ratingQuantity` | Number     | —        | Count of reviews                  |
| `price`          | Number     | ✅       | Tour price in USD                 |
| `priceDiscount`  | Number     | —        | Must be < price                   |
| `summary`        | String     | ✅       | Short description                 |
| `description`    | String     | —        | Full description                  |
| `imageCover`     | String     | ✅       | Cover image filename              |
| `images`         | [String]   | —        | Up to 3 gallery images            |
| `startDates`     | [Object]   | —        | `{ date, participants, soldOut }` |
| `startLocation`  | GeoJSON    | —        | Point with coordinates & address  |
| `locations`      | [GeoJSON]  | —        | Tour stop locations with day      |
| `guides`         | [ObjectId] | —        | References to User (populated)    |

**Virtuals:** `durationWeeks`, `reviews` (virtual populate)  
**Indexes:** `{ price: 1, ratingAverage: -1 }`, `{ slug: 1 }`, `{ startLocation: '2dsphere' }`

### User

| Field             | Type    | Required | Description                                |
| ----------------- | ------- | -------- | ------------------------------------------ |
| `name`            | String  | ✅       | Full name                                  |
| `email`           | String  | ✅       | Unique, validated, lowercase               |
| `photo`           | String  | —        | Profile photo, default `default.jpg`       |
| `role`            | String  | —        | `user` · `guide` · `lead-guide` · `admin`  |
| `password`        | String  | ✅       | Min 8 chars, bcrypt hashed (select: false) |
| `passwordConfirm` | String  | ✅       | Must match password (not persisted)        |
| `active`          | Boolean | —        | Soft delete flag (select: false)           |

### Review

| Field       | Type     | Required | Description                                |
| ----------- | -------- | -------- | ------------------------------------------ |
| `review`    | String   | ✅       | Review text                                |
| `rating`    | Number   | —        | 1–5                                        |
| `createdAt` | Date     | —        | Auto-set                                   |
| `tour`      | ObjectId | ✅       | Reference to Tour                          |
| `user`      | ObjectId | ✅       | Reference to User (populates name & photo) |

**Unique Index:** `{ tour: 1, user: 1 }` — one review per user per tour

### Booking

| Field       | Type     | Required | Description                    |
| ----------- | -------- | -------- | ------------------------------ |
| `tour`      | ObjectId | ✅       | Reference to Tour              |
| `user`      | ObjectId | ✅       | Reference to User              |
| `startDate` | Date     | ✅       | Selected tour start date       |
| `numPeople` | Number   | —        | Default 1, min 1               |
| `price`     | Number   | ✅       | Total price at time of booking |
| `paid`      | Boolean  | —        | Default true                   |
| `createdAt` | Date     | —        | Auto-set                       |

**Unique Index:** `{ tour: 1, user: 1, startDate: 1 }` — prevents duplicate bookings

### Favourite

| Field       | Type     | Required | Description                                |
| ----------- | -------- | -------- | ------------------------------------------ |
| `tour`      | ObjectId | ✅       | Reference to Tour (populated with details) |
| `user`      | ObjectId | ✅       | Reference to User                          |
| `createdAt` | Date     | —        | Auto-set                                   |

**Unique Index:** `{ tour: 1, user: 1 }` — one favourite per user per tour

---

## 🔑 Environment Variables

| Variable                | Description                         |
| ----------------------- | ----------------------------------- |
| `NODE_ENV`              | `development` or `production`       |
| `DATABASE`              | MongoDB connection string           |
| `JWT_SECRET`            | Secret key for signing JWTs         |
| `JWT_EXPIRESIN`         | Token expiry (e.g. `90d`)           |
| `JWT_COOKIE_EXPIRES_IN` | Cookie expiry in days               |
| `STRIPE_SECRET_KEY`     | Stripe API secret key               |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret       |
| `EMAIL_FROM`            | Sender email address                |
| `SENDGRID_USERNAME`     | SendGrid SMTP username (production) |
| `SENDGRID_PASSWORD`     | SendGrid SMTP password (production) |
| `EMAIL_HOST`            | Mailtrap SMTP host (development)    |
| `EMAIL_PORT`            | Mailtrap SMTP port (development)    |

---

## 🚀 Quick Start

```bash
# Clone & install
git clone https://github.com/Ad1ty4C0des/Natours_BackendProject.git
cd natours && npm install

# Configure environment
cp config.env.example config.env   # Add your credentials

# Import sample data
npm run import:data

# Start development server
npm run dev                        # http://127.0.0.1:3000
```

---

## 📊 API Summary

| Resource       | Endpoints | Public | Auth Required |
| -------------- | --------- | ------ | ------------- |
| **Tours**      | 10        | 6      | 4             |
| **Users/Auth** | 13        | 5      | 8             |
| **Reviews**    | 5         | 0      | 5             |
| **Bookings**   | 6         | 0      | 6             |
| **Favourites** | 5         | 0      | 5             |
| **Total**      | **39**    | **11** | **28**        |

---

> **Built with** ❤️ using Node.js, Express, MongoDB, Stripe, and modern security best practices.  
> **Author:** Aditya Pratap
