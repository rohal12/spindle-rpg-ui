# Dev Container

Spindle Starter includes a [Dev Container](https://containers.dev/) configuration, so you can get a fully working development environment with zero local setup. This works with **GitHub Codespaces**, **VS Code Dev Containers**, or any editor that supports the devcontainer spec.

## What You Get

The Dev Container provides:

- **Node.js 22** pre-installed
- **Dependencies installed** automatically on creation (`npm install`)
- **Port 4321 forwarded** — the dev server opens in your browser automatically
- **VS Code extensions** — ESLint and Prettier pre-configured

## Using GitHub Codespaces

The fastest way to get started — no local installation needed at all.

1. Go to the [spindle-starter repository](https://github.com/rohal12/spindle-starter)
2. Click the green **Code** button
3. Switch to the **Codespaces** tab
4. Click **Create codespace on main**

GitHub will build the container, install dependencies, and open VS Code in your browser. Once it's ready:

```sh
npm start
```

The dev server starts and Codespaces automatically opens it in a new browser tab.

::: tip
You can also create a codespace from a template. After clicking "Use this template" on GitHub, select "Open in a codespace" instead of creating a repository first.
:::

## Using VS Code Locally

If you prefer working locally but want the containerized environment:

### Prerequisites

- [Docker](https://www.docker.com/get-started/) installed and running
- [VS Code](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Steps

1. Clone the repository:
   ```sh
   npx degit rohal12/spindle-starter my-story
   cd my-story
   ```

2. Open the folder in VS Code:
   ```sh
   code .
   ```

3. VS Code will detect the `.devcontainer/` folder and show a notification: **"Reopen in Container"** — click it. Or use the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and select **Dev Containers: Reopen in Container**.

4. Wait for the container to build and dependencies to install, then:
   ```sh
   npm start
   ```

The dev server starts on port 4321, which is automatically forwarded to your local machine.

## Configuration

The Dev Container is configured in `.devcontainer/devcontainer.json`:

| Setting | Value | Purpose |
|---------|-------|---------|
| `image` | `mcr.microsoft.com/devcontainers/javascript-node:22` | Node.js 22 base image |
| `postCreateCommand` | `npm install` | Installs dependencies when the container is created |
| `forwardPorts` | `[4321]` | Forwards the dev server port |
| `extensions` | ESLint, Prettier | Pre-installs useful VS Code extensions |

You can customize this file to add more extensions, environment variables, or other tools you need.
