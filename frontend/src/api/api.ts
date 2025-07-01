const BASE_URL = "http://localhost:3001/api";

export interface Whiteboard {
  id: string;
  title: string;
  createdAt: string;
}

// Basic types for Excalidraw data.
// These are simplified and can be expanded if more specific typing is needed.
export type ExcalidrawElement = object;
export type AppState = object;

export interface WhiteboardData {
  elements: readonly ExcalidrawElement[];
  appState: AppState;
}

/**
 * Fetches all whiteboards from the backend API.
 * @returns A promise that resolves to an array of Whiteboard objects.
 */
export const getAllWhiteboards = async (): Promise<Whiteboard[]> => {
  try {
    const response = await fetch(`${BASE_URL}/whiteboards`);
    if (!response.ok) {
      throw new Error(`Failed to fetch whiteboards: ${response.statusText}`);
    }
    const data: Whiteboard[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getAllWhiteboards:", error);
    // Re-throw the error so the UI layer can handle it
    throw error;
  }
};

/**
 * Creates a new whiteboard by sending a POST request to the backend.
 * @param title The title of the new whiteboard.
 * @returns A promise that resolves to the newly created Whiteboard object.
 */
export const createWhiteboard = async (title: string): Promise<Whiteboard> => {
  try {
    const response = await fetch(`${BASE_URL}/whiteboards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create whiteboard");
    }

    const newWhiteboard: Whiteboard = await response.json();
    return newWhiteboard;
  } catch (error) {
    console.error("Error in createWhiteboard:", error);
    throw error;
  }
};

/**
 * Retrieves the data for a specific whiteboard.
 * @param id The ID of the whiteboard.
 * @returns A promise that resolves to the whiteboard data.
 */
export const getWhiteboardData = async (
  id: string,
): Promise<WhiteboardData> => {
  try {
    const response = await fetch(`${BASE_URL}/whiteboards/${id}/data`);
    if (!response.ok) {
      // The backend sends a default structure if the file doesn't exist,
      // so a 404 is a real error here.
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch whiteboard data");
    }
    const data: WhiteboardData = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getWhiteboardData:", error);
    throw error;
  }
};

/**
 * Saves the data for a specific whiteboard.
 * @param id The ID of the whiteboard.
 * @param data The whiteboard data to save.
 */
export const saveWhiteboardData = async (
  id: string,
  data: WhiteboardData,
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/whiteboards/${id}/data`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save whiteboard data");
    }
  } catch (error) {
    console.error("Error in saveWhiteboardData:", error);
    throw error;
  }
};

// Add other API functions here as needed (getById, update, delete)
