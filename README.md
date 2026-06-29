# 🛒 B-Shop server

A RESTful backend service for an e-commerce platform, built with Node.js, Express, and postgresql.

## 🚀 Features

- User authentication (JWT)
- Product & category management
- Shopping cart & orders

## 🧠 Tech Stack

- Node.js, Express
- Postgresql, Drizzle
- JWT Authentication

## 📄 Read Docs [here](./docs.md)

## Getting Started

### Prerequisites

- Node.js 22+
- Docker
- pnpm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/redarasmy/b-shop-server.git
cd b-shop-server
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

You can generate a jwt secret with the command below:

```bash
openssl rand --base64 64
```

4. **Set up the database**

```bash
docker compose up -d
pnpm db:migrate
```

5. **Run the app**

```bash
pnpm dev
```

The server will be running at `http://localhost:3000`.
