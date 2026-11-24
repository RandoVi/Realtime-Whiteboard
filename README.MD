# Realtime Whiteboard

A collaborative drawing board built by Ago-Laur Luik (frontend) and Rando Viimne (backend) as a portfolio project. Users can create or join a board, draw shapes and strokes, edit objects together, and see remote cursors, selections, previews and laser pointers.

For the codebase map and data flow, see [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md).

## Features

- Shared boards with real-time object edits and presence
- Pen, laser pointer, shapes, arrows, text and sticky notes
- Selection, multi-selection, movement, resizing and rotation
- Zoom, pan, keyboard shortcuts, and local undo/redo

## Requirements

- For a fully local run: **Node.js 22.12 or newer**, npm, and MongoDB listening on port 27017.
- For a Docker run: Docker with the `docker compose` command. The frontend, backend and MongoDB run in containers; a local Node installation is not needed.

The app uses these default addresses: frontend `http://localhost:5173`, API/socket server `http://localhost:3000`, and MongoDB `localhost:27017` when run locally. The client URL and server CORS origin are currently set in [SocketClient.ts](./frontend/src/network/SocketClient.ts), [main.ts](./backend/src/main.ts), and [board.gateway.ts](./backend/src/modules/board/board.gateway.ts), so keep those ports when following these steps.

## Run locally

1. Start MongoDB on `localhost:27017`. If you have Docker but no local MongoDB installation, you can run just the database with `docker compose up -d mongo`.
2. From the repository root, install backend/shared dependencies and build the shared package:

   ```bash
   npm ci
   npm run build --workspace=@whiteboard/common
   ```

3. Start the backend. Set `DATABASE_URL` on this command because the checked-in [backend/.env](./backend/.env) uses the Compose hostname `mongo`, which is not available to a process running directly on your computer:

   ```bash
   DATABASE_URL=mongodb://127.0.0.1:27017/realtime-whiteboard npm run start-dev --workspace=backend
   ```

4. In another terminal, install and start the frontend:

   ```bash
   cd frontend
   npm ci
   npm run dev
   ```

5. Open `http://localhost:5173`. Enter a username and create a board. To try collaboration, copy the board ID and join from a second browser tab or window.

The root [package.json](./package.json) includes the backend and shared package as npm workspaces. The frontend is a separate npm project, so it needs its own `npm ci`.

If a local backend build reports `EACCES` while writing under `backend/dist`, an older Docker run may have left generated files owned by another user. Restore ownership once with `sudo chown -R "$(id -u):$(id -g)" backend/dist`, then retry. The current Compose setup keeps generated backend and shared build output in container volumes to prevent new ownership conflicts.

## Run with Docker

From the repository root:

```bash
docker compose up --build
```

Open `http://localhost:5173`. [docker-compose.yml](./docker-compose.yml) starts MongoDB, the NestJS backend on port 3000, and the Vite frontend on port 5173. It sets the backend's `DATABASE_URL` to the Compose service hostname `mongo`. Source folders are mounted into the containers for development; changes to the frontend and backend are watched. Generated backend/shared build output stays in container volumes. The first frontend start installs its npm dependencies and may take a little longer.

To stop the containers, press Ctrl+C or run `docker compose down` from another terminal. MongoDB data is kept in the `mongo-data` volume between starts. Run `docker compose down --volumes` only when you want to delete that stored board data.

## Checks

From the repository root:

```bash
npm run build --workspace=@whiteboard/common
npm run build --workspace=backend
npm run lint --workspace=backend
```

From `frontend/`:

```bash
npm run build
npm run lint
```

There is no configured root test script. See [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for the main modules and where to start when changing a feature.
