import { Router } from "express";
import {
  createWhiteboardHandler,
  getAllWhiteboardsHandler,
  getWhiteboardByIdHandler,
  updateWhiteboardTitleHandler,
  deleteWhiteboardHandler,
  getWhiteboardDataHandler,
  saveWhiteboardDataHandler,
} from "../controllers/whiteboard.controller.js";

const router = Router();

// Route to get all whiteboards and create a new whiteboard
router.route("/").get(getAllWhiteboardsHandler).post(createWhiteboardHandler);

// Route to get, update, and delete a specific whiteboard
router
  .route("/:id")
  .get(getWhiteboardByIdHandler)
  .put(updateWhiteboardTitleHandler) // Using PUT for simplicity to update the title
  .delete(deleteWhiteboardHandler);

// Route to get and save whiteboard data
router
  .route("/:id/data")
  .get(getWhiteboardDataHandler)
  .put(saveWhiteboardDataHandler);

export default router;
