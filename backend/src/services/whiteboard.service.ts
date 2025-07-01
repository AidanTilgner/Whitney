import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Whiteboard } from "../models/whiteboard.model.js";

// --- Database Setup ---
// In a larger app, this should be in a dedicated file and the `db` instance
// should be shared across services (e.g., via dependency injection).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "../../db/database.db");
const db = new Database(dbPath);

// --- File Storage Setup ---
// This should be loaded from a configuration file.
const STORAGE_PATH = path.resolve(__dirname, "../../storage");

// Ensure the base storage directory exists.
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
  console.log(`Storage directory created at: ${STORAGE_PATH}`);
}

/**
 * Creates a new whiteboard record in the database and a corresponding directory on the filesystem.
 * @param title The title for the new whiteboard.
 * @returns The newly created whiteboard object.
 */
export function createWhiteboard(title: string): Whiteboard {
  const newWhiteboard: Whiteboard = {
    id: randomUUID(),
    title: title.trim(),
    createdAt: new Date().toISOString(),
  };

  const stmt = db.prepare(
    "INSERT INTO whiteboards (id, title, createdAt) VALUES (?, ?, ?)",
  );
  stmt.run(newWhiteboard.id, newWhiteboard.title, newWhiteboard.createdAt);

  const whiteboardDir = path.join(STORAGE_PATH, newWhiteboard.id);
  fs.mkdirSync(whiteboardDir, { recursive: true });

  return newWhiteboard;
}

/**
 * Retrieves all whiteboards from the database.
 * @returns An array of all whiteboard objects, sorted by creation date.
 */
export function getAllWhiteboards(): Whiteboard[] {
  const stmt = db.prepare("SELECT * FROM whiteboards ORDER BY createdAt DESC");
  const whiteboards = stmt.all() as Whiteboard[];
  return whiteboards;
}

/**
 * Retrieves a single whiteboard by its ID.
 * @param id The ID of the whiteboard to retrieve.
 * @returns The whiteboard object if found, otherwise undefined.
 */
export function getWhiteboardById(id: string): Whiteboard | undefined {
  const stmt = db.prepare("SELECT * FROM whiteboards WHERE id = ?");
  const whiteboard = stmt.get(id) as Whiteboard | undefined;
  return whiteboard;
}

/**
 * Updates the title of a specific whiteboard.
 * @param id The ID of the whiteboard to update.
 * @param title The new title.
 * @returns The updated whiteboard object if found, otherwise undefined.
 */
export function updateWhiteboardTitle(
  id: string,
  title: string,
): Whiteboard | undefined {
  const stmt = db.prepare("UPDATE whiteboards SET title = ? WHERE id = ?");
  const result = stmt.run(title.trim(), id);

  if (result.changes === 0) {
    return undefined;
  }

  return getWhiteboardById(id);
}

/**
 * Deletes a whiteboard from the database and removes its associated storage directory.
 * @param id The ID of the whiteboard to delete.
 * @returns `true` if the whiteboard was successfully deleted, otherwise `false`.
 */
export function deleteWhiteboard(id: string): boolean {
  const whiteboardDir = path.join(STORAGE_PATH, id);
  if (fs.existsSync(whiteboardDir)) {
    fs.rmSync(whiteboardDir, { recursive: true, force: true });
  }

  const stmt = db.prepare("DELETE FROM whiteboards WHERE id = ?");
  const result = stmt.run(id);

  return result.changes > 0;
}

/**
 * Saves the Excalidraw data for a specific whiteboard.
 * @param id The ID of the whiteboard.
 * @param data The Excalidraw scene data (elements, appState).
 */
export function saveWhiteboardData(id: string, data: any): void {
  const whiteboardDir = path.join(STORAGE_PATH, id);

  // If the directory doesn't exist, check if the whiteboard record exists.
  if (!fs.existsSync(whiteboardDir)) {
    const whiteboard = getWhiteboardById(id);
    if (!whiteboard) {
      // If the whiteboard doesn't exist in the database, we should not save data.
      console.error(
        `Whiteboard with ID ${id} not found in database. Cannot save data.`,
      );
      return;
    }
    // If the record exists but the directory doesn't (e.g., manual deletion), recreate it.
    fs.mkdirSync(whiteboardDir, { recursive: true });
  }

  const filePath = path.join(whiteboardDir, "excalidraw.json");
  // The data from the client should be a JSON object for Excalidraw.
  // We stringify it before saving.
  fs.writeFileSync(filePath, JSON.stringify(data), "utf-8");
}

/**
 * Retrieves the Excalidraw data for a specific whiteboard.
 * @param id The ID of the whiteboard.
 * @returns The whiteboard data as a JSON string, or null if not found.
 */
export function getWhiteboardData(id: string): string | null {
  const filePath = path.join(STORAGE_PATH, id, "excalidraw.json");
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf-8");
  }
  return null;
}
