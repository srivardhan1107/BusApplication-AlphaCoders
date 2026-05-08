# AlphaBus — Online Bus Booking System

A full-stack bus ticket booking web application built by Team Alpha. Users can search for buses, select seats, and book tickets. Admins can manage the entire bus inventory and view all bookings.

##  Team Members
 
| Name | Role |
|------|------|
| M.Sai Mahesh | Full Stack Developer |
| A.Sriram Reddy | Full Stack Developer |
| V.Srivardhan Yadav | Full Stack Developer |
| K.Sruchen Kumar | Full Stack Developer |
 
---

##  Problem Statement
 
Traditional bus booking involves long queues, manual ticket management, and no real-time seat availability. **AlphaBus** solves this by providing a digital platform where users can book seats instantly and admins can manage buses efficiently — all from a web browser.
 
---
 
##  Features
 
###  User
- Register and login with secure JWT authentication
- View all available buses on the dashboard
- Search buses by source, destination, and travel date
- Interactive seat map — select available seats visually
- Confirm booking and view booking history
- Cancel confirmed bookings
###  Admin
- Secure admin login (role-based access)
- Add new buses with full details
- Edit existing bus information
- Delete buses (cascades to associated bookings)
- View all bookings made by all users
---
 
##  Tech Stack
 
| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router, Context API |
| **HTTP Client** | Axios (with JWT interceptor) |
| **Backend** | Spring Boot 3.4.3, Spring Security 6, Spring Data JPA |
| **Authentication** | JWT (JSON Web Tokens), BCrypt password hashing |
| **Database** | PostgreSQL 16 |
| **ORM** | Hibernate (via JPA) |
| **API Docs** | SpringDoc OpenAPI (Swagger UI), Postman |
| **Build Tool** | Maven (backend), npm/Vite (frontend) |
 
---
 
##  System Architecture
 
```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│   Port: 5173                                                │
│   Components: Login, Register, Home, Dashboard,            │
│               BookingPage, AdminDashboard                   │
│   State: AuthContext  │  HTTP: Axios + JWT Header           │
└─────────────────────────────┬───────────────────────────────┘
                              │ REST API (HTTP/JSON)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot)                    │
│   Port: 8080                                                │
│   AuthTokenFilter → Controllers → Services → Repositories  │
│   Security: JWT + BCrypt + Role-based Authorization        │
└─────────────────────────────┬───────────────────────────────┘
                              │ JPA / Hibernate
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (PostgreSQL)                      │
│   Tables: users, buses, bookings, booking_seats            │
└─────────────────────────────────────────────────────────────┘
```
 
---
 
##  Data Flow
 
```
User Action (Browser)
      │
      ▼
React Component (JSX)
      │  Axios HTTP Request + Authorization: Bearer <JWT>
      ▼
AuthTokenFilter  ──── Invalid Token ──→  401 Unauthorized
      │ Valid
      ▼
Spring Controller  (@RestController)
      │
      ▼
Service Layer  (Business Logic)
   ├── BookingService  → Validates seats, calculates fare
   ├── BusService      → CRUD on buses
   └── AuthController  → Login / Signup
      │
      ▼
Repository Layer  (Spring Data JPA)
      │  SQL via Hibernate
      ▼
PostgreSQL Database
      │
      ▼  JSON Response
React Component  → Render UI to User
```
 
---
 
##  Database Schema
 
### `users`
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT PK | Auto-generated |
| username | VARCHAR | Unique username |
| email | VARCHAR | Unique email (used for login) |
| password | VARCHAR | BCrypt hashed |
| role | VARCHAR | ROLE_USER or ROLE_ADMIN |
 
### `buses`
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT PK | Auto-generated |
| bus_name | VARCHAR | Name of the bus |
| source | VARCHAR | Departure city |
| destination | VARCHAR | Arrival city |
| travel_date | DATE | Date of travel |
| fare | DECIMAL | Price per seat |
| total_seats | INT | Total capacity |
| available_seats | INT | Remaining seats |
 
### `bookings`
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT PK | Auto-generated |
| user_id | BIGINT FK | References users |
| bus_id | BIGINT FK | References buses |
| booking_date | TIMESTAMP | When booking was made |
| number_of_seats | INT | Count of seats booked |
| total_amount | DECIMAL | Total fare paid |
| status | VARCHAR | CONFIRMED or CANCELLED |
 
### `booking_seats`
| Column | Type | Description |
|--------|------|-------------|
| booking_id | BIGINT FK | References bookings |
| seat_number | INT | Individual seat number |
 
---
 
##  API Endpoints
 
### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ Public | Register new user |
| POST | `/api/auth/login` | ❌ Public | Login, returns JWT token |
 
### Buses (`/api/buses`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/buses` | ❌ Public | Get all buses |
| GET | `/api/buses/search` | ❌ Public | Search by source, destination, date |
| POST | `/api/buses` | ✅ Admin | Add a new bus |
| PUT | `/api/buses/{id}` | ✅ Admin | Update bus details |
| DELETE | `/api/buses/{id}` | ✅ Admin | Delete bus + its bookings |
 
### Bookings (`/api/bookings`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | ✅ User | Book seats on a bus |
| GET | `/api/bookings/my` | ✅ User | Get current user's bookings |
| DELETE | `/api/bookings/{id}/cancel` | ✅ User | Cancel a booking |
| GET | `/api/bookings/all` | ✅ Admin | Get all bookings (admin only) |
 
---
 
##  Setup & Installation
 
### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+
### 1. Clone the Repository
```bash
git clone https://github.com/your-username/bus-booking-team-alpha.git
cd bus-booking-team-alpha
```
 
### 2. Database Setup
```sql
CREATE DATABASE alphadb;
```
 
### 3. Backend Setup
```bash
cd backend
 
# Update DB credentials in src/main/resources/application.properties
# spring.datasource.username=your_username
# spring.datasource.password=your_password
 
mvn clean install
mvn spring-boot:run
```
Backend runs at: `http://localhost:8080`
 
> **Admin account** is auto-created on first startup:
> - Email: `admin@alphabus.com`
> - Password: `admin123`
 
### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`
 
### 5. API Documentation (Swagger)
```
http://localhost:8080/swagger-ui.html
```
 
---
 
##  Screenshots
 
### Login Page
<img width="1600" height="750" alt="WhatsApp Image 2026-05-08 at 3 51 40 PM" src="https://github.com/user-attachments/assets/bb9999bd-7d85-44a4-b584-271f3be718ab" />

 
### User Dashboard — Bus Search
<img width="1600" height="755" alt="WhatsApp Image 2026-05-08 at 3 51 42 PM (1)" src="https://github.com/user-attachments/assets/43233d42-3b49-4dcd-8486-37347a0a33d2" />

 
### Seat Selection
<img width="1600" height="747" alt="WhatsApp Image 2026-05-08 at 4 00 11 PM" src="https://github.com/user-attachments/assets/fb03c6e7-7880-4887-9bb9-2bda95e179db" />

 
### My Bookings
<img width="1600" height="752" alt="WhatsApp Image 2026-05-08 at 3 51 43 PM" src="https://github.com/user-attachments/assets/795d0b0b-4136-49da-8f4f-05c7f5312a6c" />

 
### Admin Dashboard
<img width="1600" height="752" alt="WhatsApp Image 2026-05-08 at 4 01 59 PM" src="https://github.com/user-attachments/assets/45c7d351-451c-4e11-938c-af9980d0bf2c" />

 
---
 
##  Security Implementation
 
1. **Password Hashing** — BCrypt encoder, passwords never stored in plain text
2. **JWT Authentication** — Token issued on login, stored in browser localStorage
3. **Request Filtering** — `AuthTokenFilter` validates JWT on every protected request
4. **Role-Based Access** — `@PreAuthorize("hasRole('ADMIN')")` on admin endpoints
5. **CORS Policy** — Restricted to `http://localhost:5173` only
6. **Stateless Sessions** — `SessionCreationPolicy.STATELESS`, no server-side sessions
---
 

##  Project Structure
 
```
bus-booking-team-alpha/
├── backend/
│   └── src/main/java/com/alpha/busbooking/
│       ├── config/          # Security config, Data seeders
│       ├── controller/      # REST controllers (Auth, Bus, Booking)
│       ├── dto/             # Request/Response DTOs
│       ├── entity/          # JPA entities (User, Bus, Booking)
│       ├── exception/       # Custom exceptions + Global handler
│       ├── repository/      # Spring Data JPA repositories
│       ├── security/        # JWT utils, AuthTokenFilter, UserDetailsImpl
│       └── service/         # Business logic (BusService, BookingService)
│
└── frontend/
    └── src/
        ├── api/             # Axios config with JWT interceptor
        ├── components/      # BusCard, Navbar, AdminRoute
        ├── context/         # AuthContext (global auth state)
        ├── pages/           # Login, Register, Home, Dashboard,
        │                    # BookingPage, AdminDashboard
        └── services/        # authService, busService, bookingService
```
 
---
 
## 👨‍💻 Developed By
 
**Team Alpha** — Full Stack Web Development Project
 
> Built with using React, Spring Boot, and PostgreSQL
