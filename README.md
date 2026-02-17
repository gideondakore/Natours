# Natours API

![CI/CD](https://github.com/gideondakore/Natours/actions/workflows/ci.yml/badge.svg)

A tour booking platform backend API built with Node.js, Express, and MongoDB.

## 📊 Project Status

**Test Status:** 18 tests passing (as of Sprint 1)  
**Coverage:** 100% on tested files (health route, AppError, catchAsync)  
**Node Version:** 24.x or 25.x  
**Current Sprint:** Sprint 2 (Logging & Documentation)

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

| Variable               | Description                                    | Example                              |
| ---------------------- | ---------------------------------------------- | ------------------------------------ |
| `NODE_ENV`             | Environment mode                               | `development` or `production`        |
| `PORT`                 | Server port                                    | `3000`                               |
| `DATABASE`             | MongoDB connection string                      | `mongodb+srv://...`                  |
| `DATABASE_PASSWORD`    | MongoDB password                               | `yourpassword123`                    |
| `JWT_SECRET`           | Secret key for JWT tokens                      | `my-ultra-secret-key`                |
| `JWT_EXPIRES_IN`       | JWT expiration time                            | `90d`                                |
| `JWT_COOKIE_EXPIRES_IN` | Cookie expiration (days)                       | `90`                                 |

### Optional Variables (for full functionality)

| Variable              | Description                     | When Needed                      |
| --------------------- | ------------------------------- | -------------------------------- |
| `EMAIL_FROM`          | Sender email address            | Sending emails                   |
| `MAILTRAP_HOST`       | MailTrap SMTP host              | Development email testing        |
| `MAILTRAP_PORT`       | MailTrap SMTP port              | Development email testing        |
| `MAILTRAP_USERNAME`   | MailTrap username               | Development email testing        |
| `MAILTRAP_PASSWORD`   | MailTrap password               | Development email testing        |
| `SENDGRID_USERNAME`   | SendGrid username (usually `apikey`) | Production emails          |
| `SENDGRID_PASSWORD`   | SendGrid API key                | Production emails                |
| `STRIPE_SECRET_KEY`   | Stripe secret key               | Payment processing               |
| `WEBHOOK_SECRET`      | Stripe webhook secret           | Payment webhooks                 |
| `LOCAL_HOST_CLIENT`   | Client URL for CORS             | Frontend integration             |

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
const request = require('supertest');
const app = require('../app');

describe('My Feature', () => {
  it('should do something', async () => {
    const response = await request(app).get('/api/endpoint');
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

### Health Check

```bash
GET /api/v1/health
```

Returns server status, uptime, and environment info.

**Response:**
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

### Tours

```bash
GET    /api/v1/tours           # Get all tours
GET    /api/v1/tours/:id       # Get single tour
POST   /api/v1/tours           # Create tour (auth required)
PATCH  /api/v1/tours/:id       # Update tour (auth required)
DELETE /api/v1/tours/:id       # Delete tour (auth required)
```

### Users & Authentication

```bash
POST   /api/v1/users/signup    # Create account
POST   /api/v1/users/login     # Login
POST   /api/v1/users/logout    # Logout
GET    /api/v1/users/me        # Get current user (auth required)
```

### Reviews

```bash
GET    /api/v1/reviews         # Get all reviews
POST   /api/v1/reviews         # Create review (auth required)
```

### Bookings

```bash
GET    /api/v1/bookings        # Get all bookings (auth required)
POST   /api/v1/bookings        # Create booking (auth required)
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
- Test connection string in MongoDB Compass

### Issue: Tests failing with "file-type" error

**Solution:**
This is an ES module compatibility issue. Already fixed in the codebase with dynamic imports.

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

**Gideon**

---

## 🎯 Agile Lab Progress

- ✅ Sprint 0: Planning Complete
- ✅ Sprint 1: DevOps Foundation (Health endpoint, Tests, CI/CD)
- 🚧 Sprint 2: Logging & Documentation (In Progress)

**Documentation:**
- [Sprint 1 Review](./SPRINT1_REVIEW.md)
- [Sprint 1 Retrospective](./SPRINT1_RETROSPECTIVE.md)
- [Agile Documentation](./AGILE_DOCUMENTATION.md)

---

_Last Updated: February 17, 2026_
