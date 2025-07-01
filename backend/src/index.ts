import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import whiteboardRoutes from "./routes/whiteboard.routes.js";
import dotenv from "dotenv";

dotenv.config();

// Create the express app
const app: Express = express();
const PORT = process.env.BACKEND_PORT || 3001;

// --- Middleware ---
// By setting origin to `true`, we are reflecting the request's origin.
// This is a flexible way to handle CORS in development, as it will
// allow requests from whatever port the frontend is running on.
app.use(cors({ origin: true }));
app.use(express.json());

// --- Database Setup ---
const dbPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../db/database.db",
);
const db = new Database(dbPath);
console.log("Connected to the SQLite database.");
// We can create our tables here if they don't exist
db.exec(`CREATE TABLE IF NOT EXISTS whiteboards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  createdAt TEXT NOT NULL
)`);

// --- API Routes ---
// A simple health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// We'll add more routes as we build out the features
app.use("/api/whiteboards", whiteboardRoutes);

// --- Root Route ---
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Whitney Backend API!");
});

// --- Start Server ---
const server = app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

// --- Graceful Shutdown ---
process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  db.close();
  console.log("Closed the database connection.");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
