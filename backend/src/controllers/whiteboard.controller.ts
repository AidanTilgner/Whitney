import { Request, Response } from "express";
import * as whiteboardService from "../services/whiteboard.service.js";

/**
 * Handles the creation of a new whiteboard.
 * Expects a `title` in the request body.
 */
export const createWhiteboardHandler = (req: Request, res: Response): void => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      res
        .status(400)
        .json({ message: "Title is required and must be a non-empty string." });
      return;
    }

    const newWhiteboard = whiteboardService.createWhiteboard(title);
    res.status(201).json(newWhiteboard);
  } catch (error) {
    console.error("Error creating whiteboard:", error);
    res.status(500).json({ message: "Failed to create whiteboard." });
  }
};

/**
 * Handles fetching all whiteboards.
 */
export const getAllWhiteboardsHandler = (req: Request, res: Response): void => {
  try {
    const whiteboards = whiteboardService.getAllWhiteboards();
    res.status(200).json(whiteboards);
  } catch (error) {
    console.error("Error getting all whiteboards:", error);
    res.status(500).json({ message: "Failed to retrieve whiteboards." });
  }
};

/**
 * Handles fetching a single whiteboard by its ID.
 * Expects `id` as a URL parameter.
 */
export const getWhiteboardByIdHandler = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const whiteboard = whiteboardService.getWhiteboardById(id);

    if (whiteboard) {
      res.status(200).json(whiteboard);
    } else {
      res.status(404).json({ message: "Whiteboard not found." });
    }
  } catch (error) {
    console.error(`Error getting whiteboard by ID:`, error);
    res.status(500).json({ message: "Failed to retrieve whiteboard." });
  }
};

/**
 * Handles updating a whiteboard's title.
 * Expects `id` as a URL parameter and `title` in the request body.
 */
export const updateWhiteboardTitleHandler = (
  req: Request,
  res: Response,
): void => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      res
        .status(400)
        .json({ message: "Title is required and must be a non-empty string." });
      return;
    }

    const updatedWhiteboard = whiteboardService.updateWhiteboardTitle(
      id,
      title,
    );

    if (updatedWhiteboard) {
      res.status(200).json(updatedWhiteboard);
    } else {
      res.status(404).json({ message: "Whiteboard not found." });
    }
  } catch (error) {
    console.error("Error updating whiteboard title:", error);
    res.status(500).json({ message: "Failed to update whiteboard." });
  }
};

/**
 * Handles deleting a whiteboard.
 * Expects `id` as a URL parameter.
 */
export const deleteWhiteboardHandler = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const wasDeleted = whiteboardService.deleteWhiteboard(id);

    if (wasDeleted) {
      res.status(204).send(); // 204 No Content
    } else {
      res.status(404).json({ message: "Whiteboard not found." });
    }
  } catch (error) {
    console.error("Error deleting whiteboard:", error);
    res.status(500).json({ message: "Failed to delete whiteboard." });
  }
};

/**
 * Handles retrieving the data for a specific whiteboard.
 * Expects `id` as a URL parameter.
 */
export const getWhiteboardDataHandler = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const data = whiteboardService.getWhiteboardData(id);

    if (data) {
      // Data is stored as a JSON string, parse it before sending.
      res.status(200).json(JSON.parse(data));
    } else {
      // If no file exists, it's not an error. It just means no data has been saved yet.
      // Return a default structure for the frontend to initialize a blank board.
      res.status(200).json({
        elements: [],
        appState: {},
      });
    }
  } catch (error) {
    console.error("Error getting whiteboard data:", error);
    res.status(500).json({ message: "Failed to retrieve whiteboard data." });
  }
};

/**
 * Handles saving the data for a specific whiteboard.
 * Expects `id` as a URL parameter and the scene data in the request body.
 */
export const saveWhiteboardDataHandler = (
  req: Request,
  res: Response,
): void => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Basic validation: ensure data is a non-null object.
    // Excalidraw scenes can be empty, so we just check the type.
    if (!data || typeof data !== "object") {
      res.status(400).json({ message: "Invalid data payload." });
      return;
    }

    whiteboardService.saveWhiteboardData(id, data);
    res.status(200).json({ message: "Data saved successfully." });
  } catch (error) {
    console.error("Error saving whiteboard data:", error);
    res.status(500).json({ message: "Failed to save whiteboard data." });
  }
};
