# GlobalTrust Mortgage Bank - Mortgage Workflow

Expo/React Native implementation of the GTMB mortgage lifecycle challenge.

## Run Locally

```bash
npm install
npx expo start
```

The app is built with Expo Router and should run in Expo Go. No custom native build is required for the implemented feature set.

## What Is Included

- Applications dashboard with search, filter chips, contextual application cards, and a new-application FAB.
- New application form with persisted draft state, dropdowns, Zod validation via React Hook Form, and repayment estimation.
- Application detail states for draft, under review, approved/active, and rejected applications.
- Native `fetch` API client abstraction with request timeout, normalized errors, retry policy, auth header injection, token refresh queuing, and sensitive-field log redaction.
- Separate server/application data, UI state, onboarding/auth state, and local draft state.
- Reusable design-system components including `AppHeader`, `StatusBadge`, `ProgressStepper`, `AlertBanner`, `DropdownField`, `FormField`, and `Button`.

## Structure

- `src/app`: Expo Router routes only.
- `src/api`: API client, endpoint wrappers, and API/domain types.
- `src/components`: reusable UI and mortgage workflow components.
- `src/design-system`: colors, spacing, typography, radius, and shadow tokens.
- `src/hooks`: data access and screen-facing hooks.
- `src/store`: volatile UI/application stores, SecureStore-backed onboarding and draft stores, plus an auth store that routes tokens through SecureStore.
- `src/mocks`: mock application data used while no backend is connected.

## State Management

- React Query was originally used for API-backed reads, while the current mock mode reads from `useApplicationsStore` so newly saved drafts immediately appear on the dashboard.
- Zustand is used for non-sensitive UI state and volatile mock application data.
- Onboarding and mortgage draft persistence use `expo-secure-store` because they can contain personal/property details.
- Access and refresh tokens are written to `expo-secure-store`; refresh tokens are not retained in Zustand runtime state.
- React Hook Form owns field validation state on the new application screen.
- Zod owns validation rules and error messages.

## Tradeoffs

- The mock application list is kept in memory so personal mortgage data is not persisted in unencrypted local storage.
- Draft data is stored with SecureStore because current draft fields include property details.
- The API client is production-shaped, but mock fallback is still used because the challenge does not provide a live backend.
- Retry handling is split deliberately: transport-level GET retries for network and 5xx failures live in the native `fetch` API client, while TanStack Query is still used for query lifecycle behavior such as caching, stale/refetch handling, loading states, and screen-level retry triggers. TanStack Query could own more retry behavior in a backend-connected version, but centralizing HTTP retry rules in the API client keeps mutation safety and idempotency decisions closer to the request layer.

## Resilience Strategy

- Reads use TanStack Query for loading, stale/refetch, cache lifecycle, and screen-level retry behavior, while the current data source remains the local mock-backed application store.
- The API client applies a 15 second timeout and normalizes failures into `ApiError`.
- GET requests retry up to two times for network and 5xx failures.
- Mutations are not blindly retried. Final mortgage submission supports an `Idempotency-Key` header so a backend can safely deduplicate retries.
- Validation errors and 401/403 authorization errors are not retried.
- Offline mode is detected through NetInfo and surfaces a clear draft-safe message.

## Draft Persistence

- Mortgage draft values are persisted with SecureStore because property details are personal data.
- Failed network/API work does not clear local form state.
- Successful final submission should clear draft data; the helper path is prepared, but live backend submission is not yet wired into the UI.

## Sensitive Data Handling

- Tokens are stored in SecureStore, and refresh tokens are read from SecureStore only when needed for token refresh.
- `redactSensitiveData` and `safeLog` prevent sensitive fields from appearing in development logs.
- API error details are redacted before being exposed to UI code.
- New application inputs are normalized before local persistence and draft creation. Dropdown fields use allowlisted values, monetary input accepts only digits/commas, and property address input strips unsafe control/symbol characters while rejecting common script and SQL-injection payload patterns.
- Client-side sanitization is defense-in-depth only. A production backend must still use parameterized queries, output encoding, request validation, and server-side authorization for SQL injection and XSS prevention.


## What I Would Change With More Time

- Add an offline mutation outbox with idempotency keys, retry metadata, conflict handling, and background replay.
- Add tests for API error normalization, form validation, draft persistence, and application list updates.
- Add secure local encryption for sensitive draft fields and stricter redaction coverage.
- Add stronger security controls such as screenshot blocking, app-switcher screen masking, and stricter guarantees that sensitive data is never stored in Zustand or other client-side stores.
