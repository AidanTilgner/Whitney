# Whitney Backend API Documentation

This document provides instructions for client-side applications to interact with the Whitney backend API.

## Base URL

All API endpoints are relative to the following base URL:

```
http://localhost:3001/api
```

---

## Health Check

A simple endpoint to verify that the backend server is running and accessible.

### `GET /health`

-   **Description:** Checks the status of the API server.
-   **Request Body:** None.
-   **Success Response (200 OK):**

    ```json
    {
      "status": "ok"
    }
    ```

-   **Example:**

    ```bash
    curl http://localhost:3001/api/health
    ```

---

## Whiteboards API

The Whiteboards API provides endpoints for managing whiteboards.

### 1. Get All Whiteboards

Retrieves a list of all existing whiteboards, sorted by the most recently created.

#### `GET /whiteboards`

-   **Description:** Fetches an array of all whiteboard objects.
-   **Request Body:** None.
-   **Success Response (200 OK):**

    ```json
    [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "title": "My First Whiteboard",
        "createdAt": "2023-10-27T10:00:00.000Z"
      },
      {
        "id": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
        "title": "Team Brainstorm",
        "createdAt": "2023-10-26T15:30:00.000Z"
      }
    ]
    ```

-   **Example:**

    ```bash
    curl http://localhost:3001/api/whiteboards
    ```

### 2. Create a New Whiteboard

Creates a new whiteboard record and its corresponding storage directory on the server.

#### `POST /whiteboards`

-   **Description:** Creates a new whiteboard.
-   **Request Body:**

    ```json
    {
      "title": "New Project Ideas"
    }
    ```

-   **Success Response (201 Created):** Returns the newly created whiteboard object.

    ```json
    {
      "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
      "title": "New Project Ideas",
      "createdAt": "2023-10-27T12:00:00.000Z"
    }
    ```

-   **Error Response (400 Bad Request):** If the `title` is missing or invalid.
    ```json
    {
      "message": "Title is required and must be a non-empty string."
    }
    ```
-   **Example:**

    ```bash
    curl -X POST -H "Content-Type: application/json" \
      -d '{"title": "New Project Ideas"}' \
      http://localhost:3001/api/whiteboards
    ```

### 3. Get a Single Whiteboard

Retrieves a specific whiteboard by its unique ID.

#### `GET /whiteboards/:id`

-   **Description:** Fetches a single whiteboard object by its ID.
-   **URL Parameters:**
    -   `id` (string, required): The unique identifier of the whiteboard.
-   **Request Body:** None.
-   **Success Response (200 OK):**

    ```json
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "title": "My First Whiteboard",
      "createdAt": "2023-10-27T10:00:00.000Z"
    }
    ```
-   **Error Response (404 Not Found):**
    ```json
    {
      "message": "Whiteboard not found."
    }
    ```
-   **Example:**

    ```bash
    curl http://localhost:3001/api/whiteboards/a1b2c3d4-e5f6-7890-1234-567890abcdef
    ```

### 4. Update a Whiteboard's Title

Updates the title of a specific whiteboard.

#### `PUT /whiteboards/:id`

-   **Description:** Updates an existing whiteboard's title.
-   **URL Parameters:**
    -   `id` (string, required): The unique identifier of the whiteboard to update.
-   **Request Body:**

    ```json
    {
      "title": "My Updated Whiteboard Title"
    }
    ```

-   **Success Response (200 OK):** Returns the fully updated whiteboard object.

    ```json
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "title": "My Updated Whiteboard Title",
      "createdAt": "2023-10-27T10:00:00.000Z"
    }
    ```
-   **Error Responses:**
    -   **400 Bad Request:** If `title` is missing or invalid.
    -   **404 Not Found:** If no whiteboard with the given `id` exists.

-   **Example:**

    ```bash
    curl -X PUT -H "Content-Type: application/json" \
      -d '{"title": "My Updated Whiteboard Title"}' \
      http://localhost:3001/api/whiteboards/a1b2c3d4-e5f6-7890-1234-567890abcdef
    ```

### 5. Delete a Whiteboard

Permanently deletes a whiteboard and all its associated files from the server.

#### `DELETE /whiteboards/:id`

-   **Description:** Deletes a whiteboard by its ID.
-   **URL Parameters:**
    -   `id` (string, required): The unique identifier of the whiteboard to delete.
-   **Request Body:** None.
-   **Success Response (204 No Content):** An empty response indicates successful deletion.
-   **Error Response (404 Not Found):**
    ```json
    {
      "message": "Whiteboard not found."
    }
    ```
-   **Example:**

    ```bash
    curl -X DELETE http://localhost:3001/api/whiteboards/a1b2c3d4-e5f6-7890-1234-567890abcdef
        ```

    ---

    ### 6. Get Whiteboard Data

    Retrieves the Excalidraw data (elements and app state) for a specific whiteboard.

    #### `GET /whiteboards/:id/data`

    -   **Description:** Fetches the scene data for a single whiteboard. If no data has been saved for the whiteboard yet, it returns a default empty structure. This endpoint does not return a 404 if the whiteboard ID is invalid; it will return the default empty structure.
    -   **URL Parameters:**
        -   `id` (string, required): The unique identifier of the whiteboard.
    -   **Request Body:** None.
    -   **Success Response (200 OK):** Can be either the saved data or the default structure.

        *Saved Data Example:*
        ```json
        {
          "elements": [ { "id": "...", "type": "rectangle" } ],
          "appState": { "viewBackgroundColor": "#fafafa" }
        }
        ```

        *Default Structure (No data saved yet):*
        ```json
        {
            "elements": [],
            "appState": {}
        }
        ```

    -   **Example:**

        ```bash
        curl http://localhost:3001/api/whiteboards/a1b2c3d4-e5f6-7890-1234-567890abcdef/data
        ```

    ### 7. Save Whiteboard Data

    Saves or updates the Excalidraw data for a specific whiteboard. This is an idempotent `PUT` operation.

    #### `PUT /whiteboards/:id/data`

    -   **Description:** Saves the scene data for a whiteboard. The server will not create a data file if the whiteboard ID does not exist in the database, but it will still return a success response.
    -   **URL Parameters:**
        -   `id` (string, required): The unique identifier of the whiteboard.
    -   **Request Body:** The Excalidraw scene object, including `elements` and `appState`.

        ```json
        {
          "elements": [
            {
              "type": "rectangle",
              "version": 1,
              "id": "elementId1",
              "...": "..."
            }
          ],
          "appState": {
            "viewBackgroundColor": "#fafafa"
          }
        }
        ```
    -   **Success Response (200 OK):**
        ```json
        {
          "message": "Data saved successfully."
        }
        ```
    -   **Error Response (400 Bad Request):**
        ```json
        {
            "message": "Invalid data payload."
        }
        ```

    -   **Example:**

        ```bash
        curl -X PUT -H "Content-Type: application/json" \
          -d '{"elements": [], "appState": {}}' \
          http://localhost:3001/api/whiteboards/a1b2c3d4-e5f6-7890-1234-567890abcdef/data
        ```
