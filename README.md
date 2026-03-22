# Diary Web Application

A full-stack diary application built with a modern tech stack, featuring rich text editing, secure authentication, and a responsive user interface.

## Features

- **User Authentication**: Secure login and registration with JWT.
- **Google OAuth**: Easy sign-in using Google accounts.
- **Rich Text Editor**: Create expressive diary entries using the Lexical editor.
- **Dashboard & Analytics**: Visualize your diary habits with integrated charts (Recharts).
- **Responsive Design**: Built with Tailwind CSS and Radix UI for a seamless experience across devices.
- **Masonry Layout**: Optimized display for diary entries.

## Tech Stack

### Frontend

- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **State Management**: Redux Toolkit
- **UI Components**: Radix UI, Lucide React
- **Rich Text Editor**: Lexical
- **Data Fetching**: Axios
- **Forms**: React Hook Form, Zod
- **Charts**: Recharts

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: Passport.js (Google OAuth), JWT, bcrypt
- **Validation**: Express Validator
- **Email Service**: Nodemailer

### DevOps

- **Containerization**: Docker, Docker Compose

## Prerequisites

- **Node.js**: v18+
- **npm**: v9+
- **Docker & Docker Compose** (Optional, for containerized setup)
- **MongoDB**: Running instance (Local or Atlas)

## Getting Started

### Option 1: Using Docker (Recommended)

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd diary
    ```

2.  Start the application:

    ```bash
    docker-compose up --build
    ```

3.  Access the application:
    - **Frontend**: `http://localhost:5173`
    - **Backend API**: `http://localhost:5000`

### Option 2: Running Locally

#### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file based on `.env.example` and configure your environment variables (MongoDB URI, Google Client ID/Secret, etc.).
4.  Start the server:
    ```bash
    npm run dev
    ```

#### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
