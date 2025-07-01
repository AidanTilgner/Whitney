# Whitney Backend Development Guide

This document provides instructions and guidelines for developers working on the Whitney backend codebase.

## Overview

The backend is a Node.js application built with Express and TypeScript. It serves a RESTful API for the Whitney whiteboarding application. Its primary responsibilities include:
- Managing whiteboard metadata (ID, title, creation date) in a SQLite database.
- Storing and retrieving Excalidraw scene data from the local filesystem.
- Handling chat history persistence (to be implemented).

**Core Technologies:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** `better-sqlite3` for local, file-based storage.
- **Package Manager:** PNPM

---

## Project Structure

The backend code is organized to maintain a clear separation of concerns.

```
Whitney/backend/
│
├── db/
│   └── database.db         # The SQLite database file (created on first run).
│
├── dist/                     # Compiled JavaScript output from TypeScript.
│
├── documentation/
│   ├── backend-development.md  # This file.
│   └── client-side-consumption.md # API documentation for clients.
│
├── node_modules/             # Project dependencies managed by pnpm.
│
├── src/                      # TypeScript source code.
│   │
│   ├── controllers/          # Express route handlers.
│   │   └── whiteboard.controller.ts
│   │
│   ├── models/               # TypeScript interfaces and type definitions.
│   │   └── whiteboard.model.ts
│   │
│   ├── routes/               # API route definitions.
│   │   └── whiteboard.routes.ts
│   │
│   ├── services/             # Business logic (database/filesystem interactions).
│   │   └── whiteboard.service.ts
│   │
│   └── index.ts              # Main application entry point and server setup.
│
├── storage/                  # Stores files for each whiteboard, organized by ID.
│   └── {whiteboard-id}/
│       └── excalidraw.json   # The raw Excalidraw scene data.
│
├── package.json              # Project metadata and dependencies.
├── pnpm-lock.yaml            # PNPM lockfile.
└── tsconfig.json             # TypeScript compiler configuration.
```

---

## Setup and Installation

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 20.x or higher recommended)
-   [PNPM](https://pnpm.io/installation) (version 10.x or higher recommended)

### Installation Steps

1.  Navigate to the project's backend directory from the project root:
    ```bash
    cd Whitney/backend
    ```

2.  Install the dependencies using PNPM:
    ```bash
    pnpm install
    ```

---

## Running the Application

Several scripts are configured in `package.json` to streamline development and execution.

### Development Mode

To run the server in development mode, you will need two terminal sessions. One will watch for file changes and recompile, and the other will run the server application.

1.  **Compile in watch mode:** In your first terminal, run the `dev` script. This command uses `tsc` to watch for changes to the TypeScript source files and automatically recompiles them into JavaScript in the `dist/` directory.
    ```bash
    pnpm dev
    ```

2.  **Run the application:** In a second terminal, run the `start` script. This will start the server using the compiled JavaScript files.
    ```bash
    pnpm start
    ```

    You will need to manually restart this process to see changes. For an improved development experience with automatic server restarts, consider using a tool like `nodemon`:
    ```bash
    # Example using nodemon
    pnpm add -D nodemon
    # Then update the "start" script in package.json to: "nodemon dist/index.js"
    ```

The server will be accessible at `http://localhost:3001`.

**Note on CORS:** The backend is configured in `src/index.ts` to allow cross-origin requests from any `localhost` port, which is necessary for local frontend development.

### Building for Production

To compile all TypeScript files into JavaScript in the `dist` directory, run the `build` script:

```bash
pnpm build
```

### Starting the Server

To run the already-compiled application (after running `pnpm build`), use the `start` script:

```bash
pnpm start
```

This is the command that should be used in a production environment to run the application.

---

## API Endpoints

The backend exposes several RESTful endpoints for managing whiteboards and their data. The main routes are:
- `GET /api/whiteboards`: Get all whiteboards.
- `POST /api/whiteboards`: Create a new whiteboard.
- `GET /api/whiteboards/:id`: Get a single whiteboard's metadata.
- `PUT /api/whiteboards/:id`: Update a whiteboard's title.
- `DELETE /api/whiteboards/:id`: Delete a whiteboard.
- `GET /api/whiteboards/:id/data`: Get a whiteboard's Excalidraw data.
- `PUT /api/whiteboards/:id/data`: Save a whiteboard's Excalidraw data.

For detailed information on request/response formats, see the [Client-Side API Documentation](./client-side-consumption.md).

---

## Contributing

To add a new feature or endpoint, follow the existing architectural pattern:

1.  **Model:** If you are introducing a new data entity, define its structure in a new file under `src/models/`.
2.  **Service:** Update `src/services/whiteboard.service.ts` with the business logic for the new feature. This includes all database queries and file system operations (like reading/writing `excalidraw.json`).
3.  **Controller:** Add a handler function in `src/controllers/whiteboard.controller.ts` to process incoming HTTP requests. The controller should be lean, calling the appropriate service methods and sending back the HTTP response.
4.  **Route:** Define the new endpoint in `src/routes/whiteboard.routes.ts` and connect it to your controller function.
5.  **Integrate:** The new route will be automatically included since the whiteboard router is already mounted in `src/index.ts`.
6.  **Document:** Update the [Client-Side API Documentation](./client-side-consumption.md) with details about the new endpoint.