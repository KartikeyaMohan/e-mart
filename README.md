# eMart — E-Commerce Backend

A microservices-based e-commerce backend built with Node.js, Express, MySQL, Sequelize, and Docker.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Services](#services)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Migrations](#database-migrations)
- [Image Uploads](#image-uploads)
- [Rating Cron Job](#rating-cron-job)

---

## Architecture Overview

All client requests go through the **API Gateway** on port `3000`. The gateway handles JWT authentication and proxies requests to the appropriate upstream service. Services communicate with each other over an internal Docker network and are not directly accessible in production.

```
Client (Postman / Frontend)
        │
        ▼
  api-gateway :3000
        │
        ├──── /api/v1/auth/*          ──► user-service:3001
        ├──── /api/v1/users/*         ──► user-service:3001
        ├──── /api/v1/addresses/*     ──► user-service:3001
        ├──── /api/v1/brands/*        ──► product-service:3002
        ├──── /api/v1/product-types/* ──► product-service:3002
        ├──── /api/v1/products/*      ──► product-service:3002
        ├──── /api/v1/orders/*        ──► order-service:3003
        ├──── /api/v1/cart/*          ──► order-service:3003
        └──── /api/v1/reviews/*       ──► order-service:3003
```

Each service has its own dedicated MySQL database. There are no cross-service database joins — referential integrity across services is enforced at the application layer.

---

## Project Structure

```
e-mart/
├── docker-compose.yml
├── package.json                  # npm workspaces root
├── package-lock.json             # single lockfile for all workspaces
├── .env.example
├── .gitignore
│
├── shared/                       # shared code used across all services
│   ├── package.json
│   ├── middleware/
│   │   └── authenticate.js       # JWT verification middleware factory
│   └── utils/
│       └── response.js           # standardized API response helpers
│
└── services/
    ├── api-gateway/              # port 3000 — single entry point for all clients
    │   ├── Dockerfile
    │   ├── package.json
    │   └── src/
    │       ├── index.js
    │       ├── config/
    │       ├── middleware/
    │       └── routes/
    │
    ├── user-service/             # port 3001 — users, addresses, auth
    │   ├── Dockerfile
    │   ├── package.json
    │   ├── .sequelizerc
    │   └── src/
    │       ├── index.js
    │       ├── config/
    │       ├── models/
    │       ├── migrations/
    │       ├── controllers/
    │       ├── services/
    │       ├── middleware/
    │       └── routes/
    │
    ├── product-service/          # port 3002 — brands, product types, products
    │   ├── Dockerfile
    │   ├── package.json
    │   ├── .sequelizerc
    │   └── src/
    │       ├── index.js
    │       ├── config/
    │       ├── models/
    │       ├── migrations/
    │       ├── controllers/
    │       ├── services/
    │       ├── utils/
    │       └── routes/
    │
    └── order-service/            # port 3003 — orders, cart, reviews
        ├── Dockerfile
        ├── package.json
        ├── .sequelizerc
        └── src/
            ├── index.js
            ├── config/
            ├── models/
            ├── migrations/
            ├── controllers/
            ├── services/
            ├── crons/
            └── routes/
```

---

## Services

### API Gateway
Single entry point for all client requests. Handles JWT verification, rate limiting, and proxies requests to upstream services. Only port `3000` is exposed to the host machine.

### User Service
Handles user identity and addresses.

**Database:** `user_db`
**Models:** `User`, `Address`

### Product Service
Handles the product catalogue including brands, product types, and products. Supports image uploads to AWS S3.

**Database:** `product_db`
**Models:** `Brand`, `ProductType`, `Product`

### Order Service
Handles the shopping cart, order placement, order tracking, and product reviews. Runs a nightly cron job to update product ratings in product-service.

**Database:** `order_db`
**Models:** `Order`, `Review`, `Cart`, `CartItem`

---

## Tech Stack

| Concern | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express.js |
| Database | MySQL 8.0 |
| ORM | Sequelize 6 |
| Auth | JSON Web Tokens (JWT) |
| Image Storage | AWS S3 |
| File Uploads | Multer + multer-s3 |
| Containerisation | Docker + Docker Compose |
| Cron Jobs | node-cron |
| Rate Limiting | express-rate-limit |
| Security Headers | helmet |

---

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js 20](https://nodejs.org/) (for local development outside Docker)
- An [AWS account](https://aws.amazon.com/) with an S3 bucket and IAM credentials

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/e-mart.git
cd e-mart
```

### 2. Set up environment files

Copy the example env files and fill in the values for each service:

```bash
cp .env.example .env
cp services/api-gateway/.env.example services/api-gateway/.env
cp services/user-service/.env.example services/user-service/.env
cp services/product-service/.env.example services/product-service/.env
cp services/order-service/.env.example services/order-service/.env
```

### 3. Install dependencies (for local development)

```bash
npm install
```

Since this project uses npm workspaces, this single command installs dependencies for all services and the shared package.

### 4. Start all services

```bash
docker compose up --build
```

Or start a specific service:

```bash
docker compose up --build user-service
```

### 5. Run migrations

Run migrations for each service after the containers are up:

```bash
docker compose exec user-service npm run migrate
docker compose exec product-service npm run migrate
docker compose exec order-service npm run migrate
```

### 6. Verify everything is running

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "api-gateway",
  "upstreams": {
    "userService": "http://user-service:3001",
    "productService": "http://product-service:3002",
    "orderService": "http://order-service:3003"
  }
}
```

---

## Environment Variables

### Root `.env`

| Variable | Description |
|---|---|
| `MYSQL_ROOT_PASSWORD` | Root password used by all MySQL containers |

### `api-gateway/.env`

| Variable | Description |
|---|---|
| `PORT` | Gateway port (default: 3000) |
| `JWT_SECRET` | Secret for verifying access tokens |
| `USER_SERVICE_URL` | Internal URL for user-service |
| `PRODUCT_SERVICE_URL` | Internal URL for product-service |
| `ORDER_SERVICE_URL` | Internal URL for order-service |

### `user-service/.env`

| Variable | Description |
|---|---|
| `PORT` | Service port (default: 3001) |
| `DB_HOST` | MySQL host (`mysql-user` inside Docker) |
| `DB_PORT` | MySQL port (`3306` inside Docker) |
| `DB_NAME` | Database name (`user_db`) |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `JWT_AUTH_EXPIRES_IN` | Duration for auth token validity |
| `JWT_REFRES_EXPIRES_IN` | Duration for refresh token validity |

### `product-service/.env`

| Variable | Description |
|---|---|
| `PORT` | Service port (default: 3002) |
| `DB_HOST` | MySQL host (`mysql-product` inside Docker) |
| `DB_PORT` | MySQL port (`3306` inside Docker) |
| `DB_NAME` | Database name (`product_db`) |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret for verifying access tokens |
| `AWS_REGION` | AWS region for S3 |
| `AWS_ACCESS_KEY` | IAM access key |
| `AWS_SECRET_KEY` | IAM secret key |
| `AWS_S3_BUCKET` | S3 bucket name for product images |

### `order-service/.env`

| Variable | Description |
|---|---|
| `PORT` | Service port (default: 3003) |
| `DB_HOST` | MySQL host (`mysql-order` inside Docker) |
| `DB_PORT` | MySQL port (`3306` inside Docker) |
| `DB_NAME` | Database name (`order_db`) |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret for verifying access tokens |
| `PRODUCT_SERVICE_URL` | Internal URL for product-service (used by rating cron) |

> `JWT_SECRET` must be the same value across all services and the gateway. `JWT_REFRESH_SECRET` is only needed in user-service.

---

## API Reference

All requests go through `http://localhost:3000`. Protected routes require a `Bearer` token in the `Authorization` header.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | No | Register a new user |
| POST | `/api/v1/auth/login` | No | Login and receive access + refresh tokens |
| POST | `/api/v1/auth/refresh` | No | Get a new token pair using a refresh token |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/users/profile` | Yes | Get the logged-in user's profile |

### Addresses

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/addresses` | Yes | Get all addresses for the logged-in user |
| POST | `/api/v1/addresses` | Yes | Create a new address |

### Brands

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/brands` | No | List all brands |
| GET | `/api/v1/brands/:id` | No | Get a brand |
| POST | `/api/v1/brands` | Yes | Create a brand |
| PUT | `/api/v1/brands/:id` | Yes | Update a brand |
| DELETE | `/api/v1/brands/:id` | Yes | Delete a brand |

### Product Types

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/product-types` | No | List all product types |
| GET | `/api/v1/product-types/:id` | No | Get a product type |
| POST | `/api/v1/product-types` | Yes | Create a product type |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/products` | No | List all products (filter by `?brand_id=&product_type_id=`) |
| GET | `/api/v1/products/:id` | No | Get a product |
| POST | `/api/v1/products` | Yes | Create a product (multipart/form-data) |
| PUT | `/api/v1/products/:id` | Yes | Update a product (multipart/form-data) |
| DELETE | `/api/v1/products/:id` | Yes | Delete a product |

### Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/cart` | Yes | Get the logged-in user's cart |
| POST | `/api/v1/cart/items` | Yes | Add a product to cart |
| PATCH | `/api/v1/cart/items/:productId` | Yes | Update quantity of a cart item |
| DELETE | `/api/v1/cart/items/:productId` | Yes | Remove a specific item from cart |
| DELETE | `/api/v1/cart` | Yes | Clear all items from cart |

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/orders` | Yes | Get all orders for the logged-in user |
| GET | `/api/v1/orders/:id` | Yes | Get a specific order |
| POST | `/api/v1/orders` | Yes | Place an order |
| PATCH | `/api/v1/orders/:id/status` | Yes | Update order track status |

**Valid `track_status` values:** `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/reviews/product/:productId` | No | Get all reviews for a product |
| POST | `/api/v1/reviews` | Yes | Submit a review (order must be delivered) |

---

## Database Migrations

Migrations are managed per service using Sequelize CLI.

```bash
# Run all pending migrations
docker compose exec user-service npm run migrate
docker compose exec product-service npm run migrate
docker compose exec order-service npm run migrate

# Undo the last migration
docker compose exec user-service npm run migrate:undo
docker compose exec product-service npm run migrate:undo
docker compose exec order-service npm run migrate:undo
```

Each service's `package.json` has these scripts defined:

```json
"scripts": {
  "migrate": "sequelize-cli db:migrate",
  "migrate:undo": "sequelize-cli db:migrate:undo"
}
```

---

## Image Uploads

Product images are stored in AWS S3. The `image_key` (S3 object key) is stored in the database rather than the full URL, so the storage location can be changed without a database migration.

When fetching products, a **presigned S3 URL** valid for 1 hour is generated and returned as `image_url` in the response.

### Upload an image (Postman)

Use `multipart/form-data` for create and update product requests:

```
POST /api/v1/products
Content-Type: multipart/form-data

name            → Running Shoes
price           → 999.99
brand_id        → 1
product_type_id → 2
image           → [select file]
```

### AWS IAM setup

The IAM user attached to the access keys needs the following S3 permissions on your bucket:

```json
{
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:GetObject",
    "s3:DeleteObject"
  ],
  "Resource": "arn:aws:s3:::your-bucket-name/*"
}
```

---

## Rating Cron Job

A cron job runs every day at **00:00 UTC** inside order-service. It computes the average score and review count for every product that has reviews, then calls an internal endpoint on product-service to update the `average_rating` and `review_count` columns on the products table.

```
order-service cron (00:00 UTC)
  │
  ├── SELECT product_id, AVG(score), COUNT(id) FROM reviews GROUP BY product_id
  │
  └── PATCH http://product-service:3002/api/v1/products/:id/rating
            { average_rating, review_count }
```

This endpoint is internal and not exposed through the API gateway.