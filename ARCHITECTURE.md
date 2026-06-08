# Architecture

## Overview

The app is organized around a thin route layer, reusable UI/mortgage components, typed data access, and explicit state ownership. Routes under `src/app` should only compose hooks and components. Business/UI behavior lives under `src/components`, `src/hooks`, `src/store`, and `src/api`.

## Data Flow

Dashboard and detail screens read applications through `useApplications` and `useApplication`. These hooks now use TanStack Query over the current mock-backed Zustand store. This preserves local draft behavior while keeping the screen contract close to a server-state implementation.

```mermaid
flowchart TD
  UI["Screens / Components"] --> Hooks["Hooks"]
  Hooks --> Query["TanStack Query"]
  Query --> Stores["Zustand stores"]
  Hooks --> API["Typed API client"]
  Stores --> AsyncStorage["Persisted local storage"]
  API --> Backend["GTMB API"]
```

In mock mode, `useApplicationsStore` is the source of truth so locally saved drafts are reflected immediately in the dashboard. When a backend is connected, the same shape can be hydrated from API responses and reconciled with pending local writes.

## State Ownership

- Server/application state: `useApplicationsStore` for the current mock implementation; API wrappers in `src/api` define the future backend boundary.
- UI state: `useUIStore` owns dashboard search/filter/modal state.
- Draft form state: `useNewApplicationStore` owns persisted field values and `lastSavedAt`.
- Auth state: `useAuthStore` owns access/refresh tokens and writes them to SecureStore.
- Validation state: React Hook Form owns touched/error state, using Zod schemas from `src/lib/schemas`.

## API Client

`src/api/client.ts` centralizes:

- Base URL and API key configuration.
- Bearer token injection.
- Timeout handling.
- GET-only retry on network and 5xx failures with backoff/jitter.
- No blind mutation retry. Mutations must opt into safe behavior using backend-supported idempotency.
- Token refresh queuing to avoid duplicate refresh calls.
- Normalized `ApiError` class instances for callers.
- Development log redaction for sensitive keys.

Endpoint modules should call the typed `api.get/post/put/patch/delete` helpers instead of importing Axios directly.

## Offline Support At Scale

The current app persists drafts and application data locally and shows offline draft-safe messaging. A production offline model would add:

- An `outboxStore` for pending mutations.
- Idempotency keys for draft saves, submissions, withdrawals, and messages.
- Mutation metadata: operation type, payload, created time, retry count, and last error.
- Network listener that replays queued mutations when connectivity returns.
- Conflict handling when server state has changed while offline.
- Optimistic UI with rollback for rejected server writes.
- Server-generated revision/version fields to detect stale updates.

## Idempotency Strategy

Final mortgage submission should generate a stable idempotency key for the submission attempt and pass it as `Idempotency-Key`. The backend should store the key with a payload hash and return the original result for duplicate requests. This allows retry after timeout/network failure without creating duplicate applications.

## Data Integrity

- Input validation is defined with Zod and surfaced through React Hook Form.
- Monetary fields remain strings while the user types, then are parsed into kobo at boundaries.
- Application objects use typed status and mortgage-type unions.
- API errors are normalized so UI components do not branch on raw Axios/server shapes.

## Security Tradeoffs

- Tokens are stored in SecureStore.
- API logs redact common financial/auth sensitive fields.
- Current drafts are persisted with AsyncStorage for Expo Go compatibility. Production should encrypt draft payloads, reduce sensitive fields stored locally, or use native encrypted storage.
- PIN/OTP/card data should never be persisted or logged.
- Access tokens should be short-lived; refresh tokens should be rotated and revocable.

## Sensitive Data Lifecycle

1. User-entered loan and property fields are validated in React Hook Form.
2. Safe logging redacts matching sensitive keys before API logs are emitted.
3. Submission sends payloads to the API over TLS.
4. Successful submission should clear local draft storage.

## Component Boundaries

- `AppHeader` is the single green header component for dashboard and inner screens.
- `ProgressStepper` is shared by the new application flow and mortgage workflow stepper.
- `DropdownField`, `FormField`, `AlertBanner`, `StatusBadge`, and `Button` expose explicit props and carry validation/error presentation consistently.
