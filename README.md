# BloodLink – Blood Donor & Blood Bank Management Platform

BloodLink is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed to connect blood donors, blood banks, and patients or hospitals during urgent medical situations.

The platform provides a centralized system for donor discovery, blood inventory management, emergency blood requests, and request tracking. It aims to simplify communication between blood donors, blood banks, and people seeking blood assistance.

## 🌐 Live Deployment

- **Live Website:** https://bloodlink-frontend-44lx.onrender.com
- **GitHub Repository:** https://github.com/Abinaya2835/BloodLink

---

## 🌟 Key Features

### 1. Multi-Role Authentication and Access Control

**Blood Donors**
- Register and maintain donor profiles.
- Update personal contact information.
- Toggle donation availability.
- Search and discover blood donors.
- Submit emergency blood requests.
- Track personal blood request history.

**Blood Banks**
- Register blood bank accounts.
- Manage blood inventory for all eight blood groups.
- View incoming blood requests.
- Filter requests by blood group, city, and status.
- Approve, reject, or mark requests as fulfilled.

**System Administrator**
- View platform-wide analytics.
- Manage registered users.
- Search and filter accounts by name, email, and role.
- View donor and blood bank directories.
- Inspect all blood requests.

### 2. Blood Request Management

- Submit emergency blood requests.
- Validate blood groups: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, and `O-`.
- Enter hospital name, city, required units, and medical reason.
- Track request progress through status indicators.
- Cancel pending requests.

**Request statuses:**

| Status | Description |
|---|---|
| Pending | Request submitted and awaiting action |
| Approved | Request approved by a blood bank |
| Fulfilled | Request marked as fulfilled |
| Rejected | Request rejected |
| Cancelled | Request cancelled by the requester |

### 3. Blood Bank Request Management

- View incoming blood requests.
- Filter requests by blood group, city, and status.
- Approve or reject requests.
- Mark approved requests as fulfilled.
- Display the handling blood bank's contact information where applicable.

### 4. Donor Discovery and Management

- Search donors using blood group and city.
- View donor availability.
- Update donor phone number, city, and state.
- Toggle availability between available and unavailable.
- Use direct telephone links to contact donors.

### 5. Administrator Control Center

- View platform statistics.
- Monitor total users, donors, blood banks, and requests.
- View pending requests and fulfilled units.
- Search and filter registered users.
- Manage user accounts.
- View all registered donors and blood banks.
- Inspect platform-wide blood requests.

### 6. Responsive Healthcare Design

- Crimson and warm neutral colour palette.
- Primary colour: `#D9383A`.
- Dark charcoal: `#222222`.
- Background colour: `#FAF7F5`.
- Responsive layouts for desktop and mobile devices.
- Clean navigation and status indicators.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite |
| Routing | React Router |
| HTTP Requests | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcryptjs |
| API Architecture | RESTful APIs |
| Development Environment | Visual Studio Code, Windows 11, PowerShell |
| Deployment | Render |

---

## 📁 Project Structure

```text
BloodLink/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── BloodRequest.jsx
│   │   │   ├── MyBloodRequests.jsx
│   │   │   ├── BloodBankRequests.jsx
│   │   │   ├── BloodInventory.jsx
│   │   │   └── SearchDonors.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bloodRequestController.js
│   │   ├── bloodInventoryController.js
│   │   ├── donorController.js
│   │   └── adminController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Donor.js
│   │   ├── BloodBank.js
│   │   ├── BloodInventory.js
│   │   └── BloodRequest.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bloodRequestRoutes.js
│   │   ├── bloodInventoryRoutes.js
│   │   ├── donorRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── docs/
│   ├── BloodLink_Project_Report (1).docx
│   └── presentation.pptx
│
├── screenshots/
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database Design

BloodLink uses MongoDB Atlas as its cloud database and Mongoose for schema modelling.

The application contains the following main collections:

| Collection | Purpose |
|---|---|
| User | Stores account information and user roles |
| Donor | Stores blood donor profile and availability details |
| BloodBank | Stores blood bank facility information |
| BloodInventory | Stores blood group stock information |
| BloodRequest | Stores emergency blood request details and status |

### Collection Relationships

- A User account can be associated with a Donor profile.
- A User account can be associated with a BloodBank profile.
- BloodInventory records are associated with a blood bank.
- BloodRequest records are associated with the requesting user and relevant blood bank information, where applicable.

The application uses MongoDB document references to maintain relationships between relevant records.

---

## 🚀 Getting Started

Follow these instructions to run BloodLink locally.

### 1. Prerequisites

Install the following software:

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and database cluster
- [Visual Studio Code](https://code.visualstudio.com/)
- Git

### 2. Clone the Repository

Open a terminal and execute:

```bash
git clone https://github.com/Abinaya2835/BloodLink.git
```

Navigate into the project:

```bash
cd BloodLink
```

### 3. Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory.

Add the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Replace the placeholder values with your own MongoDB connection string and a secure JWT secret.

Start the backend:

```bash
npm start
```

The backend should display messages similar to:

```text
BloodLink server is running on port 5000
MongoDB connected successfully!
```

### 4. Frontend Setup

Open a second terminal.

Navigate to the client directory from the project root:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Open the local development URL displayed in the terminal. For example:

```text
http://localhost:5173/
```

### 5. Environment Configuration

The backend requires the following environment variables:

| Variable | Description |
|---|---|
| PORT | Backend server port |
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret used for signing JWT tokens |

Never upload actual `.env` files or private credentials to a public GitHub repository.

---

## 📡 API Documentation

The backend provides RESTful API endpoints for authentication, donor management, blood requests, blood inventory, and administration.

**Base URL (Local):**

```text
http://localhost:5000/api
```

### Authentication APIs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a donor or blood bank |
| POST | `/auth/login` | Public | Authenticate and obtain a JWT token |

### Donor APIs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/donors/search` | Public | Search donors by blood group and city |
| GET | `/donors/profile/:userId` | Authenticated | Retrieve donor profile |
| PUT | `/donors/profile/:userId` | Authenticated | Update donor profile and availability |

### Blood Request APIs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/blood-requests` | Authenticated | Submit an emergency blood request |
| GET | `/blood-requests/my` | Authenticated | Retrieve personal request history |
| PUT | `/blood-requests/:id/cancel` | Authenticated | Cancel a pending request |
| GET | `/blood-requests` | Authorized users | View incoming requests |
| PUT | `/blood-requests/:id/status` | Authorized blood bank | Update request status |

### Blood Inventory APIs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/blood-inventory/:userId` | Blood Bank | Retrieve inventory |
| PUT | `/blood-inventory/:userId` | Blood Bank | Add or update inventory units |

### Administrator APIs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/admin/stats` | Admin | Retrieve platform statistics |
| GET | `/admin/users` | Admin | List, search, and filter users |
| GET | `/admin/donors` | Admin | Retrieve donor directory |
| GET | `/admin/blood-banks` | Admin | Retrieve blood bank directory |
| GET | `/admin/requests` | Admin | View all blood requests |
| DELETE | `/admin/users/:id` | Admin | Delete a user account |

**Authentication:** Protected API requests use JWT-based authentication. The frontend attaches the token through an Axios request interceptor.

For detailed request parameters, sample payloads, and response formats, refer to the API documentation in the `docs` folder when available.

---

## 🔐 Security

BloodLink includes the following security mechanisms:

- Password hashing using bcryptjs.
- JWT-based authentication.
- Role-based access control.
- Protected backend routes.
- Environment variables for database credentials and JWT secrets.
- Authenticated API requests using Bearer tokens.

Users should keep their passwords and authentication tokens private. The platform should not be treated as a replacement for medical advice or professional blood bank verification.

---

## 📸 Application Screenshots

Application screenshots will be maintained in the `screenshots/` directory.

The following screenshots are recommended:

1. Home page
2. User registration page
3. Login page
4. Donor dashboard
5. Blood bank dashboard
6. Blood inventory management
7. Blood request submission page
8. My blood requests page
9. Donor search page
10. Administrator dashboard
11. Mobile responsive view

---

## 📄 Project Documents

The project report and presentation are available in the `docs/` directory.

- **Project Report:** `docs/BloodLink_Project_Report (1).docx`
- **Project Presentation:** `docs/presentation.pptx`

Additional database design and detailed API documentation can also be added to this directory.

---

## 🎯 Future Enhancements

Possible future improvements include:

- Email and SMS notifications for emergency requests.
- Location-based donor discovery.
- Advanced blood availability matching.
- Blood request priority notifications.
- Enhanced reporting and analytics.
- Additional verification workflows for blood bank accounts.

---

## 👩‍💻 Project Information

**Project Name:** BloodLink – Blood Donor & Blood Bank Management Platform

**Project Type:** Full-Stack Web Application

**Architecture:** MERN Stack

**Repository:** https://github.com/Abinaya2835/BloodLink

**Live Application:** https://bloodlink-frontend-44lx.onrender.com

---

## 📜 License

This project was developed for academic purposes. Add an appropriate open-source license if you intend to distribute or reuse the project publicly.

---

**BloodLink – Connecting Donors, Blood Banks, and Those in Need.** ❤️