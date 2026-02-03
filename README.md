# Smart Nagrik Seva (SNS)

Smart Nagrik Seva (SNS) is a citizen service portal for lodging and tracking civic complaints with role-based dashboards for citizens and administrators. The repository contains a React + Vite frontend and a Spring Boot backend.

## Features
- Citizen registration/login and complaint submission
- Complaint tracking and status updates
- Admin dashboards for complaint management and analytics
- Email notifications and JWT-based authentication

## Tech Stack
**Frontend**
- React 18 + TypeScript
- Vite
- React Router
- Recharts, Leaflet

**Backend**
- Spring Boot 3 (Java 17)
- Spring Security + JWT
- Spring Data JPA
- MySQL

## Project Structure
```
.
├── App.tsx                # Frontend entry routes
├── components/            # Frontend UI components
├── src/main/java          # Spring Boot backend
├── src/main/resources     # Backend configuration
├── schema.sql             # Database schema
├── package.json           # Frontend dependencies
└── pom.xml                # Backend dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17
- MySQL 8

### Frontend Setup
```bash
npm install
npm run dev
```
The app will be available at `http://localhost:5173` by default.

### Backend Setup
1. Update the database and email settings in `src/main/resources/application.properties`.
2. Create the database and run `schema.sql` if needed.
3. Start the Spring Boot app:

```bash
./mvnw spring-boot:run
```

### Configuration Notes
The backend uses Spring Boot configuration in `src/main/resources/application.properties`. Update these values for your environment:
- `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`
- `sns.app.jwtSecret`
- `spring.mail.*`

## Scripts
### Frontend
- `npm run dev` — Start Vite development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

### Backend
- `./mvnw spring-boot:run` — Run the Spring Boot application
- `./mvnw test` — Run backend tests

## API Overview
The backend exposes endpoints for authentication and complaint management.
- `AuthController` handles registration/login and JWT issuance.
- `ComplaintController` handles complaint CRUD and status updates.

Refer to the controller classes for detailed request/response payloads.

## License
This project is provided as-is for educational/demo purposes.
