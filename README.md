# Career Platform - SE4458 Final Project

## Deployed URLs

* **Frontend:** 
* **Backend Gateway (API):** 
* **Notification Service:** 
* **Video Demo:** 

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

## Design and Assumptions

* No AI chat implemented! Did not have the time.

* No user email check registered, requirements did not specify.
* Notification alerts are based on user-saved alerts and filtered via job title and city.
* Redis stores search history, job alerts, and notifications.
* PostgreSQL replaces SQLite for deployment.
* Gateway handles all routing with consistent `/api/v1/...` prefixes.
* Only basic user registration/login is implemented; chatbot was skipped due to time constraints.

---

## ER Diagram

```
User
- id
- name
- email
- password

Job
- id
- title
- description
- city
- country
- createdAt
- application_count

Application
- id
- user_id (FK)
- job_id (FK)
- createdAt

Admin
- id
- email
- password
```

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
