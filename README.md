# Career Platform - SE4458 Final Project

## Deployed URLs

* **[Azure Deployed Web App Link](https://se4458-final-webapp-eeeye2b8h3efahd4.francecentral-01.azurewebsites.net/)
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

* Notification alerts are based on user-saved alerts and filtered via job title and city.
* Recommended jobs in job details page is taken by similar location in cities.
* The time job alert system takes is hardcoded and is not flexible. It takes exactly 30 seconds each check.
* Redis stores search history, job alerts, and notifications.
* PostgreSQL replaces SQLite for deployment.
* Gateway handles all routing with consistent `/api/v1/...` prefixes.
* Only basic user registration/login is implemented. Does not check for real emails, was not required to do so.
* No admin registiration UI implemented, was not required to do so also. But the admin login does work through jwt.

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
