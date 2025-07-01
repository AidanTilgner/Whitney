#!/bin/bash

# This script automates the process of building and running both the
# backend and frontend servers for local production. It ensures all
# dependencies are installed before attempting to build or run.

# Exit immediately if a command exits with a non-zero status.
set -e

# Get the directory of this script to reliably find the project root.
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."

# --- Cleanup Function ---
# This function is called when the script receives an interrupt signal (like Ctrl+C)
# to ensure all background server processes are terminated gracefully.
cleanup() {
    echo ""
    echo "Shutting down servers..."
    # The 'kill 0' command sends the signal to all processes in the current
    # process group, effectively stopping all child processes started by this script.
    kill 0
    echo "All servers have been shut down."
}

# Trap the SIGINT (Ctrl+C) and EXIT signals to execute the cleanup function.
# This ensures that we don't leave zombie processes running.
trap cleanup SIGINT EXIT

# --- Backend Setup ---
echo "--- Preparing Backend ---"
cd "$PROJECT_ROOT/backend"
echo "Installing backend dependencies..."
pnpm install
echo "Building backend..."
pnpm build > /dev/null # Pipe build output to null to keep the console clean
echo "Starting backend server in the background..."
# Start the server and redirect its output to a log file in the project root.
pnpm start &> "$PROJECT_ROOT/backend.log" &

# --- Frontend Setup ---
echo ""
echo "--- Preparing Frontend ---"
cd "$PROJECT_ROOT/frontend"
echo "Installing frontend dependencies..."
pnpm install
echo "Building frontend..."
# The 'pnpm build' is often for production and not strictly needed before 'pnpm run dev',
# but fulfilling the request to run both build scripts. Output is piped to null.
pnpm build > /dev/null
echo "Starting frontend dev server in the background..."
# Start the Vite dev server and redirect its output to a log file.
pnpm run preview &> "$PROJECT_ROOT/frontend.log" &

# --- Final Instructions ---
echo ""
echo "Backend and frontend servers are starting up..."
echo "You can monitor their logs at:"
echo "  - Backend:  $PROJECT_ROOT/backend.log"
echo "  - Frontend: $PROJECT_ROOT/frontend.log"
echo ""
echo "The application will be available at the URL provided by the frontend server (usually http://localhost:4173/)."
echo "Press Ctrl+C to shut down both servers and exit this script."
echo ""

# The 'wait' command pauses the script here, keeping it alive.
# It will wait until all background jobs (the servers) have completed.
# The 'trap' will interrupt the wait, allowing the cleanup function to run.
wait
