# AI Usage

AI assistance was used at several stages of this project, but with deliberate boundaries around architecture decisions and security-sensitive choices. The agent accelerated output; judgment calls on architecture, security posture, layout fidelity, and interaction details remained mine throughout.

## Planning & Scaffolding

AI was used for initial planning and to scaffold the project structure. I defined the application architecture upfront, including folder structure, screen hierarchy, and data flow, before handing scaffolding tasks to the agent. This meant the AI was filling in an already-decided structure, not making structural decisions independently.

## Where I Pushed Back

The agent initially suggested Axios for the API client. I rejected this for two reasons: native `fetch` is sufficient for this workload, and reducing third-party dependencies is a deliberate security posture for a financial application that handles sensitive user data. A recent Axios supply-chain vulnerability reinforced that decision. The final API client is built entirely on native `fetch` with typed error handling, timeout handling, retry logic, auth header injection, token refresh queuing, and sensitive-field log redaction.

Similarly, the agent defaulted to Zustand for all state stores. I redirected this: sensitive data like access and refresh tokens belongs in `expo-secure-store`, which is keychain-backed and encrypted at rest. Zustand was retained for non-sensitive UI state and volatile mock application state, while onboarding and mortgage draft persistence now use SecureStore because they can contain personal or property details. Refresh tokens are not retained in Zustand runtime state.

## Design System & UI Infrastructure

AI was used to build out the design system, skeleton components, loading states, and mock data stores that back the UI views. These tasks were well-suited for AI generation because the rules were clear and the risk of a wrong decision was low.

## Complex Components

For more complex components, including the `AsyncBoundary` wrapper, the activity stepper, application cards, and the application detail view, I provided explicit requirements before generation. I specified component structure, prop contracts, which shared components to use, and how each piece should interact with the design system. The agent implemented against those requirements.

The activity stepper required particular attention because it supports both horizontal and vertical use cases and appears across multiple screens. The generated implementation was reviewed and adjusted to match the intended mortgage workflow presentation.

## UI Corrections

Where generated UI deviated from the intended design, I made corrections manually. Examples included loading-state safe-area behavior, application detail section spacing, card border treatment, activity timeline styling, empty-state behavior, and tab placeholder screens.



## Human Review Focus

The most important review areas were:

- Whether the offline strategy is sufficiently clear for the challenge scope.
- Whether sensitive draft storage tradeoffs are acceptable for an Expo Go implementation.
- Whether the mock application lifecycle states cover enough product behavior without a backend.
- Whether the resilience/security strategy should be hardened further before connecting a live mortgage backend.
- Whether generated UI matched the intended layout and interaction details.

The resilience and security implementation was reviewed and adapted manually to fit the existing Expo Router, TanStack Query, Zustand, React Hook Form, SecureStore, and local draft-storage structure.
