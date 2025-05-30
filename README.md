# Backend-Developer-Assignment-LYXA

## 📦 Repository Structure

This project is organized as a **monorepo**:

```
|-- auth-service
|-- product-service
|-- docker-compose.yml
```

---

### Auth Service

- User registration & login with hashed passwords
- JWT token issuance and validation
- Provides an RPC endpoint for other services to validate JWT tokens
- Publishes `user.created` event via RabbitMQ

### Product Service

- Product CRUD operations
- JWT-based route protection
- Communicates with Auth Service to validate tokens
- Subscribes to `user.created` events to receive new user data
- Only product owners can update/delete their products

## ⚙️ Setup Instructions

### Prerequisites

- Docker
- Docker Compose
- Make
- NodeJs
- NPM

### Clone the repository

```bash
git clone https://github.com/RatulAlMamun/Backend-Developer-Assignment-LYXA.git
cd Backend-Developer-Assignment-LYXA
```

### Create `.env` files

```
cp auth-service/.env.example auth-service/.env
cp product-service/.env.example product-service/.env
```

### Environment Configuration

**auth-service/.env.example**

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/auth-db
RABBITMQ_URL=amqp://rabbitmq:5672
JWT_SECRET=supersecret
```

**product-service/.env.example**

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/product-db
RABBITMQ_URL=amqp://rabbitmq:5672
```

### Running via Docker Compose

```

make up

```

This will:

- Build both services
- Start RabbitMQ and MongoDB containers
- Run the services on:
  - Auth Service: http://localhost:3000
  - Product Service: http://localhost:3001

## 🔁 Inter-Service Communication Flow

### JWT Validation Flow

1. Product Service receives a request with Authorization: Bearer <token>.

2. It sends an RPC request (auth:validate) to Auth Service via RabbitMQ.

3. Auth Service decodes and validates the JWT, then responds with user info or error.

### User Created Event

1. When a user registers, Auth Service publishes a user.created event via RabbitMQ.

2. Product Service subscribes to this event and logs or stores the new user info (extensible).

## Using Makefile Commands for Docker

| Command             | Description                                         |
| ------------------- | --------------------------------------------------- |
| `make up`           | Build and start all services in detached mode       |
| `make start`        | Start all services in detached mode (no rebuild)    |
| `make stop`         | Stop all running services                           |
| `make down`         | Stop and remove containers, networks                |
| `make clean`        | Stop, remove containers, volumes, and orphans       |
| `make logs`         | See logs for all services                           |
| `make auth`         | Open a shell inside the `auth-service` container    |
| `make auth-logs`    | See logs specifically for the `auth-service`        |
| `make product`      | Open a shell inside the `product-service` container |
| `make product-logs` | See logs specifically for the `product-service`     |
