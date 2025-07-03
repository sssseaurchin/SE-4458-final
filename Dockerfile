version: '3.8'

services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: careersite
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7
    restart: always
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management
    restart: always
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest

  job-service:
    build: ./job-service
    restart: always
    environment:
      PGHOST: postgres
      PGUSER: postgres
      PGPASSWORD: postgres
      PGDATABASE: careersite
      PGPORT: 5432
      JWT_SECRET: supersecret
    depends_on:
      - postgres
    ports:
      - "3001:3001"

  admin-service:
    build: ./admin-service
    restart: always
    environment:
      PGHOST: postgres
      PGUSER: postgres
      PGPASSWORD: postgres
      PGDATABASE: careersite
      PGPORT: 5432
      JWT_SECRET: supersecret
    depends_on:
      - postgres
    ports:
      - "4000:4000"

  auth-service:
    build: ./auth-service
    restart: always
    environment:
      PGHOST: postgres
      PGUSER: postgres
      PGPASSWORD: postgres
      PGDATABASE: careersite
      PGPORT: 5432
      JWT_SECRET: supersecret
    depends_on:
      - postgres
    ports:
      - "5000:5000"

  notification-service:
    build: ./notification-service
    restart: always
    environment:
      REDIS_HOST: redis
      REDIS_PORT: 6379
      RABBITMQ_HOST: rabbitmq
    depends_on:
      - redis
      - rabbitmq
    ports:
      - "7000:7000"

  gateway:
    build: ./gateway
    restart: always
    ports:
      - "3002:3002"
    depends_on:
      - job-service
      - admin-service
      - auth-service
      - notification-service

  client:
    build: ./client
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - gateway

volumes:
  pgdata:
