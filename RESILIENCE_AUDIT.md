# Resilience Implementation Note

## Current Codebase Audit

- API boundary: network calls are defined in `src/api/client.ts` and endpoint wrappers in `src/api/applications.ts`. Active screens currently use local mock-backed Zustand stores, but the API layer is production-shaped for backend integration.
- New application flow: `/applications/new` opens the loan details form directly. `/application/new` remains a compatibility redirect.
- Server state: application list/detail reads now use TanStack Query over the current local store source. This keeps mock draft behavior while providing loading, stale/refetch, and retry semantics.
- UI state: dashboard search/filter/modal state remains isolated in `useUIStore`.
- Form state: React Hook Form owns validation/touched state, while `useNewApplicationStore` persists non-sensitive draft values.

## Screen State Coverage

- Dashboard: loading skeleton, retryable error state, filtered empty state, success list.
- Application detail: loading skeleton, retryable error state, success detail view.
- Repayments: loading, retryable error state, empty/no-active-plan state, success repayment view.
- New application: local draft and validation flow with autosave/offline messaging; no remote submission is triggered yet.
- Profile/onboarding/apply tab: local-only screens with no server fetch. Profile and apply retain existing placeholder loading/error branches.

## Important Tradeoffs

- Loan and property draft fields are persisted in AsyncStorage for Expo Go compatibility.
- Full offline mutation replay is not implemented. The documentation proposes an outbox pattern for future backend-connected mode.
