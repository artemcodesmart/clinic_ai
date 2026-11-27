# AI Dental Clinic Management Platform

A full-stack dental clinic management platform built with Django REST Framework and React. The application combines appointment management, clinic administration, real-time communication, and an AI-powered receptionist.

## Overview

The platform is designed to help dental clinics manage their daily operations through a centralized system.

It includes a backend API, a React frontend, PostgreSQL data storage, real-time communication, and integration with the OpenAI API.

## Key Features

- **Clinic Management** — clinic information and administrative functionality.
- **Appointment Management** — appointment creation, availability checking, cancellation, and rescheduling.
- **Doctor Management** — doctor information and working schedules.
- **AI Receptionist** — an OpenAI-powered assistant that can interact with clinic data through application tools.
- **Real-Time Communication** — WebSocket-based communication using Django Channels.
- **Lead Management** — API endpoints for handling potential patients.
- **Authentication** — JWT-based authentication for protected API endpoints.
- **Admin Dashboard** — interfaces for managing appointments, doctors, conversations, and clinic operations.

## Technology Stack

### Backend
- Python
- Django
- Django REST Framework
- PostgreSQL
- Django Channels
- Daphne
- Redis
- Celery
- OpenAI API
- Simple JWT

### Frontend
- JavaScript
- React
- Vite
- React Router
- Axios
- Recharts

### Infrastructure
- Railway
- Docker
- Git and GitHub

## Architecture

```text
                    React Frontend
                          |
                          | HTTP / REST API
                          | WebSocket
                          |
                    Django Backend
                          |
          +---------------+---------------+
          |               |               |
      PostgreSQL        Redis          OpenAI API
          |               |
     Application      Channels /
        Data           Celery
```

## Backend Structure

```text
clinic/
├── accounts/        # Authentication and user accounts
├── ai/              # AI receptionist and tool execution
├── appointments/    # Appointment management
├── automation/      # Automation functionality
├── clinics/         # Clinic management and dashboard APIs
├── common/          # Shared application functionality
├── config/          # Django settings, ASGI and URL configuration
├── conversations/   # Chat and WebSocket functionality
├── core_events/     # Internal event handling
├── leads/           # Lead management
├── manage.py
└── requirements.txt
```

## Frontend Structure

```text
frontend/
└── src/
    ├── components/  # Reusable UI components
    ├── pages/       # Application pages
    ├── services/    # API communication
    ├── App.jsx
    └── main.jsx
```

## API Endpoints

Main API route groups:

| Endpoint | Description |
|---|---|
| `/api/auth/` | Authentication |
| `/api/clinics/` | Public clinic endpoints |
| `/api/appointments/` | Appointment management |
| `/api/dashboard/` | Clinic dashboard |
| `/api/conversations/` | Conversations and chat |
| `/api/leads/` | Lead management |

## Local Development

### Prerequisites

- Python
- Node.js and npm
- PostgreSQL
- Redis

### 1. Clone the repository

```bash
git clone https://github.com/2sexyfortshirt/clinic_ai.git
cd clinic_ai
```

### 2. Backend setup

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a local `.env` file and configure the required environment variables.

The application uses environment-based configuration for database credentials, Redis, and external API access.

Apply database migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

### 4. Supporting services

PostgreSQL and Redis must be available for the corresponding application features.

Docker Compose configuration is also included in the repository for local infrastructure setup.

## Engineering Focus

This project has involved practical work with:

- Designing REST APIs and organizing Django applications.
- Modeling relational data and working with PostgreSQL.
- Implementing authentication and protected endpoints.
- Managing appointment availability and scheduling operations.
- Building real-time communication with WebSockets.
- Integrating AI tools with backend business logic.
- Connecting a React frontend to a Django API.
- Configuring application deployment and environment variables.

## Deployment

The application has been deployed using Railway.

The project uses separate frontend and backend services and a PostgreSQL database.

## Project Status

The project is under active development. Features and architecture may evolve as the application grows.

---

**Built as an independent full-stack software engineering project.**