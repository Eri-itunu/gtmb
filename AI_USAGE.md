# AI Usage

AI assistance was used to accelerate implementation, code review, and documentation for this challenge.

## Where AI Was Used

- Translating the supplied mockups into Expo/React Native screen structure.
- Refactoring the header into a shared `AppHeader` component.
- Building the new application form with persisted Zustand state and Zod validation.
- Creating the dropdown field and skeleton loading states.
- Reviewing the codebase against the assessment rubric.
- Drafting README and architecture documentation.

## What AI Got Wrong

- It initially focused too much on visual implementation and not enough on the required written deliverables.
- It first created a route at `/application/new`; the assessment asked for `/applications/new`.
- Some early loading states used generic spinners instead of skeletons matching the UI.
- The new application flow initially behaved like one screen rather than a clearer 5-step mortgage flow.
- A few lint issues were introduced around stale imports and React ref usage before being corrected.

## What Was Changed

- Added `README.md`, `ARCHITECTURE.md`, and this `AI_USAGE.md`.
- Fixed global TypeScript and lint checks.
- Moved the new application route to `/applications/new` with a compatibility redirect from `/application/new`.
- Added persisted stores for applications and the new application draft.
- Added React Hook Form + Zod validation to the new application form.
- Documented offline support and security tradeoffs explicitly.

## Human Review Focus

The most important review areas are:

- Whether the offline strategy is sufficiently clear for the challenge scope.
- Whether sensitive draft storage tradeoffs are acceptable for an Expo Go implementation.
- Whether the mock application lifecycle states cover enough product behavior without a backend.
