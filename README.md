# Whosthebest

A starter full-stack app for a multi-game stats tracker. The current baseline includes a React + TypeScript frontend, an Express + TypeScript API, and a local MongoDB database. The UI is a starter shell and the API currently exposes a health check; authentication, profiles, game accounts, and game integrations are not implemented yet.

## Tech stack

- React, Vite, TypeScript, and React Router (`apps/web`)
- Node.js, Express, TypeScript, and Mongoose (`apps/api`)
- MongoDB Community running in Docker Compose (`docker-compose.yml`)
- npm workspaces for installing and running both apps from the repository root

## Run locally

### 1. Install prerequisites

Install Node.js 24 LTS or newer (npm is included with Node.js) and Docker Desktop. Follow the steps for your computer, then continue to step 2.

#### macOS

**No Homebrew required:**

1. Install Node.js 24 LTS with the macOS installer from [Node.js downloads](https://nodejs.org/en/download). npm is included.
2. Download [Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/), open the `.dmg`, and drag Docker into Applications.
3. Open Docker from Applications and complete its first-launch prompts. Wait until Docker Desktop reports that it is running.

To install from Terminal, first install Homebrew if needed:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

The installer prints a short command to add Homebrew to your shell. Copy and run that command, then open a new Terminal window. See the [Homebrew installation guide](https://docs.brew.sh/Installation) if needed. Install Node.js 24 and Docker Desktop:

```bash
brew install node@24
echo 'export PATH="$(brew --prefix node@24)/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
brew install --cask docker
open -a Docker
```

Wait for Docker Desktop to start and accept its first-launch prompts. For a graphical install without Homebrew, use the Node.js `.pkg` and Docker Desktop `.dmg` linked above.

#### Windows 10 or 11 (PowerShell)

1. If WSL 2 is not installed, open PowerShell as Administrator, run the following command, and restart Windows if prompted:

   ```powershell
   wsl --install
   ```

   After restarting, open PowerShell and update WSL:

   ```powershell
   wsl --update
   ```

2. Install Node.js LTS and Docker Desktop:

   ```powershell
   winget install --id OpenJS.NodeJS.LTS --exact
   winget install --id Docker.DockerDesktop --exact
   ```

3. Launch Docker Desktop from the Start menu. Accept the first-launch prompts and wait for it to finish starting. [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/)

#### Confirm the installations

Open a new terminal window and run:

```bash
node --version
npm --version
docker --version
docker compose version
```

If Docker reports that it cannot connect to the daemon, start Docker Desktop and wait until it shows that Docker is running.

### 2. Install project dependencies

From the repository root:

```bash
npm install
```

### 3. Configure the API

Copy the example environment file:

```bash
cp apps/api/.env.example apps/api/.env
```

On Windows PowerShell, use:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
```

The defaults connect to the local MongoDB container and run the API on port `4000`. Change them only if those ports are already in use.

### 4. Start MongoDB

```bash
docker compose up -d mongo
```

Wait until the container reports healthy:

```bash
docker compose ps
```

MongoDB is published only on `127.0.0.1:27017`. Its data is stored in the `mongo_data` Docker volume and survives container restarts.

### 5. Start the frontend and API

From the repository root:

```bash
npm run dev
```

This starts both development servers. Open the frontend at <http://localhost:5173>. The API is available at <http://localhost:4000>, and Vite forwards frontend `/api` requests to it.

### 6. Check the local setup

- In the web app, the API status indicator should say **Connected**.
- Open <http://localhost:4000/api/health> or run:

  ```bash
  curl http://localhost:4000/api/health
  ```

  A healthy response looks like:

  ```json
  {"status":"ok","database":"connected"}
  ```

Stop the app servers with `Ctrl+C`. Stop MongoDB while keeping its data with:

```bash
docker compose stop mongo
```

Start it again with `docker compose start mongo`. To remove the container and permanently delete its local database volume, run `docker compose down -v`.

## Useful commands

```bash
npm run dev        # Run the web app and API together
npm run build      # Build both apps
npm run typecheck  # Type-check both apps
docker compose up -d mongo
docker compose logs -f mongo
```

## Project layout

```text
apps/
  api/       Express API and MongoDB connection
  web/       React frontend
docker-compose.yml
```

## MongoDB choice

Docker Compose is a good fit for local development here: everyone can run the same MongoDB version without installing the database on their host machine, and the named volume keeps data between runs. For a deployed staging or production environment, use a managed database such as MongoDB Atlas rather than this local container. MongoDB also describes its Community container as an option for local development, testing, and CI. [Deployment options](https://www.mongodb.com/docs/deployment/)
