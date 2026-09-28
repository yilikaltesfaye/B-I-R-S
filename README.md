# B-I-R-S

B-I-R-S (Broken Infrastructure Reporting System) is a platform for reporting broken public infrastructure and managing those reports.  
It provides separate interfaces for citizens, authorities, and administrators.

## Project status

The project is actively being improved. There is no live demo yet.

## Tech stack

### `backend`

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Redis
- JWT
- Zod
- Docker Compose

### `user-end`

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Tailwind CSS

### `authority-end`

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Tailwind CSS

### `admin-end`

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Tailwind CSS

## Features

- Three user roles:
  - User
  - Authority
  - Admin
- OTP-based authentication and verification
- Password reset using OTP verification
- JWT access and refresh tokens
- Refresh-token cookies
- Automatic access-token refresh in the frontends
- Redis-backed temporary verification tokens
- Infrastructure report creation and retrieval
- Report categorization
- Report routing to authority offices
- Report filtering by address and status
- Report status management:
  - Pending
  - In progress
  - Fixed
  - Rejected
- Role-based access control for users, authorities, and admins
- Comments and nested comment replies on reports
- Prisma schema and migrations for PostgreSQL
- Docker Compose services for PostgreSQL/PostGIS and Redis
- Shared API clients using Axios
- Client-side data fetching and caching with TanStack Query
- Request validation with Zod

## Folder structure

```text
.
├── backend/       Express API, Prisma schema, PostgreSQL, Redis, and authentication
├── user-end/      React application for citizens
├── authority-end/ React dashboard for authority staff
└── admin-end/     React application for administrators
```

## Prerequisites

- Node.js
- npm
- Docker and Docker Compose
- PostgreSQL and Redis access through the provided Docker Compose setup

## Setup

Clone the repository and install dependencies for each application:

```bash
git clone https://github.com/yilikaltesfaye/B-I-R-S.git
cd B-I-R-S

cd backend
npm install

cd ../user-end
npm install

cd ../authority-end
npm install

cd ../admin-end
npm install
```

## Environment variables

Create a `.env` file in `backend` with the following variable names:

```text
NODE_ENV
PORT
DATABASE_URL
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
REDIS_HOST
REDIS_PORT
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET
AFRO_MESSAGE_TRIAL_TOKEN
AFRO_MESSAGE_IDENTIFIER_ID
```

Create a `.env` file in each frontend directory with:

### `user-end/.env`

```text
VITE_API_BASE_URL
```

### `authority-end/.env`

```text
VITE_API_BASE_URL
```

### `admin-end/.env`

```text
VITE_API_BASE_URL
```

## Run the backend

From the `backend` directory, start PostgreSQL and Redis with Docker:

```bash
cd backend
npm run dev:docker
```

The Docker Compose configuration starts:

- PostgreSQL/PostGIS on port `5434`
- Redis on port `7000`

Run Prisma migrations:

```bash
npm run db:migrate
```

Generate the Prisma client if needed:

```bash
npm run db:generate
```

Start the backend in development mode:

```bash
npm run dev
```

The backend runs on port `5000` by default.

To stop the Docker services:

```bash
npm run dev:docker_down
```

To stop the services and remove their volumes:

```bash
npm run dev:docker_reset
```

## Run the user frontend

```bash
cd user-end
npm run dev
```

## Run the authority frontend

```bash
cd authority-end
npm run dev
```

## Run the admin frontend

```bash
cd admin-end
npm run dev
```

Each frontend can also be built and previewed with:

```bash
npm run build
npm run preview
```
