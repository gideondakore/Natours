# Natours API

![CI/CD](https://github.com/gideondakore/Natours/actions/workflows/ci.yml/badge.svg)

A tour booking platform backend API built with Node.js, Express, and MongoDB.

## 📊 Project Status

**Test Status:** 70 tests passing (Sprint 3 COMPLETE)  
**Coverage:** Unit tests + Integration tests + Validation tests  
**Node Version:** 24.x or 25.x  
**Current Sprint:** All sprints complete (Sprint 0-3)

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** v24.0.0 or higher ([Download](https://nodejs.org/))
- **npm:** v11.x or higher (comes with Node.js)
- **MongoDB:** Local instance or MongoDB Atlas account ([Setup Guide](https://www.mongodb.com/docs/atlas/getting-started/))
- **Git:** For version control

**Check your versions:**

```bash
node --version  # Should be v24.x or v25.x
npm --version   # Should be v11.x or higher
```

---

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/gideondakore/Natours.git
cd Natours
```

2. **Install dependencies**

```bash
npm install
```

This will install all required packages including Express, Mongoose, JWT, Stripe, and more.

3. **Configure environment variables**

```bash
cp .env.example .env
```

Then edit `.env` with your actual values (see [Environment Variables](#environment-variables) section below).

4. **Verify installation**

```bash
npm test
```

You should see 18 tests passing.

---

### Running the Application

**Development mode** (with auto-restart):

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

**Run tests:**

```bash
npm test
```

**Run tests in watch mode:**

```bash
npm run test:watch
```

The server will start on `http://localhost:3000` (or the PORT specified in your `.env` file).

---

## 🔧 Environment Variables

All environment variables are defined in `.env.example`. Copy this file to `.env` and fill in your actual values.

### Required Variables

| Variable                | Description               | Example                       |
| ----------------------- | ------------------------- | ----------------------------- |
| `NODE_ENV`              | Environment mode          | `development` or `production` |
| `PORT`                  | Server port               | `3000`                        |
| `DATABASE`              | MongoDB connection string | `mongodb+srv://...`           |
| `DATABASE_PASSWORD`     | MongoDB password          | `yourpassword123`             |
| `JWT_SECRET`            | Secret key for JWT tokens | `my-ultra-secret-key`         |
| `JWT_EXPIRES_IN`        | JWT expiration time       | `90d`                         |
| `JWT_COOKIE_EXPIRES_IN` | Cookie expiration (days)  | `90`                          |

### Optional Variables (for full functionality)

| Variable            | Description                          | When Needed               |
| ------------------- | ------------------------------------ | ------------------------- |
| `EMAIL_FROM`        | Sender email address                 | Sending emails            |
| `MAILTRAP_HOST`     | MailTrap SMTP host                   | Development email testing |
| `MAILTRAP_PORT`     | MailTrap SMTP port                   | Development email testing |
| `MAILTRAP_USERNAME` | MailTrap username                    | Development email testing |
| `MAILTRAP_PASSWORD` | MailTrap password                    | Development email testing |
| `SENDGRID_USERNAME` | SendGrid username (usually `apikey`) | Production emails         |
| `SENDGRID_PASSWORD` | SendGrid API key                     | Production emails         |
| `STRIPE_SECRET_KEY` | Stripe secret key                    | Payment processing        |
| `WEBHOOK_SECRET`    | Stripe webhook secret                | Payment webhooks          |
| `LOCAL_HOST_CLIENT` | Client URL for CORS                  | Frontend integration      |

---

### Obtaining API Keys

**MongoDB Atlas:**

1. Create account at [mongodb.com](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string from "Connect" → "Connect your application"
4. Replace `<password>` with your database user password

**MailTrap (Development):**

1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Go to "Email Testing" → "Inboxes"
3. Get SMTP credentials

**SendGrid (Production):**

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Create API key in Settings → API Keys
3. Use API key as `SENDGRID_PASSWORD`

**Stripe:**

1. Create account at [stripe.com](https://stripe.com)
2. Go to Developers → API keys
3. Use test keys for development

---

## 🧪 Testing

### Running Tests

```bash
npm test                # Run all tests with coverage
npm run test:watch      # Run tests in watch mode
```

### Test Structure

Tests are located in the `__tests__/` directory:

- `health.test.js` - Health endpoint tests (7 tests)
- `appError.test.js` - Error utility tests (6 tests)
- `catchAsync.test.js` - Async wrapper tests (5 tests)

### Writing Tests

Tests use **Jest** and **Supertest**. Example:

```javascript
const request = require("supertest");
const app = require("../app");

describe("My Feature", () => {
  it("should do something", async () => {
    const response = await request(app).get("/api/endpoint");
    expect(response.status).toBe(200);
  });
});
```

---

## 📁 Project Structure

```
Natours/
├── __tests__/              # Test files
├── controllers/            # Route controllers
├── models/                 # Mongoose models
├── routes/                 # Express routes
├── utils/                  # Utility functions
├── views/                  # Pug templates
├── public/                 # Static files
├── .github/workflows/      # CI/CD pipeline
├── app.js                  # Express app configuration
├── server.js               # Server entry point
└── package.json            # Dependencies
```

---

## 🔍 API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Health Check

#### GET /health

Returns server status, uptime, and environment info.

**Authentication:** Not required

**Request:**

```bash
curl http://localhost:3000/api/v1/health
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2026-02-17T10:42:52.612Z",
  "uptime": 12.935,
  "environment": "development",
  "nodeVersion": "v25.2.1"
}
```

---

### Tours

#### GET /tours

Get all tours with optional filtering, sorting, and pagination.

**Authentication:** Not required

**Query Parameters:**

- `duration[gte]` - Filter tours by minimum duration
- `difficulty` - Filter by difficulty (easy, medium, difficult)
- `price[lt]` - Filter by maximum price
- `sort` - Sort by field (e.g., `-price` for descending)
- `limit` - Number of results per page (default: 100)
- `page` - Page number (default: 1)
- `fields` - Select specific fields (e.g., `name,duration,price`)

**Example Request:**

```bash
# Get all tours
curl http://localhost:3000/api/v1/tours

# Get tours with duration >= 5 days and difficulty = easy
curl "http://localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy"

# Get tours sorted by price (ascending)
curl "http://localhost:3000/api/v1/tours?sort=price"
```

**Response (200 OK):**

```json
{
  "status": "success",
  "results": 9,
  "data": {
    "data": [
      {
        "_id": "5c88fa8cf4afda39709c2955",
        "name": "The Sea Explorer",
        "duration": 7,
        "maxGroupSize": 15,
        "difficulty": "medium",
        "price": 497,
        "summary": "Exploring the jaw-dropping US east coast by foot and by boat",
        "imageCover": "tour-2-cover.jpg"
      }
    ]
  }
}
```

---

#### GET /tours/top-5-cheap

Get the top 5 cheapest tours (pre-filtered alias).

**Authentication:** Not required

**Request:**

```bash
curl http://localhost:3000/api/v1/tours/top-5-cheap
```

**Response:** Same format as GET /tours

---

#### GET /tours/:id

Get a single tour by ID.

**Authentication:** Not required

**Request:**

```bash
curl http://localhost:3000/api/v1/tours/5c88fa8cf4afda39709c2955
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "data": {
      "_id": "5c88fa8cf4afda39709c2955",
      "name": "The Sea Explorer",
      "duration": 7,
      "maxGroupSize": 15,
      "difficulty": "medium",
      "ratingsAverage": 4.8,
      "ratingsQuantity": 6,
      "price": 497,
      "summary": "Exploring the jaw-dropping US east coast by foot and by boat",
      "description": "Full tour description...",
      "imageCover": "tour-2-cover.jpg",
      "images": ["tour-2-1.jpg", "tour-2-2.jpg", "tour-2-3.jpg"],
      "startDates": ["2021-06-19T09:00:00.000Z"],
      "guides": [...]
    }
  }
}
```

**Error Response (404 Not Found):**

```json
{
  "status": "fail",
  "message": "No tour found with that ID"
}
```

---

#### POST /tours

Create a new tour.

**Authentication:** Required (Admin or Lead Guide only)

**Headers:**

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Test Tour",
  "duration": 5,
  "maxGroupSize": 25,
  "difficulty": "easy",
  "price": 397,
  "summary": "A test tour summary",
  "imageCover": "tour-1-cover.jpg"
}
```

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/tours \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Tour",
    "duration": 5,
    "maxGroupSize": 25,
    "difficulty": "easy",
    "price": 397,
    "summary": "A test tour summary",
    "imageCover": "tour-1-cover.jpg"
  }'
```

**Response (201 Created):**

```json
{
  "status": "success",
  "data": {
    "data": {
      "_id": "65f1234abcd567890ef12345",
      "name": "Test Tour",
      "duration": 5,
      "maxGroupSize": 25,
      "difficulty": "easy",
      "price": 397,
      "summary": "A test tour summary"
    }
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "status": "fail",
  "message": "You are not logged in. Please log in to get access"
}
```

---

#### PATCH /tours/:id

Update an existing tour.

**Authentication:** Required (Admin or Lead Guide only)

**Headers:**

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/v1/tours/5c88fa8cf4afda39709c2955 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"price": 599}'
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "data": {
      "_id": "5c88fa8cf4afda39709c2955",
      "name": "The Sea Explorer",
      "price": 599
    }
  }
}
```

---

#### DELETE /tours/:id

Delete a tour.

**Authentication:** Required (Admin or Lead Guide only)

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/v1/tours/5c88fa8cf4afda39709c2955 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (204 No Content):**
No response body

---

#### GET /tours/tours-stats

Get tour statistics (aggregation).

**Authentication:** Not required

**Request:**

```bash
curl http://localhost:3000/api/v1/tours/tours-stats
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "stats": [
      {
        "_id": "easy",
        "numTours": 5,
        "numRatings": 26,
        "avgRating": 4.7,
        "avgPrice": 423,
        "minPrice": 397,
        "maxPrice": 497
      }
    ]
  }
}
```

---

#### GET /tours/monthly-plan/:year

Get tour monthly plan for a specific year.

**Authentication:** Required (Guide, Lead Guide, or Admin)

**Request:**

```bash
curl http://localhost:3000/api/v1/tours/monthly-plan/2021 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "plan": [
      {
        "numTourStarts": 2,
        "tours": ["The Sea Explorer", "The Forest Hiker"],
        "month": 7
      }
    ]
  }
}
```

---

#### GET /tours/tours-within/:distance/center/:latlng/unit/:unit

Get tours within a certain distance from a location.

**Authentication:** Not required

**Parameters:**

- `distance` - Radius in specified unit
- `latlng` - Latitude,longitude (e.g., 34.111745,-118.113491)
- `unit` - Distance unit (mi or km)

**Request:**

```bash
curl "http://localhost:3000/api/v1/tours/tours-within/400/center/34.111745,-118.113491/unit/mi"
```

**Response (200 OK):**

```json
{
  "status": "success",
  "results": 3,
  "data": {
    "data": [...]
  }
}
```

---

#### GET /tours/distances/:latlng/unit/:unit

Calculate distances from a point to all tours.

**Authentication:** Not required

**Request:**

```bash
curl "http://localhost:3000/api/v1/tours/distances/34.111745,-118.113491/unit/mi"
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "distance": 224.89,
        "name": "The Sea Explorer"
      }
    ]
  }
}
```

---

### Users & Authentication

#### POST /users/signup

Create a new user account.

**Authentication:** Not required

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "pass1234",
  "passwordConfirm": "pass1234"
}
```

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "pass1234",
    "passwordConfirm": "pass1234"
  }'
```

**Response (201 Created):**

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "65f1234abcd567890ef12345",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

#### POST /users/login

Login with email and password.

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "pass1234"
}
```

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "pass1234"
  }'
```

**Response (200 OK):**

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "65f1234abcd567890ef12345",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "status": "fail",
  "message": "Incorrect email or password"
}
```

---

#### GET /users/logout

Logout current user.

**Authentication:** Not required

**Request:**

```bash
curl http://localhost:3000/api/v1/users/logout
```

**Response (200 OK):**

```json
{
  "status": "success"
}
```

---

#### POST /users/forgotPassword

Request password reset email.

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/users/forgotPassword \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Token sent to email"
}
```

---

#### PATCH /users/resetPassword/:token

Reset password using token from email.

**Authentication:** Not required

**Request Body:**

```json
{
  "password": "newpass1234",
  "passwordConfirm": "newpass1234"
}
```

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/v1/users/resetPassword/abc123token \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newpass1234",
    "passwordConfirm": "newpass1234"
  }'
```

---

#### GET /users/me

Get current user profile.

**Authentication:** Required

**Request:**

```bash
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "data": {
      "_id": "65f1234abcd567890ef12345",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "photo": "default.jpg"
    }
  }
}
```

---

#### PATCH /users/updateMe

Update current user profile (name, email, photo).

**Authentication:** Required

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/v1/users/updateMe \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated"}'
```

---

#### PATCH /users/updateMyPassword

Update current user password.

**Authentication:** Required

**Request Body:**

```json
{
  "passwordCurrent": "pass1234",
  "password": "newpass5678",
  "passwordConfirm": "newpass5678"
}
```

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/v1/users/updateMyPassword \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "passwordCurrent": "pass1234",
    "password": "newpass5678",
    "passwordConfirm": "newpass5678"
  }'
```

---

#### DELETE /users/deleteMe

Deactivate current user account.

**Authentication:** Required

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/v1/users/deleteMe \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (204 No Content)**

---

#### GET /users (Admin only)

Get all users.

**Authentication:** Required (Admin only)

**Request:**

```bash
curl http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Reviews

#### GET /reviews

Get all reviews.

**Authentication:** Not required

**Request:**

```bash
curl http://localhost:3000/api/v1/reviews
```

**Response (200 OK):**

```json
{
  "status": "success",
  "results": 5,
  "data": {
    "data": [
      {
        "_id": "5c8a34ed14eb5c17645c9108",
        "review": "Amazing experience!",
        "rating": 5,
        "user": {
          "_id": "5c8a1dfa2f8fb814b56fa181",
          "name": "John Doe"
        },
        "tour": {
          "_id": "5c88fa8cf4afda39709c2955",
          "name": "The Sea Explorer"
        }
      }
    ]
  }
}
```

---

#### POST /reviews

Create a new review.

**Authentication:** Required

**Request Body:**

```json
{
  "review": "Great tour!",
  "rating": 5,
  "tour": "5c88fa8cf4afda39709c2955"
}
```

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "review": "Great tour!",
    "rating": 5,
    "tour": "5c88fa8cf4afda39709c2955"
  }'
```

---

#### GET /tours/:tourId/reviews

Get all reviews for a specific tour.

**Authentication:** Not required

**Request:**

```bash
curl http://localhost:3000/api/v1/tours/5c88fa8cf4afda39709c2955/reviews
```

---

### Bookings

#### GET /bookings

Get all bookings.

**Authentication:** Required (Admin or Lead Guide only)

**Request:**

```bash
curl http://localhost:3000/api/v1/bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### POST /bookings

Create a new booking.

**Authentication:** Required

**Request Body:**

```json
{
  "tour": "5c88fa8cf4afda39709c2955",
  "price": 497
}
```

---

### Error Responses

All errors follow this format:

**Validation Error (400 Bad Request):**

```json
{
  "status": "fail",
  "message": "Invalid input data. Name is required"
}
```

**Authentication Error (401 Unauthorized):**

```json
{
  "status": "fail",
  "message": "You are not logged in. Please log in to get access"
}
```

**Authorization Error (403 Forbidden):**

```json
{
  "status": "fail",
  "message": "You do not have permission to perform this action"
}
```

**Not Found Error (404):**

```json
{
  "status": "fail",
  "message": "No tour found with that ID"
}
```

**Server Error (500):**

```json
{
  "status": "error",
  "message": "Something went wrong"
}
```

---

## 🚨 Troubleshooting

### Issue: `npm install` fails

**Solution:**

- Delete `node_modules/` and `package-lock.json`
- Run `npm install` again
- Make sure you're using Node.js v24+ and npm v11+

### Issue: "Cannot find module 'dotenv'"

**Solution:**

```bash
npm install dotenv
```

### Issue: MongoDB connection error

**Possible causes:**

1. Wrong connection string in `.env`
2. Database password not replaced in `DATABASE` variable
3. IP address not whitelisted in MongoDB Atlas
4. Network firewall blocking connection

**Solution:**

- Check MongoDB Atlas → Network Access → Add your IP
- Verify `DATABASE` and `DATABASE_PASSWORD` in `.env`
- Test connection string in MongoDB Compass or install MongoDB for VS Code and use your connection string to test it

### Issue: Tests failing with "file-type" error

**Solution:**
This is an ES module compatibility issue. Already fixed in the codebase with dynamic imports which did not quite work. The solution is to down.

### Issue: CI/CD pipeline failing

**Common causes:**

1. Missing `package-lock.json` (must be in repo)
2. Environment variables not set in GitHub Secrets
3. Test failures

**Solution:**

- Ensure `package-lock.json` is committed
- Check GitHub Actions logs for specific error

### Issue: Port already in use

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=3001
```

---

## 🔐 Security Notes

**Important:**

- Never commit `.env` file to Git
- Use strong `JWT_SECRET` in production (32+ random characters)
- Always use HTTPS in production
- Keep dependencies updated: `npm audit fix`

---

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Jest Testing Guide](https://jestjs.io/docs/getting-started)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

## 🤝 Contributing

This is a learning project for Agile/DevOps lab completion.

**Development Workflow:**

1. Create feature branch from `dev`
2. Make changes with incremental commits
3. Run tests: `npm test`
4. Push and create Pull Request
5. CI/CD pipeline must pass

---

## 📝 License

ISC

---

## 👤 Author

**Gideon Dakore**

---

## 🎯 Agile Lab Progress

- ✅ Sprint 0: Planning Complete
- ✅ Sprint 1: DevOps Foundation (Health endpoint, Tests, CI/CD)
- ✅ Sprint 2: Logging & Documentation (Winston, README, Validation Tests)
- ✅ Sprint 3: Integration Tests & API Documentation (COMPLETE)

**All Sprints Complete - Project Delivered**

**Documentation:**

- [Sprint 1 Review](./SPRINT1_REVIEW.md)
- [Sprint 1 Retrospective](./SPRINT1_RETROSPECTIVE.md)
- [Sprint 2 Review](./SPRINT2_REVIEW.md)
- [Sprint 2 Retrospective](./SPRINT2_RETROSPECTIVE.md)
- [Sprint 3 Review](./SPRINT3_REVIEW.md)
- [Sprint 3 Retrospective](./SPRINT3_RETROSPECTIVE.md)
- [Agile Documentation](./AGILE_DOCUMENTATION.md)

---

_Last Updated: February 17, 2026_
