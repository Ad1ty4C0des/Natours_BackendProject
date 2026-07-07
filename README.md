<div align="center">

# 🏔️ Natours

### *Where Adventure Meets Elegance*

[![Node.js](https://img.shields.io/badge/Node.js-≥20.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Pug](https://img.shields.io/badge/Pug-Templates-A86454?style=for-the-badge&logo=pug&logoColor=white)](https://pugjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#-docker)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

<br/>

A premium, full-stack tour booking platform with server-side rendering, real-time payments, interactive maps, and a modern editorial design system. Built with security, performance, and beautiful UX at its core.

<br/>

[Explore the API »](#-api-reference) · [Report Bug](../../issues) · [Request Feature](../../issues)

---

</div>

<br/>

## ✨ Highlights

<table>
<tr>
<td width="50%">

### 🎨 Modern Editorial UI
A fully custom design system with **Noto Serif** + **Plus Jakarta Sans** typography, Material Design 3 color tokens, glassmorphism panels, micro-animations, and a polished dark/light mode — no cookie-cutter templates.

</td>
<td width="50%">

### 💳 Stripe Checkout
End-to-end payment flow with **Stripe Checkout Sessions**, webhook verification for production, and a redirect-based fallback for development — with built-in duplicate booking prevention.

</td>
</tr>
<tr>
<td width="50%">

### 🗺️ Interactive Mapbox Maps
Every tour comes alive with an interactive **Mapbox GL JS** map pinpointing all tour locations and stops, rendered with custom markers and smooth fly-to animations.

</td>
<td width="50%">

### 🔐 Enterprise-Grade Security
Helmet CSP, rate limiting, NoSQL injection sanitization, HPP, bcrypt password hashing, JWT auth with HTTP-only cookies, and role-based access control out of the box.

</td>
</tr>
</table>

<br/>

## 🏗️ Architecture

```
Natours/
├── controllers/          # Request handlers & business logic
│   ├── authController    # JWT auth, signup, login, password reset
│   ├── bookingController # Stripe checkout, webhooks, availability
│   ├── tourController    # CRUD, stats, geospatial queries, image upload
│   ├── reviewController  # Tour reviews with rating aggregation
│   ├── favouriteController # Wishlist / heart functionality
│   ├── userController    # Profile management, photo upload
│   ├── viewsController   # SSR page rendering
│   ├── errorController   # Global error handling (dev vs prod)
│   └── handlerFactory    # DRY generic CRUD factory
├── models/               # Mongoose schemas & middleware
│   ├── tourModel         # Tours with GeoJSON, virtuals, indexes
│   ├── userModel         # Users with bcrypt & reset tokens
│   ├── bookingModel      # Bookings with duplicate prevention
│   ├── reviewModel       # Reviews with auto rating calc
│   └── favouriteModel    # User-tour wishlists
├── routes/               # Express routers
│   ├── tourRoutes        # Nested reviews & bookings
│   ├── userRoutes        # Auth + profile endpoints
│   ├── reviewRoutes      # Merge-param nested routes
│   ├── bookingRoutes     # Payment & booking management
│   ├── favouriteRoutes   # Wishlist API
│   └── viewRoutes        # SSR pages + admin panel
├── views/                # Pug templates (22 pages + email templates)
│   ├── base.pug          # Master layout with design system
│   ├── overview.pug      # Homepage with hero & tour grid
│   ├── tour.pug          # Tour detail with gallery & booking
│   ├── account.pug       # User dashboard
│   ├── email/            # Transactional email templates
│   └── ...               # Login, signup, admin panels, etc.
├── public/               # Static assets
│   ├── css/style.css     # Custom stylesheet
│   ├── js/               # Client-side modules (esbuild bundled)
│   └── img/              # Tour images, user photos, icons
├── utils/                # Shared utilities
│   ├── apiFeatures       # Filter, sort, paginate, field-limit
│   ├── email             # Nodemailer + SendGrid + Pug templates
│   ├── appError          # Custom error class
│   └── catchAsync        # Async error wrapper
├── app.js                # Express app configuration
├── server.js             # Server entry point + MongoDB connection
└── package.json          # Dependencies & scripts
```

<br/>

## 🚀 Features

### 🌍 Tours
- Browse curated adventure tours with rich imagery and detailed itineraries
- **Geospatial queries** — find tours within a radius of your location
- Calculate distances to all tours from any GPS coordinate
- Tour statistics aggregation pipeline (avg price, ratings by difficulty)
- Monthly plan reports for business intelligence
- **Image upload & processing** — cover + 3 gallery images resized via Sharp

### 👤 Authentication & Users
- **JWT-based authentication** with secure HTTP-only cookies
- Sign up with welcome email, login, logout
- **Password reset flow** — forgot password → email with token → reset page
- Update profile info and photo (Multer + Sharp resize to 500×500)
- Role-based access: `user` · `guide` · `lead-guide` · `admin`

### 💰 Bookings
- **Stripe Checkout** with real-time availability tracking
- Select tour dates and group size with reactive spot counters
- **Double-booking prevention** via compound unique indexes
- Webhook-verified payment confirmation (production)
- Redirect-based fallback (development)

### ⭐ Reviews
- Leave reviews with 1–5 star ratings (verified booking required)
- **Auto-calculated** average ratings via aggregation pipeline
- One review per user per tour (enforced at DB level)
- Dedicated review pages per tour

### ❤️ Favourites
- Heart/wishlist system to save tours for later
- Toggle favourite with instant UI feedback
- View all favourited tours in your dashboard

### 🎨 Frontend
- **Server-side rendered** pages with Pug templates
- Full-screen hero sections with parallax effects
- Responsive card grids with hover animations
- **Dark mode** with localStorage persistence + system preference detection
- Smooth page transitions with loading overlays and progress bars
- Glassmorphism panels and gradient CTAs
- Google Material Symbols icons throughout

### 🛡️ Security
| Layer | Implementation |
|-------|----------------|
| HTTP Headers | Helmet with strict CSP directives |
| Rate Limiting | 100 req/hr per IP on API routes |
| Data Sanitization | `express-mongo-sanitize` against NoSQL injection |
| Parameter Pollution | `hpp` with field whitelist |
| Password Storage | bcrypt with 12 salt rounds |
| Auth Tokens | JWT with expiry + HTTP-only cookies |
| Input Validation | Mongoose validators + `validator.js` |
| Error Handling | Operational vs programming errors with stack traces in dev |

### 📧 Emails
- **Pug-templated** transactional emails
- Welcome email on signup
- Password reset email with secure token
- **SendGrid** in production, **Mailtrap** for dev testing

### ⚙️ Admin Panel
- Manage Tours, Users, Reviews, and Bookings
- Restricted to `admin` role via middleware

<br/>

## 📦 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Runtime** | Node.js ≥ 20 |
| **Framework** | Express 4 |
| **Database** | MongoDB Atlas + Mongoose 8 |
| **Templating** | Pug 3 |
| **Payments** | Stripe Checkout |
| **Maps** | Mapbox GL JS |
| **Auth** | JSON Web Tokens + bcryptjs |
| **File Upload** | Multer 2 + Sharp |
| **Email** | Nodemailer + SendGrid / Mailtrap |
| **Bundler** | esbuild |
| **Styling** | Tailwind CSS (CDN) + Custom CSS |
| **Typography** | Noto Serif + Plus Jakarta Sans |
| **Icons** | Material Symbols Outlined |
| **Containerization** | Docker + Docker Compose |
| **Linting** | ESLint 9 + Prettier |

<br/>

## 🛠️ Getting Started

### Prerequisites

- **Node.js** ≥ 20.0.0
- **MongoDB** — [Atlas](https://www.mongodb.com/cloud/atlas) (recommended) or local
- **Stripe** account — [dashboard.stripe.com](https://dashboard.stripe.com/)
- **Mapbox** token — [mapbox.com](https://www.mapbox.com/)
- **Mailtrap** (dev) or **SendGrid** (prod) for emails

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/natours.git
cd natours

# Install dependencies
npm install

# Create your environment config
cp config.env.example config.env
```

### Environment Variables

Create a `config.env` file in the root directory:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE=mongodb+srv://<user>:<PASSWORD>@cluster.mongodb.net/natours
DATABASE_PASSWORD=your_db_password

# JWT
JWT_SECRET=your-ultra-secure-secret-key-at-least-32-chars
JWT_EXPIRESIN=90d
JWT_COOKIE_EXPIRES_IN=90

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mapbox
MAPBOX_TOKEN=pk.eyJ1...

# Email (Development — Mailtrap)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_USERNAME=your_mailtrap_user
EMAIL_PASSWORD=your_mailtrap_pass
EMAIL_FROM=hello@natours.io

# Email (Production — SendGrid)
SENDGRID_USERNAME=apikey
SENDGRID_PASSWORD=SG.your_sendgrid_key
```

### Running Locally

```bash
# Development mode (with hot-reload)
npm run dev

# Build client-side JS bundle
npm run build:js

# Watch mode for JS changes
npm run watch:js

# Production mode
npm run prod
```

The app will be running at **`http://localhost:3000`**

### 🐳 Docker

You can also run Natours using Docker — no Node.js installation required.

#### Quick Start (Docker Run)

```bash
# Build the image
docker build -t natours:1.0 .

# Run the container
docker run -d --name natours-app -p 3000:3000 --env-file config.env -e NODE_ENV=development natours:1.0
```

#### Using Docker Compose

```bash
# Build and start
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down
```

#### Pull from Docker Hub

No need to clone the repo — just pull the pre-built image:

```bash
docker pull adityapratap07/natours:latest

docker run -d --name natours-app -p 3000:3000 \
  -e NODE_ENV=development \
  -e DATABASE=your_mongodb_connection_string \
  -e DATABASE_PASSWORD=your_password \
  -e JWT_SECRET=your_jwt_secret \
  -e JWT_EXPIRESIN=90d \
  -e JWT_COOKIE_EXPIRES_IN=90 \
  -e STRIPE_SECRET_KEY=sk_test_... \
  -e MAPBOX_TOKEN=pk.eyJ1... \
  adityapratap07/natours:latest
```

> **Note:** Replace the environment variable values above with your own credentials. See [Environment Variables](#environment-variables) for the full list.

The app will be running at **`http://localhost:3000`**

### Seed Data

```bash
# Import sample tour data
npm run import:data

# Delete all data
npm run delete:data
```

<br/>

## 📡 API Reference

Base URL: `/api/v1`

### Tours

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/tours` | Get all tours (filter, sort, paginate) | Public |
| `GET` | `/tours/:id` | Get single tour with reviews | Public |
| `POST` | `/tours` | Create a tour | Admin, Lead Guide |
| `PATCH` | `/tours/:id` | Update a tour (+ image upload) | Admin, Lead Guide |
| `DELETE` | `/tours/:id` | Delete a tour | Admin, Lead Guide |
| `GET` | `/tours/top-5-cheap` | Top 5 affordable tours | Public |
| `GET` | `/tours/tour-stats` | Aggregated tour statistics | Public |
| `GET` | `/tours/monthly-plan/:year` | Monthly business plan | Admin, Lead Guide, Guide |
| `GET` | `/tours/tours-within/:distance/center/:latlng/unit/:unit` | Tours within radius | Public |
| `GET` | `/tours/distances/:latlng/unit/:unit` | Distances to all tours | Public |

### Users & Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/users/signup` | Create account | Public |
| `POST` | `/users/login` | Log in | Public |
| `GET` | `/users/logout` | Log out | Public |
| `POST` | `/users/forgotPassword` | Request password reset email | Public |
| `PATCH` | `/users/resetPassword/:token` | Reset password with token | Public |
| `PATCH` | `/users/updateMyPassword` | Change current password | Protected |
| `PATCH` | `/users/updateMe` | Update profile | Protected |
| `DELETE` | `/users/deleteMe` | Deactivate account | Protected |

### Reviews

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/tours/:tourId/reviews` | Get all reviews for a tour | Public |
| `POST` | `/tours/:tourId/reviews` | Create a review | User |
| `PATCH` | `/reviews/:id` | Update a review | User, Admin |
| `DELETE` | `/reviews/:id` | Delete a review | User, Admin |

### Bookings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/bookings/checkout-session/:tourId` | Create Stripe checkout session | Protected |
| `GET` | `/bookings` | Get all bookings | Admin, Lead Guide |
| `POST` | `/bookings` | Create a booking | Admin, Lead Guide |
| `PATCH` | `/bookings/:id` | Update a booking | Admin, Lead Guide |
| `DELETE` | `/bookings/:id` | Delete a booking | Admin, Lead Guide |

### Favourites

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/favourites` | Get user's favourites | Protected |
| `POST` | `/favourites` | Add a favourite | Protected |
| `DELETE` | `/favourites/:id` | Remove a favourite | Protected |

### Query Features

All `GET` collection endpoints support:

```
# Filtering
GET /api/v1/tours?difficulty=easy&duration[gte]=5

# Sorting
GET /api/v1/tours?sort=-price,ratingAverage

# Field Limiting
GET /api/v1/tours?fields=name,price,duration

# Pagination
GET /api/v1/tours?page=2&limit=10
```

<br/>

## 📄 Pages

| Route | Page | Access |
|-------|------|--------|
| `/` | Homepage with hero + tour grid | Public |
| `/tour/:slug` | Tour detail + map + booking | Public |
| `/tour/:slug/reviews` | All reviews for a tour | Public |
| `/login` | Login form | Public |
| `/signup` | Registration form | Public |
| `/forgot-password` | Password reset request | Public |
| `/reset-password/:token` | Password reset form | Public |
| `/me` | User account settings | Protected |
| `/my-tours` | Booked tours | Protected |
| `/my-reviews` | User's reviews | Protected |
| `/my-favourites` | Saved tours | Protected |
| `/billing` | Billing information | Protected |
| `/about` | About Natours | Public |
| `/careers` | Careers page | Public |
| `/privacy` | Privacy policy | Public |
| `/manage-tours` | Admin: manage tours | Admin |
| `/manage-users` | Admin: manage users | Admin |
| `/manage-reviews` | Admin: manage reviews | Admin |
| `/manage-bookings` | Admin: manage bookings | Admin |

<br/>

## 🧪 Scripts

```bash
npm start          # Start the server
npm run dev        # Development with nodemon
npm run prod       # Production mode
npm run debug      # Node.js inspector
npm run build:js   # Bundle client JS with esbuild
npm run watch:js   # Watch & rebuild client JS
npm run import:data # Seed database
npm run delete:data # Purge database
```

<br/>

## 🙏 Acknowledgments

- Built as an extended version of Jonas Schmedtmann's [Node.js project](https://github.com/jonasschmedtmann/complete-node-bootcamp) — significantly enhanced with modern features, a custom editorial UI, Stripe integration, favourites system, dark mode, and more.
- Design inspired by premium travel platforms and modern editorial aesthetics.

<br/>

---

<div align="center">

**Built with ❤️ by [Aditya Pratap](https://github.com/your-username)**

<sub>If you found this project helpful, consider giving it a ⭐</sub>

</div>
