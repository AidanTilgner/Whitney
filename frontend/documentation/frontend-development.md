# Whitney Frontend Development Guide

This document provides instructions and guidelines for developers working on the Whitney frontend codebase.

## Overview

The frontend is a modern Single Page Application (SPA) built with React. It provides the user interface for creating, viewing, and interacting with whiteboards. The application is designed to be lightweight, fast, and easy to develop for.

**Core Technologies:**
- **Framework:** React
- **Build Tool:** Vite
- **Language:** TypeScript
- **UI Components:** Mantine
- **Whiteboard Canvas:** Excalidraw

---

## Project Structure

The frontend source code is located in the `src/` directory and is organized to separate concerns.

```
Whitney/frontend/
│
├── documentation/
│   └── frontend-development.md # This file.
│
├── public/                 # Static assets.
│
├── src/                    # TypeScript source code.
│   │
│   ├── api/                # Functions for communicating with the backend API.
│   │   └── api.ts
│   │
│   ├── components/         # Reusable, shared React components.
│   │
│   ├── pages/              # Top-level components representing application pages.
│   │   ├── Dashboard.tsx
│   │   └── Whiteboard.tsx
│   │
│   ├── App.tsx             # Main application shell and layout component.
│   ├── main.tsx            # The entry point for the React application.
│   └── vite-env.d.ts       # Vite environment type definitions.
│
├── index.html              # The main HTML file for the SPA.
├── package.json            # Project metadata and dependencies.
├── pnpm-lock.yaml          # PNPM lockfile.
├── tsconfig.json           # TypeScript compiler configuration.
└── vite.config.ts          # Vite configuration.
```

---

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 20.x or higher recommended)
-   [PNPM](https://pnpm.io/installation) (version 10.x or higher recommended)

### Installation and Setup

1.  Navigate to the project's frontend directory from the project root:
    ```bash
    cd Whitney/frontend
    ```

2.  Install the dependencies using PNPM:
    ```bash
    pnpm install
    ```

### Running the Development Server

To start the local development server with hot-reloading:

```bash
pnpm run dev
```

The application will be accessible at `http://localhost:5173` (or the next available port). The server will automatically reload as you save changes to the source files.

---

## Application Architecture

The application is structured around a main `AppShell` provided by Mantine, which is configured in `src/App.tsx`.

### Routing

The application uses `react-router-dom` for client-side routing. The routing is configured in `App.tsx` with the following structure:

- `/` - Dashboard page (home/landing page)
- `/whiteboard/:id` - Individual whiteboard page with dynamic ID parameter

The routing system allows for:
- Direct navigation to specific whiteboards via URL
- Browser back/forward navigation
- Bookmark-able whiteboard URLs

### Pages

-   **`Dashboard.tsx`**: This is the main landing page (route: `/`). Its primary responsibilities are:
    -   Fetching the list of all available whiteboards from the backend API.
    -   Displaying the list of whiteboards in a grid.
    -   Providing a "Create New Whiteboard" button that opens a modal to get the new whiteboard's title.
    -   Handling the creation of new whiteboards by calling the API.
    -   Navigation to individual whiteboards via the "Open Whiteboard" button.

-   **`Whiteboard.tsx`**: This page handles individual whiteboard sessions (route: `/whiteboard/:id`). Its responsibilities are now more complex:
    -   Extracts the whiteboard ID from the URL parameters using `useParams`.
    -   On component mount, it fetches the existing whiteboard data from the backend using the `getWhiteboardData` API call.
    -   Displays a loading overlay while the data is being fetched.
    -   Initializes the `@excalidraw/excalidraw` component with the fetched data.
    -   It uses a debounced `onChange` handler to automatically save any changes made by the user back to the backend via the `saveWhiteboardData` API call. This prevents excessive API requests while the user is actively drawing.
    -   Provides robust error handling and user feedback for both loading and saving operations.
    -   The component is configured with a dark theme and has some UI options customized to hide unnecessary buttons like "Load Scene".

### API Layer

All communication with the backend is handled through functions defined in `src/api/api.ts`. This file centralizes API logic, making it easier to manage and update. It exports functions for all whiteboard-related operations, including `getAllWhiteboards`, `createWhiteboard`, `getWhiteboardData`, and `saveWhiteboardData`. It also defines the necessary TypeScript interfaces (`Whiteboard`, `WhiteboardData`, etc.) to ensure type safety between the frontend and backend.

### State Management

-   **Component State:** The application primarily uses React's built-in `useState` and `useEffect` hooks for managing local component state.
    -   In `Dashboard.tsx`, this includes the list of whiteboards, loading status, and errors.
    -   In `Whiteboard.tsx`, this includes the `initialData` for the canvas, the `isLoading` state for the initial data fetch, and any potential `error` messages.
-   **Mantine Hooks:** We leverage Mantine's rich hooks library:
    -   `useDisclosure` is used for easily managing the open/closed state of modals.
    -   `useForm` provides a robust solution for handling form state, validation, and submission, as seen in the "Create Whiteboard" modal.

---

## Future Development & Contributing

To contribute to the frontend, please follow the existing patterns.

**Next Steps:**

1.  ✅ **Implement Routing:** Completed - The application now uses `react-router-dom` with proper URL structure for dashboard (`/`) and individual whiteboards (`/whiteboard/:id`).
2.  ✅ **Connect "Open Whiteboard":** Completed - Dashboard cards now properly navigate to the specific whiteboard page using the whiteboard ID.
3.  ✅ **Data Persistence for Excalidraw**: Completed - The `Whiteboard.tsx` page now automatically fetches canvas data on load and saves it back to the backend on change.
4.  **Chat Functionality**: Once the backend supports it, implement the chat interface, which will be a toggleable panel on the `Whiteboard` page.
5.  **Whiteboard Management**: Add functionality to edit whiteboard titles and delete whiteboards from the dashboard.
6.  **Filtering**: Implement the whiteboard filtering by title functionality mentioned in project requirements.