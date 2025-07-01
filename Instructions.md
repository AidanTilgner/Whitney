Hello Gemini!

## MISSION
We are on a mission to build the ultimate lightweight, local self-hosted whiteboarding application.

## Project Description
Whitney is a self-hosted, local-first whiteboarding application, with two distinct features:
1. Simple, fluid and extremely useful whiteboarding powered by Excalidraw
2. A sleek, modern chat interface to converse with an AI about what is in the current whiteboard frame

The application is designed with the intent to allow whiteboarding, and conversation with AI about what you are currently looking at. You can create a new "Whiteboard", and immediately get to work. When you click on the chat icon, a chat window will open to the right, and you can start to have a conversation about what is currently in the user's whiteboard viewport, only what they can currently see will be sent to the model.

## Project Requirements
- Must be able to create and edit multiple Excalidraw whiteboards
- Must interface with Gemini API to allow a chat experience, and have a setting page to configure model settings
- Must store the data persistently in the local filesystem
- Must be lightweight, and simple in design and architecture, with no additional fluff
- Must be local-first, meaning we don't need an auth layer or anything to prevent users from running it locally
- Whiteboards:
  - For every whiteboard, a local directory in a configurable storage location will be maintained named after the id, which will store the excalidraw file and the chat history
  - The main area is an excalidraw board where they can interface with it as normal
  - A chat toggle button exists but is not prominent, and allows the user to open the chat view
  - If the chat view is opened, then it will start a new, *persistent but clearable* conversation with a Gemini model
  - The text box will have a toggle to "include context", which, when clicked, will include whatever is in the current viewport of the Excalidraw board in the model context when the user's prompt is sent
  - A button in the chat interface to start a new conversation, which will clear the current whiteboard context
  - Each whiteboard only has one conversation stored persistently, and thus no conversation history must be maintained for a conversation
  - Whiteboards can be deleted
  - Each whiteboard has an editable title
- Dashboard
  - The first thing the user sees when they log in is a dashboard, with actions, and existing whiteboards
  - They can use this view to navigate to an existing whiteboard, or create a new one
  - They can filter the whiteboards by title


## Technical Requirements
Adhere to these general principles:
- Simplicity in architecture, no tight entanglement of logic
- Separation of concerns, each area of logic should be separately handled

The following tech stack should be used:
- Frontend
  - React: a local from scratch SPA
    - Hooks: utilize hooks where they make sense to be utilized
    - Context: react context is the primary state management solution
  - Mantine: a versatile component library for building UIs
  - Excalidraw: excalidraw can be used as a standalone component, and configured using styling
  - Vite: we are going to use Vite as a development environment and build system
- Backend:
  - Express: a versatile and highly robust API framework
  - Sqlite3: a lightweight, local persistant storage solution
  - Filesystem: for storage of whiteboard directory, including excalidraw file exports, and chat history json file
- Everywhere:
  - Typescript: we are going to use typescript for everything
  - PNPM: we are going to use pnpm as a package manager


No authentication layer is required, only the technical requirements.

## Current Progress
NOTHING! The project is entirely greenfield, and up to your own discretion to build from scratch, in line with project requirements and constraints of course.
