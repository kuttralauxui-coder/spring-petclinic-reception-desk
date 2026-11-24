# Spring PetClinic Reception Desk

A React and TypeScript frontend for the Spring PetClinic REST backend. Reception staff can find clients by owner name, phone number, or pet name, register and edit owners and pets, and record visits alongside a pet’s visit history.

## Run locally

The frontend requires Node.js 22.12 or later in the 22 series, Node.js 24, or Node.js 26 and later. The supported range is in [`package.json`](package.json). For the backend, use the JDK required by your Spring PetClinic REST checkout.

Start the backend first. If both repositories are sibling directories, run this in PowerShell from the frontend folder:

```powershell
Set-Location ../spring-petclinic-rest
.\mvnw.cmd spring-boot:run
```

In a second terminal, from the frontend folder:

```powershell
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. The development proxy forwards `/petclinic-api/*` to `http://localhost:9966/petclinic/api/*`. To check the backend directly, open [the owners endpoint](http://localhost:9966/petclinic/api/owners) and [the pet types endpoint](http://localhost:9966/petclinic/api/pettypes).

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/petclinic-api` | Browser-facing API prefix. An absolute URL must include the backend’s API path, for example `https://api.example.com/petclinic/api`. |

Leave the default in place for the local proxy. To override it during development, copy [`.env.example`](.env.example) to `.env.local` and restart Vite after editing it. For deployed builds, set the variable before running `npm run build`. Values exposed through `VITE_*` are public and must contain no credentials or secrets. [Vite environment variables](https://v7.vite.dev/guide/env-and-mode)

## Architecture

| Responsibility | Where to start |
| --- | --- |
| App wiring and recovery | [AppProviders](src/app/AppProviders.tsx) supplies the Redux store. [AppErrorBoundary](src/app/AppErrorBoundary.tsx) offers a reload if rendering fails. |
| Container and workflow | [ReceptionDeskPage](src/pages/ReceptionDeskPage.tsx) calls [useReceptionDesk](src/hooks/useReceptionDesk.ts), which coordinates loading, selection, mutations, and feedback. |
| Presenter and slots | [ReceptionDeskPresenter](src/components/reception/ReceptionDeskPresenter.tsx) composes the directory, owner workspace, and pet workspace through named slots in [ReceptionDeskTemplate](src/templates/ReceptionDeskTemplate.tsx). |
| Components and forms | [Reception components](src/components/reception) compose the shared UI and [form organisms](src/components/organisms). React Hook Form handles validation and submission state. The shared [Button](src/components/atoms/button.tsx) supports Radix Slot through `asChild`. |
| HTTP | [petClinicApi](src/services/petClinicApi.ts) provides RTK Query infrastructure. [axiosBaseQuery](src/services/axiosBaseQuery.ts) configures Axios, forwards the request’s abort signal, and normalizes responses and errors. |
| Search and rendering | [useOwnerDirectory](src/hooks/useOwnerDirectory.ts) builds searchable fields when owner data changes. The workflow defers filtering during typing, and memoized rows can skip unchanged renders. Owner details, the pet chart, and intake forms load in separate chunks as needed. |

On startup, the workflow loads owners and pet types in parallel. Search then filters the loaded directory in the browser. A valid form dispatches a typed endpoint through RTK Query and Axios. The workflow applies successful writes to the displayed records and preserves other pets and visits.

## API contract

Paths below are relative to `VITE_API_BASE_URL`.

| Operation | Method and path | Service |
| --- | --- | --- |
| Load owners | `GET /owners` | [ownersApi](src/services/ownersApi.ts) |
| Create owner | `POST /owners` | [ownersApi](src/services/ownersApi.ts) |
| Edit owner | `PUT /owners/{ownerId}` | [ownersApi](src/services/ownersApi.ts) |
| Load pet types | `GET /pettypes` | [petsApi](src/services/petsApi.ts) |
| Add pet | `POST /owners/{ownerId}/pets` | [petsApi](src/services/petsApi.ts) |
| Edit pet | `PUT /owners/{ownerId}/pets/{petId}` | [petsApi](src/services/petsApi.ts) |
| Register visit | `POST /owners/{ownerId}/pets/{petId}/visits` | [visitsApi](src/services/visitsApi.ts) |

- The owner response supplies nested pets and visits for the directory and visit history. Pet types come from the backend and populate the species dropdown.
- Creates use the ID returned by the backend. Updates support `204 No Content`. The owner list also accepts the PetClinic v1 bodyless `404` response as an empty directory.
- Requests time out after 15 seconds. A startup failure offers a connection retry. When a visit save fails, the notes remain available. After a write timeout or connection failure, check whether the backend saved the change before submitting again.

## Verification

Run these checks before releasing:

```sh
npm ci
npm run typecheck
npm test
npm run build
npm audit
```

`npm run test:watch` runs the test suite in watch mode. Automated coverage includes directory search, form validation, startup timeout and retry, empty directories, bodyless updates, and visit draft recovery. The [page tests](src/pages/ReceptionDeskPage.test.tsx) use a simulated Axios transport. They complement browser checks against Spring Boot.

Use `npm run preview` to inspect the production build locally. With a disposable backend or staging environment, verify that both startup requests succeed, then create and edit an owner and a pet, register a visit, and reload the page to check persistence.

## Production deployment

1. Build the frontend and deploy the contents of `dist/` to an HTTPS static host or reverse proxy. Use Vite preview for local verification only. [Vite static deployment guide](https://v7.vite.dev/guide/static-deploy)
2. Prefer a same-origin route that forwards `/petclinic-api/*` to the Spring backend’s `/petclinic/api/*`. Keep the HTTP method, request body, and response status intact. If the frontend uses a separate API origin, set `VITE_API_BASE_URL` at build time and configure backend CORS for the deployed frontend origin.
3. Revalidate `index.html` and apply long-lived immutable caching to hashed files in `/assets/`. Keep prior hashed assets available during rollout so open sessions can still load their deferred chunks. Keep API responses out of shared caches.
4. Verify access controls, durable storage, and backups in the target environment before handling real clinic records. The supplied backend’s local profile uses in-memory H2 with authentication disabled. This frontend has no sign-in flow, so the deployment must enforce authorization through the backend or its gateway.
5. Smoke-test the deployed URL using test records. Confirm that static assets load, unauthorized API requests are rejected, and the owner, pet, and visit workflows persist successfully.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Connection notice or timeout on startup | Confirm Spring Boot is running and check `/petclinic/api/owners` and `/petclinic/api/pettypes` directly. |
| An API request returns HTML | Check the API prefix and proxy rewrite. A static-site fallback may be serving `index.html` for an API request. |
| The browser blocks a cross-origin request | Check the configured API origin and backend CORS policy, or route requests through a same-origin proxy. |
| A save returns `400` or `422` | Compare the request fields in the browser Network tab with the backend’s API schema. |
| An older tab fails to load an intake form after deployment | Reload the tab and review whether the previous build’s hashed assets are still available. |
