#!/bin/bash

# This script automates the process of building and running both the
# backend and frontend servers for a production environment.

# Exit immediately if a command exits with a non-zero status.
set -e

# Get the directory of this script to reliably find the project root.
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# --- Cleanup Function ---
# Ensures all background server processes are terminated gracefully on exit.
cleanup() {
    echo ""
    echo "Shutting down production servers..."
    # The 'kill 0' command sends the signal to all processes in the current
    # process group, effectively stopping all child processes started by this script.
    kill 0
    echo "All servers have been shut down."
}

# Trap the SIGINT (Ctrl+C) and EXIT signals to execute the cleanup function.
trap cleanup SIGINT EXIT

# --- Build Phase ---
echo "--- Building Backend for Production ---"
cd "$BACKEND_DIR"
# Install only production dependencies
pnpm install --prod
pnpm build

echo ""
echo "--- Building Frontend for Production ---"
cd "$FRONTEND_DIR"
# Install only production dependencies
pnpm install --prod
pnpm build

# --- Run Phase ---

# Load backend environment variables to get the port
cd "$BACKEND_DIR"
if [ -f .env ]; then
    # Export the variables from the .env file
    export $(grep -v '^#' .env | xargs)
fi
# Set a default if the variable isn't defined
BACKEND_PORT=${BACKEND_PORT:-3001}

echo ""
echo "--- Starting Backend Server on port $BACKEND_PORT ---"
# Start the production server in the background and log its output
pnpm start &> "$PROJECT_ROOT/prod-backend.log" &


# Load frontend environment variables to get the port
cd "$FRONTEND_DIR"
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi
FRONTEND_PORT=${FRONTEND_PORT:-5173}

echo ""
echo "--- Starting Frontend Server on port $FRONTEND_PORT ---"
# Use 'pnpm exec' to run the locally installed 'serve' package.
# The '-s' flag rewrites all requests to 'index.html', which is crucial for SPAs.
# The '-l' flag specifies the port to listen on.
pnpm exec serve -s dist -l "$FRONTEND_PORT" &> "$PROJECT_ROOT/prod-frontend.log" &

# --- Final Instructions ---
echo ""
echo "Production servers are starting up..."
echo "Backend is running on port $BACKEND_PORT"
echo "Frontend is being served on port $FRONTEND_PORT"
echo ""
echo "Logs are available at:"
echo "  - Backend:  $PROJECT_ROOT/prod-backend.log"
echo "  - Frontend: $PROJECT_ROOT/prod-frontend.log"
echo ""
echo "Press Ctrl+C to shut down both servers."
echo ""

# The 'wait' command pauses the script here, keeping it alive until all
# background jobs (the servers) have completed or the script is interrupted.
wait