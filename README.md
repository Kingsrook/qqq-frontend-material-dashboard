# QQQ Frontend Material Dashboard

A low-code, extensible React + TypeScript dashboard for engineers, built on MUI and the QQQ framework. This project is designed for rapid development of admin panels, data-driven apps, and custom dashboards.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Scripts](#scripts)
- [Code Structure](#code-structure)
- [TypeScript & Linting](#typescript--linting)
- [Proxy/API Setup](#proxyapi-setup)
- [Custom Chrome Profile Script](#custom-chrome-profile-script)
- [Key Components & Utilities](#key-components--utilities)
- [Contributing](#contributing)

---

## Project Overview

This repo is the main frontend for QQQ-based dashboards. It leverages:
- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **MUI (Material UI)** for UI components
- **QQQ Core** for low-code app logic, authentication, and data
- **Custom widgets, forms, and utilities** for rapid app building

Authentication supports Auth0, OAuth2, and anonymous modes. The app is highly modular, with a focus on extensibility and developer productivity.

---

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm (comes with Node.js)

### Install dependencies
```sh
npm install
```

### Start the development server
```sh
npm start
```
- By default, this will **not** open a browser. See [Custom Chrome Profile Script](#custom-chrome-profile-script) for opening Chrome with a specific profile.

### Build for production
```sh
npm run build
```

### Clean and reinstall dependencies
```sh
npm run clean-and-install
```

---

## Development Workflow

- All source code is in `src/`.
- Main entry point: [`src/index.tsx`](src/index.tsx)
- Main app component: [`src/App.tsx`](src/App.tsx)
- Custom QQQ code: [`src/qqq/`](src/qqq/)
- Use the provided npm scripts for common tasks (see below).
- TypeScript is enforced; linting is available via ESLint.
- API requests are proxied to the backend (see [Proxy/API Setup](#proxyapi-setup)).

---

## Scripts

| Script                | Description                                                                                 |
|-----------------------|---------------------------------------------------------------------------------------------|
| `npm start`           | Start dev server (does **not** open a browser by default)                                   |
| `npm run start-browser` | Start dev server and open Chrome with a custom profile (see below)                         |
| `npm run build`       | Build for production                                                                         |
| `npm run test`        | Run tests (Jest)                                                                            |
| `npm run clean`       | Remove `node_modules`, lockfile, and build output                                            |
| `npm run clean-and-install` | Clean and reinstall all dependencies, dedupe, and fix peer deps                        |
| `npm run npm-install` | Install dependencies with legacy peer deps                                                   |
| `npm run export`      | Build and export static files to backend resources directory                                |

---

## Code Structure

- `src/` — Main source code
  - `index.tsx` — App entry point, authentication, and bootstrapping
  - `App.tsx` — Main app logic, routing, and layout
  - `qqq/` — Custom QQQ modules, widgets, forms, utilities, and more
    - `components/` — Custom and reusable UI components
    - `pages/` — Page-level components and routes
    - `utils/` — Utility functions and helpers
    - `models/` — Data models and types
    - `context/` — React context providers
    - `authorization/` — Auth0, OAuth2, and anonymous auth modules
  - `styles/` — Global and override styles (CSS/SCSS)
  - `setupProxy.js` — Dev server proxy config
  - `types/` — Custom TypeScript type definitions

---

## TypeScript & Linting

- TypeScript config: [`tsconfig.json`](tsconfig.json)
  - Strict mode is enabled (except `strictNullChecks`)
  - Custom types in `src/types/`
- Linting: ESLint config in `.eslintrc.json`
- Run `npx eslint .` to check code style

---

## Proxy/API Setup

- [`src/setupProxy.js`](src/setupProxy.js) uses `http-proxy-middleware` to forward API requests to the backend (default port 8000, or set `REACT_APP_PROXY_LOCALHOST_PORT`).
- Common API endpoints (e.g., `/data/*`, `/metaData/*`, `/api*`) are proxied for local development.

---

## Proxy Server Details

The development proxy server is essential for local development, allowing the frontend to communicate with the backend without CORS issues. Here’s how it works and how you can configure it:

### How It Works
- The proxy is configured in [`src/setupProxy.js`](src/setupProxy.js) and is automatically used by Create React App when running `npm start`.
- It uses the [`http-proxy-middleware`](https://github.com/chimurai/http-proxy-middleware) package.
- Requests matching certain patterns (e.g., `/data/*`, `/metaData/*`, `/api*`, etc.) are forwarded to your backend server.
- The default backend target is `http://localhost:8000`.

### Customizing the Backend Port
- To change the backend port, set the environment variable `REACT_APP_PROXY_LOCALHOST_PORT` before starting the dev server:
  ```sh
  REACT_APP_PROXY_LOCALHOST_PORT=8080 npm start
  ```
- The proxy will then forward requests to `http://localhost:8080`.

### What Gets Proxied?
- The following endpoints are proxied by default:
  - `/data/*/export/*`
  - `/download/*`
  - `/metaData/*`
  - `/data/*`
  - `/possibleValues/*`
  - `/possibleValues`
  - `/widget/*`
  - `/serverInfo`
  - `/manageSession`
  - `/processes`
  - `/reports`
  - `/images`
  - `/api*`
  - `/*api`
  - `/qqq/*`
- **OpenID Connect (OIDC) Proxy for Local Auth:**
  - **All requests under `/auth-oidc`** are proxied to `https://auth.kof22.com/application/o/kof22-website-admin-local-dev`, preserving the subpath.
  - This allows your frontend to access any OIDC endpoint (e.g., discovery, JWKS, token, userinfo, etc.) locally without CORS errors. For example, in your code, use:
    ```js
    fetch("/auth-oidc/.well-known/openid-configuration")
    fetch("/auth-oidc/token", { method: "POST", ... })
    ```
    instead of the full remote URLs.
- You can add or remove endpoints by editing `src/setupProxy.js`.

### Production Note
- The proxy is only active during development (`npm start`).
- In production, your frontend and backend must be served from the same origin, or you must handle CORS on the backend.

---

## Custom Chrome Profile Script

To open Chrome with a specific user profile (useful for dev/testing):

1. Use the provided script:
   - [`scripts/open-chrome-profile.sh`](scripts/open-chrome-profile.sh)
   - This script launches Google Chrome with your default profile directory.
2. Run:
   ```sh
   npm run start-browser
   ```
   This will start the dev server and open Chrome with your profile.

---

## Key Components & Utilities

- **Widgets:**
  - Charts: Bar, Line, Pie (`src/qqq/components/widgets/charts/`)
  - Tables: DataTable, TableCard, TableWidget (`src/qqq/components/widgets/tables/`)
  - Statistics: MiniStatisticsCard, MultiStatisticsCard (`src/qqq/components/widgets/statistics/`)
  - Misc: PivotTable, USMapWidget, ScriptViewer, StepperCard, etc.
- **Forms:**
  - DynamicForm, EntityForm, FileInputField, BooleanFieldSwitch (`src/qqq/components/forms/`)
- **Utilities:**
  - DataGridUtils, GoogleAnalyticsUtils, HtmlUtils, DeveloperModeUtils (`src/qqq/utils/`)
- **Authentication:**
  - Auth0, OAuth2, and anonymous modules in `src/qqq/authorization/`
- **Context:**
  - MaterialUIControllerProvider, QContext (`src/qqq/context/`)

---

## Contributing

- Follow the code style enforced by ESLint and TypeScript.
- Add new widgets/components under `src/qqq/components/`.
- Add utility functions under `src/qqq/utils/`.
- Document new features and update this README as needed.
- For questions, contact the Kingsrook team or open an issue.

---

## License

This project is licensed under the GNU Affero General Public License v3.0. See [LICENSE](https://www.gnu.org/licenses/agpl-3.0.html) for details.


