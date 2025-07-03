# Career Platform - SE4458 Final Project

## Deployed URLs

* **Frontend:** 
* **Backend Gateway (API):** 
* **Notification Service:** 
* [Video Demo](https://drive.google.com/drive/folders/1NvrQxaDQ-CbRJzDGkEx8E6fSIZiCKAQf?usp=drive_link)

---

### Tech Stack

* **Frontend:** React, Axios, React Router
* **Backend Gateway:** Express, http-proxy-middleware
* **Microservices:**

  * Job Service (PostgreSQL + Sequelize)
  * Auth Service (JWT)
  * Admin Service
  * Notification Service (Redis + RabbitMQ)
* **Database:** PostgreSQL (deployed version)
* **CI/CD:** Docker, docker-compose

---


## Project Structure

This full-stack job portal consists of the following components:

* **`job-service`** — Manages job postings and applications (PostgreSQL + Sequelize)
* **`auth-service`** — Handles user authentication and registration (JWT-based)
* **`admin-service`** — Admin portal and job statistics
* **`frontend`** — React-based UI located at `/frontend`
* **`notification-service`** — Redis-based system for job alerts and notifications
* **`gateway`** — API Gateway proxying requests to all backend services

---

## Design and Assumptions

* No AI chat implemented! Did not have the time.

* No user email check registered, requirements did not specify.
* Notification alerts are based on user-saved alerts and filtered via job title and city.
* Redis stores search history, job alerts, and notifications.
* PostgreSQL replaces SQLite for deployment.
* Gateway handles all routing with consistent `/api/v1/...` prefixes.
* Only basic user registration/login is implemented; chatbot was skipped due to time constraints.

---


### **Data Models (ER Overview)**

#### `User`

(Stored in `auth-service`)

* `id` (UUID, Primary Key)
* `name` (String)
* `email` (String, Unique)
* `password` (String, Hashed)
* `createdAt` (Timestamp)
* `updatedAt` (Timestamp)

---

#### `Job`

(Stored in `job-service`)

* `id` (Integer, Primary Key, Auto Increment)
* `title` (String)
* `description` (Text)
* `company` (String)
* `city` (String)
* `country` (String)
* `working_type` (Enum/String: e.g. "remote", "on-site", etc.)
* `application_count` (Integer, Default: 0)
* `createdAt` (Timestamp)
* `updatedAt` (Timestamp)

---

#### `Application`

(Stored in `job-service`)

* `id` (Integer, Primary Key)
* `user_id` (UUID, Foreign Key to `User`)
* `job_id` (Integer, Foreign Key to `Job`)
* `applied_at` (Timestamp)
* `createdAt` (Timestamp)

Relationships:

* `Application.belongsTo(User)`
* `Application.belongsTo(Job)`
* `Job.hasMany(Application)`

---

#### `Admin`

(Stored in `admin-service`)

* `id` (UUID, Primary Key)
* `name` (String)
* `email` (String, Unique)
* `password` (String, Hashed)
* `createdAt` (Timestamp)
* `updatedAt` (Timestamp)

---

#### Redis-Based Structures (NoSQL / Notification-Service)

* `job_alerts:{userId}` → Array of alert objects:

  ```json
  [
    { "keywords": ["backend", "node"], "city": "Istanbul", "createdAt": "2025-07-03T12:00:00Z" }
  ]
  ```

* `user_notifications:{userId}` → Redis list of notification objects:

  ```json
  {
    "message": "3 new jobs matched your alert!",
    "alert": { "keywords": [...], "city": "Izmir" },
    "matchedJobs": ["Frontend Dev", "React Engineer"],
    "timestamp": "2025-07-03T12:30:00Z"
  }
  ```

* `notified_jobs:{userId}:{alertHash}` → Redis set of previously-notified job IDs (deduplication).

---

## Issues and Challenges

* Switching from SQLite to PostgreSQL required updates across all services.
* Dockerizing multiple services and wiring them up in `docker-compose.yml`.
* Creating a simple but effective notification/alert system using Redis and RabbitMQ.
* Limited time to implement optional chatbot feature.

---


## Setup & Deployment (optional for instructor)

* `docker-compose up --build`
* `.env` files provided for frontend and backend
* Uses port `3002` for Gateway, `3000` for frontend, and custom ports for each service
