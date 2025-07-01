> [!warning]
> This entire repository is vibe-coded, written by AI. It's a simple tool I just wanted to exist and spun into existence. So don't expect the highest quality!

# Whitney

Whitney is a lightweight, local-first, self-hosted whiteboarding application designed for fluid collaboration and AI-powered chat.

## Overview

This project provides a simple and powerful whiteboarding experience using Excalidraw, integrated with a sleek chat interface for conversing with an AI about the content on your canvas. It's designed to be run locally without the need for complex setup or authentication, making it a perfect tool for personal projects, brainstorming, and quick diagramming sessions.

### Core Features

-   **Fluid Whiteboarding:** Powered by the excellent `@excalidraw/excalidraw` component.
-   **Persistent Storage:** Your whiteboards are automatically saved to your local filesystem.
-   **Dashboard:** A central place to view, create, and manage all your whiteboards.
-   **Configurable and Scripted:** Easy to run with development and production scripts, and configurable ports.
-   **(Upcoming) AI Chat:** A chat interface to discuss the contents of your whiteboard with a Gemini model.

## Core Technologies

-   **Frontend:** React, Vite, TypeScript, Mantine (UI), Excalidraw
-   **Backend:** Node.js, Express, TypeScript, better-sqlite3
-   **Package Manager:** PNPM

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   [Node.js](https://nodejs.org/) (v20.x or higher is recommended)
-   [PNPM](https://pnpm.io/installation) (v10.x or higher is recommended)

---

## Getting Started

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd Whitney
    ```

2.  **Configuration (Optional):**
    The application ports can be configured via `.env` files. You can create these files before the first run if you need to use ports other than the defaults.

    -   **Backend Port:** Create a file at `Whitney/backend/.env`
        ```
        # The port the backend server will listen on.
        BACKEND_PORT=3001
        ```

    -   **Frontend Port:** Create a file at `Whitney/frontend/.env`
        ```
        # The port the Vite development server will run on.
        FRONTEND_PORT=5173
        ```

    These `.env` files are ignored by Git, so your local configuration will not be committed.

---

## Running the Application

This project includes convenient scripts to handle building, installing dependencies, and running the servers.

### Development Mode

For local development with hot-reloading for the frontend.

1.  **Navigate to the scripts directory:**
    ```bash
    cd scripts
    ```

2.  **Run the development script:**
    ```bash
    ./run-dev.sh
    ```

This script will:
- Install all dependencies for both the frontend and backend.
- Build the backend.
- Start the backend server.
- Start the Vite development server for the frontend.
- Log output for both servers to `backend.log` and `frontend.log` in the project root.

The application will be accessible at the frontend URL (default: `http://localhost:5173`). Press `Ctrl+C` in the terminal running the script to shut down all processes.

### Production Mode

To simulate a production environment, this script builds both applications and serves the optimized frontend build.

1.  **Navigate to the scripts directory:**
    ```bash
    cd scripts
    ```

2.  **Run the production script:**
    ```bash
    ./run-prod.sh
    ```
This script will:
- Install only production dependencies.
- Build both the frontend and backend for production.
- Start the backend server.
- Serve the static frontend files from the `frontend/dist` directory.
- Log output to `prod-backend.log` and `prod-frontend.log`.

---

## Project Structure

The project is a monorepo organized into the following main directories:

-   `/backend`: The Express.js backend server.
-   `/frontend`: The React SPA (Single Page Application).
-   `/scripts`: Contains helper scripts for running the application (`run-dev.sh`, `run-prod.sh`).

## Detailed Documentation

For more in-depth information about the architecture and contribution guidelines for each part of the application, please refer to the documentation within the respective directories:

-   **[Backend Development Guide](./backend/documentation/backend-development.md)**
-   **[Frontend Development Guide](./frontend/documentation/frontend-development.md)**
