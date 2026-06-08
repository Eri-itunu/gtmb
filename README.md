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
- `src/store`: persisted Zustand stores for non-sensitive UI/onboarding/application draft state, plus an auth store that routes tokens through SecureStore.
- `src/mocks`: mock application data used while no backend is connected.

## State Management

- React Query was originally used for API-backed reads, while the current mock mode reads from `useApplicationsStore` so newly saved drafts immediately appear on the dashboard.
- Zustand is used for non-sensitive UI state, onboarding state, persisted application data, and the new application draft.
- Access and refresh tokens are routed through `expo-secure-store`, not ordinary local storage.
- React Hook Form owns field validation state on the new application screen.
- Zod owns validation rules and error messages.

## Tradeoffs

- The mock application list is persisted locally so draft creation can be demonstrated without a backend.
- Draft data is stored with AsyncStorage for Expo Go compatibility. Current draft fields are limited to loan and property details.
- The API client is production-shaped, but mock fallback is still used because the challenge does not provide a live backend.

## Resilience Strategy

- Reads use TanStack Query for loading, stale/refetch, and retry behavior, while the current data source remains the local mock-backed application store.
- The API client applies a 15 second timeout and normalizes failures into `ApiError`.
- GET requests retry up to two times for network and 5xx failures.
- Mutations are not blindly retried. Final mortgage submission supports an `Idempotency-Key` header so a backend can safely deduplicate retries.
- Validation errors and 401/403 authorization errors are not retried.
- Offline mode is detected through NetInfo and surfaces a clear draft-safe message.

## Draft Persistence

- Non-sensitive mortgage draft values are persisted with AsyncStorage so Expo Go can run without a custom native build.
- Failed network/API work does not clear local form state.
- Successful final submission should clear draft data; the helper path is prepared, but live backend submission is not yet wired into the UI.

## Sensitive Data Handling

- Tokens are stored in SecureStore.
- `redactSensitiveData` and `safeLog` prevent sensitive fields from appearing in development logs.
- API error details are redacted before being exposed to UI code.


## What I Would Change With More Time

- Add an offline mutation outbox with idempotency keys, retry metadata, conflict handling, and background replay.
- Add tests for API error normalization, form validation, draft persistence, and application list updates.
- Add secure local encryption for sensitive draft fields and stricter redaction coverage.


