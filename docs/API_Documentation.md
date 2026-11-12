# BLOODLINK – API DOCUMENTATION

## 1. Introduction

BloodLink is a Blood Donor and Blood Bank Management Platform developed using the MERN stack.

The application uses RESTful APIs to enable communication between the React frontend and the Node.js/Express backend.

These APIs support user authentication, donor search, blood inventory management, blood request processing, and administrative operations.

## 2. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Token (JWT) |
| Password Security | bcrypt |
| API Architecture | REST |

## 3. Base URL

**Local Development:**

`http://localhost:5000`

**Deployed Backend:**

`https://bloodlink-backend-new.onrender.com`

All API endpoints are accessed using the appropriate route prefix.

## 4. HTTP Methods

| Method | Description |
|---|---|
| GET | Retrieve information |
| POST | Create or submit information |
| PUT | Update existing information |
| DELETE | Remove information |

## 5. Authentication APIs

Base path: `/api/auth`

### 5.1 Register User

- **Method:** POST
- **Endpoint:** `/api/auth/register`
- **Purpose:** Registers a new user in the BloodLink application.

**Request Body:**

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "your_password",
  "role": "donor"
}
```

Additional registration details depend on the selected user role.

**Expected Response:**

Returns a registration confirmation and relevant user information when registration is successful.

### 5.2 Login User

- **Method:** POST
- **Endpoint:** `/api/auth/login`
- **Purpose:** Authenticates an existing user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Expected Response:**

Returns a login confirmation, authentication token, and user information when authentication is successful.

### 5.3 Authentication Test

- **Method:** GET
- **Endpoint:** `/api/auth/test`
- **Purpose:** Checks whether the authentication route is accessible.

**Expected Response:**

`Auth routes are working!`

## 6. Donor APIs

Base path: `/api/donors`

### 6.1 Search Donors

- **Method:** GET
- **Endpoint:** `/api/donors/search`
- **Purpose:** Searches available blood donors using blood group and city.

**Query Parameters:**

| Parameter | Description |
|---|---|
| bloodGroup | Filters donors by blood group |
| city | Filters donors by city |

**Example Request:**

`GET /api/donors/search?bloodGroup=A%2B&city=Chennai`

**Expected Response:**

Returns the number of matching donors and their available details.

### 6.2 Get Donor Profile

- **Method:** GET
- **Endpoint:** `/api/donors/profile/:userId`
- **Purpose:** Retrieves the donor profile associated with a user ID.

**Example Request:**

`GET /api/donors/profile/USER_ID`

**Expected Response:**

Returns the donor profile if it exists. Otherwise, returns a profile-not-found response.

### 6.3 Update Donor Profile

- **Method:** PUT
- **Endpoint:** `/api/donors/profile/:userId`
- **Purpose:** Updates the donor profile associated with a user ID.

**Example Request:**

`PUT /api/donors/profile/USER_ID`

The request body contains the donor profile fields to be updated.

## 7. Blood Request APIs

Base path: `/api/blood-requests`

These endpoints use authentication middleware.

### 7.1 Create Blood Request

- **Method:** POST
- **Endpoint:** `/api/blood-requests`
- **Purpose:** Submits a new blood request.

The request body contains the required blood request information.

### 7.2 Get All Blood Requests

- **Method:** GET
- **Endpoint:** `/api/blood-requests`
- **Purpose:** Retrieves incoming blood requests, including applicable filtering for blood banks.

### 7.3 Get My Blood Requests

- **Method:** GET
- **Endpoint:** `/api/blood-requests/my`
- **Purpose:** Retrieves blood requests submitted by the logged-in user.

### 7.4 Cancel Blood Request

- **Method:** PUT
- **Endpoint:** `/api/blood-requests/:id/cancel`
- **Purpose:** Cancels a pending blood request submitted by the requester.

### 7.5 Update Blood Request Status

- **Method:** PUT
- **Endpoint:** `/api/blood-requests/:id/status`
- **Purpose:** Updates the status of a blood request.

Supported status actions include approval, rejection, and fulfillment.

## 8. Blood Inventory APIs

Base path: `/api/blood-inventory`

### 8.1 Search Blood Banks

- **Method:** GET
- **Endpoint:** `/api/blood-inventory/search`
- **Purpose:** Searches blood banks based on the supported search criteria.

**Note:** The exact query parameters and filtering logic are determined by the backend controller.

### 8.2 Get Blood Inventory

- **Method:** GET
- **Endpoint:** `/api/blood-inventory/:userId`
- **Purpose:** Retrieves inventory information for a particular blood bank.

### 8.3 Add or Update Blood Inventory

- **Method:** PUT
- **Endpoint:** `/api/blood-inventory/:userId`
- **Purpose:** Adds or updates the blood stock maintained by a blood bank.

The request body contains the inventory information to be saved.

## 9. Admin APIs

Base path: `/api/admin`

All admin endpoints are protected using authentication middleware and admin authorization middleware.

### 9.1 Get Admin Statistics

- **Method:** GET
- **Endpoint:** `/api/admin/stats`
- **Purpose:** Retrieves statistics for the admin dashboard.

### 9.2 Get All Users

- **Method:** GET
- **Endpoint:** `/api/admin/users`
- **Purpose:** Retrieves registered user information.

### 9.3 Get All Donors

- **Method:** GET
- **Endpoint:** `/api/admin/donors`
- **Purpose:** Retrieves donor information for administrative management.

### 9.4 Get All Blood Banks

- **Method:** GET
- **Endpoint:** `/api/admin/blood-banks`
- **Purpose:** Retrieves registered blood bank information.

### 9.5 Get All Blood Requests

- **Method:** GET
- **Endpoint:** `/api/admin/requests`
- **Purpose:** Retrieves blood request information for administrative monitoring.

### 9.6 Delete User

- **Method:** DELETE
- **Endpoint:** `/api/admin/users/:id`
- **Purpose:** Deletes a selected user using the user ID.

## 10. Authentication and Authorization

BloodLink uses authentication and authorization mechanisms to protect application resources.

**JWT Authentication:**

JSON Web Tokens are used to authenticate logged-in users.

**Password Hashing:**

Passwords are hashed using bcrypt before being stored in the database.

**Role-Based Access Control:**

The application supports the following user roles:

- Donor
- Blood Bank
- Admin

Admin routes use authentication middleware and admin authorization middleware to restrict access to authorized administrators.

**Authorization Header:**

For protected endpoints, the frontend can send the authentication token using the following header format:

`Authorization: Bearer YOUR_JWT_TOKEN`

## 11. API Endpoint Summary

| Module | HTTP Method | Endpoint | Purpose |
|---|---|---|---|
| Authentication | POST | `/api/auth/register` | Register user |
| Authentication | POST | `/api/auth/login` | Login user |
| Authentication | GET | `/api/auth/test` | Test authentication route |
| Donors | GET | `/api/donors/search` | Search donors |
| Donors | GET | `/api/donors/profile/:userId` | Get donor profile |
| Donors | PUT | `/api/donors/profile/:userId` | Update donor profile |
| Blood Requests | POST | `/api/blood-requests` | Create request |
| Blood Requests | GET | `/api/blood-requests` | Get all requests |
| Blood Requests | GET | `/api/blood-requests/my` | Get personal requests |
| Blood Requests | PUT | `/api/blood-requests/:id/cancel` | Cancel request |
| Blood Requests | PUT | `/api/blood-requests/:id/status` | Update request status |
| Blood Inventory | GET | `/api/blood-inventory/search` | Search blood banks |
| Blood Inventory | GET | `/api/blood-inventory/:userId` | Get inventory |
| Blood Inventory | PUT | `/api/blood-inventory/:userId` | Update inventory |
| Admin | GET | `/api/admin/stats` | Get dashboard statistics |
| Admin | GET | `/api/admin/users` | Get all users |
| Admin | GET | `/api/admin/donors` | Get all donors |
| Admin | GET | `/api/admin/blood-banks` | Get all blood banks |
| Admin | GET | `/api/admin/requests` | Get all requests |
| Admin | DELETE | `/api/admin/users/:id` | Delete user |

## 12. Error Handling

The backend uses HTTP status codes to indicate the result of API operations.

| Status Code | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created successfully |
| 400 | Bad request |
| 401 | Unauthorized access |
| 403 | Forbidden access |
| 404 | Requested resource not found |
| 500 | Internal server error |

The exact status codes and response messages depend on the corresponding controller implementation.

## 13. Conclusion

The BloodLink REST API provides the communication layer between the frontend application and the backend server.

It supports user authentication, donor search, blood bank inventory management, blood request processing, and administrative operations.

The API structure separates application functionalities into different modules, making the backend easier to maintain, understand, and extend.