# BloodLink – Blood Donor & Blood Bank Management Platform

**BloodLink** is a full-stack MERN (MongoDB, Express, React, Node.js) web platform designed to seamlessly connect blood donors, certified blood banks, and patients/hospitals during urgent medical emergencies.

---

## 🌟 Key Features

### 1. Multi-Role Authentication & Access Control
- **Blood Donors:** Register and maintain a public profile, toggle donation availability, submit urgent blood requests, and track request history.
- **Blood Banks:** Register medical facilities, manage real-time inventory for all 8 blood groups, review incoming patient/hospital requests, and approve or reject requests.
- **System Administrator:** Platform-wide oversight with live analytics, user management (search, filter, and delete), donor & blood bank directories, and system request inspection.

### 2. Blood Request System (Priority 1)
- **Submit Emergency Requests:** Validate blood groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`), hospital names, cities, required units, and medical reasons.
- **My Blood Requests:** Live tracking cards with color-coded status badges: `pending` (amber), `approved` (green), `fulfilled` (gold), `rejected` (red), and `cancelled` (gray).
- **Interactive Cancellation:** Requester can cancel pending requests at any time.

### 3. Blood Bank Request Management (Priority 2)
- **Incoming Requests Feed:** Real-time visibility into urgent hospital requests.
- **Smart Filtering:** Filter requests instantly by blood group, status, or city.
- **One-Click Actions:** Blood banks can approve, reject, or mark requests as fulfilled.
- **Facility Attribution:** Approved requests display the handling blood bank's contact name, city, and phone number directly to the requester.

### 4. Donor Discovery & Management (Priority 3)
- **Donor Availability Toggle:** Donors can toggle their status (`Available to Donate` vs `Unavailable`) with one click from their dashboard.
- **Profile Management:** Donors can update their phone number, city, and state.
- **Emergency Donor Search:** Seekers can filter donors by blood group and city.
- **Direct Emergency Call:** Instant `tel:` contact button so families and hospitals can phone donors directly without delay.

### 5. Administrator Control Center (Priority 4)
- **Platform Analytics:** Real-time metrics for total users, donors, blood banks, total requests, pending requests, and fulfilled units.
- **User Management:** Search all accounts by name or email, filter by role (`donor`, `bloodbank`, `admin`), and delete spam/test accounts.
- **Global Overview:** Inspect all registered donors, blood banks, and requests platform-wide.

### 6. Modern Healthcare Design System
- Strictly complies with healthcare aesthetic standards: crisp crimson (`#D9383A`), dark charcoal (`#222222`), warm neutral backgrounds (`#FAF7F5`), and zero blue tones.
- Responsive mobile and desktop layout with accessible typography and clean status badges.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, React Router v7, Axios (with automatic JWT request interceptors).
- **Backend:** Node.js, Express.js 5, RESTful APIs, JWT (JSON Web Tokens), bcryptjs password hashing.
- **Database:** MongoDB Atlas with Mongoose schemas.
- **Environment:** Windows 11, PowerShell, Node.js.

---

## 📁 Project Structure

```text
BloodLink/
│
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx       # Dynamic role-based navigation bar
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page with interactive group directory
│   │   │   ├── Login.jsx        # User & Admin authentication
│   │   │   ├── Register.jsx     # Registration for Donors and Blood Banks
│   │   │   ├── Dashboard.jsx    # Personalized Donor & Blood Bank dashboard
│   │   │   ├── AdminDashboard.jsx # Admin control center with metric cards & tabs
│   │   │   ├── BloodRequest.jsx # Emergency blood request submission form
│   │   │   ├── MyBloodRequests.jsx # Personal request tracking & cancellation
│   │   │   ├── BloodBankRequests.jsx # Incoming requests review & approval
│   │   │   ├── BloodInventory.jsx # Real-time stock management
│   │   │   └── SearchDonors.jsx # Emergency donor finder with click-to-call
│   │   ├── services/
│   │   │   └── api.js           # Axios instance with Bearer token interceptor
│   │   ├── App.jsx              # Main routing configuration
│   │   └── main.jsx
│   └── package.json
│
├── server/                      # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js    # Register & Login controllers
│   │   ├── bloodRequestController.js # Blood requests & status management
│   │   ├── bloodInventoryController.js # Inventory stock updates & retrieval
│   │   ├── donorController.js   # Donor profile & availability management
│   │   └── adminController.js   # Analytics, user management, and oversight
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification middleware
│   │   └── adminMiddleware.js   # Administrator privilege guard
│   ├── models/
│   │   ├── User.js              # User schema (roles: donor, bloodbank, admin)
│   │   ├── Donor.js             # Donor profile schema
│   │   ├── BloodBank.js         # Blood bank facility schema
│   │   ├── BloodInventory.js    # Stock units schema
│   │   └── BloodRequest.js      # Patient request schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bloodRequestRoutes.js
│   │   ├── bloodInventoryRoutes.js
│   │   ├── donorRoutes.js
│   │   └── adminRoutes.js
│   ├── .env                     # MongoDB URI, PORT, JWT Secret
│   ├── package.json
│   └── server.js                # Express app entry point
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster database

### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify your `.env` file contains:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *Expected output:*
   ```text
   BloodLink server is running on port 5000
   MongoDB connected successfully!
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local development URL in your browser (e.g. `http://localhost:5173/`).

---

## 🔑 Default Administrator Credentials

To access the **Admin Portal** (`/admin-dashboard`):
- **Email:** `admin@bloodlink.com`
- **Password:** `admin123`

---

## 📡 API Endpoints Summary

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new Donor or Blood Bank |
| POST | `/api/auth/login` | Public | Authenticate user & return JWT token |
| GET | `/api/donors/search` | Public | Search available donors by blood group & city |
| GET | `/api/donors/profile/:userId` | Authenticated | Get donor profile details |
| PUT | `/api/donors/profile/:userId` | Authenticated | Update donor profile & availability toggle |
| POST | `/api/blood-requests` | Authenticated | Submit an emergency blood request |
| GET | `/api/blood-requests/my` | Authenticated | Fetch logged-in user's request history |
| PUT | `/api/blood-requests/:id/cancel` | Authenticated | Requester cancels their pending request |
| GET | `/api/blood-requests` | Authenticated | Blood banks & Admin view incoming requests |
| PUT | `/api/blood-requests/:id/status` | Blood Bank | Update request status (approve / reject / fulfill) |
| GET | `/api/blood-inventory/:userId` | Blood Bank | Fetch blood bank inventory stock |
| PUT | `/api/blood-inventory/:userId` | Blood Bank | Add or update stock units for a blood group |
| GET | `/api/admin/stats` | Admin | Fetch platform-wide counts & activity metrics |
| GET | `/api/admin/users` | Admin | List, search, and filter all registered users |
| GET | `/api/admin/donors` | Admin | Directory of all registered donors |
| GET | `/api/admin/blood-banks` | Admin | Directory of all registered blood banks |
| GET | `/api/admin/requests` | Admin | System-wide audit of all patient requests |
| DELETE | `/api/admin/users/:id` | Admin | Delete a user and cascade clean related records |
