# GharDilaDo - Backend API

Production-ready REST API for the GharDilaDo real estate mobile app.

## Tech Stack
- **Node.js** + **Express.js**
- **MongoDB** (Mongoose ORM)
- **JWT** Authentication
- **Twilio** (OTP via SMS)
- **Cloudinary** (Image Uploads)

## Project Structure

```
backend/
├── src/
│   ├── config/         # DB + Cloudinary setup
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth protection
│   ├── models/         # MongoDB Schemas
│   └── routes/         # API routes
├── server.js
└── package.json
```

## Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/GharDilaDo/ghar-dila-do-app-team.git
cd ghar-dila-do-app-team/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
# Copy the example file
cp .env.example .env
# Now fill in your keys in .env
```

Ask the project owner for the actual `.env` values via WhatsApp/Slack.

### 4. Run the server
```bash
npm run dev    # Development (auto-restart)
npm start      # Production
```

Server starts at: `http://localhost:5000`

---

## API Endpoints (Summary)

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/api/auth/send-otp` | Send OTP to phone | ❌ |
| POST | `/api/auth/verify-otp` | Verify OTP + Login | ❌ |
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login (email/pass) | ❌ |
| GET | `/api/auth/profile` | Get my profile | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |
| POST | `/api/auth/kyc` | Submit KYC details | ✅ |
| GET | `/api/properties` | Get all properties (+ filters) | ❌ |
| POST | `/api/properties` | Add new property | ✅ Owner/Broker |
| GET | `/api/properties/me` | Get my properties | ✅ |
| GET | `/api/properties/:id` | Get single property | ❌ |
| PUT | `/api/properties/:id` | Update property | ✅ Owner |
| DELETE | `/api/properties/:id` | Delete property | ✅ Owner |
| POST | `/api/upload` | Upload images | ✅ |
| POST | `/api/favorites/:propertyId` | Toggle favorite | ✅ |
| GET | `/api/favorites` | Get my favorites | ✅ |
| POST | `/api/bookings` | Book a visit | ✅ |
| GET | `/api/bookings/my` | My bookings (buyer) | ✅ |
| GET | `/api/bookings/owner` | My property bookings (owner) | ✅ |
| PUT | `/api/bookings/:id` | Update booking status | ✅ Owner |
| GET | `/api/notifications` | Get notifications | ✅ |
| PUT | `/api/notifications/:id/read` | Mark as read | ✅ |
| PUT | `/api/notifications/read-all` | Mark all as read | ✅ |
| POST | `/api/reviews/:propertyId` | Add review | ✅ |
| GET | `/api/reviews/:propertyId` | Get property reviews | ❌ |

### Query Filters for GET /api/properties
```
?type=Flat
?locality=Sargasan
?minRent=10000&maxRent=25000
?bhk=2
?furnishing=Furnished
?featured=true
?keyword=sargasan
?limit=10
```

---

## Authentication
All protected routes require a Bearer Token in headers:
```
Authorization: Bearer <your_jwt_token>
```

Get the token from Login or OTP Verify response.
