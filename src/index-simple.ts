// Core types and interfaces (no external dependencies)
export type { Doubt, DoubtConfig, DoubtContextType, Actor, DoubtMaking } from "./types";

// Vocabulary and ontology definitions
export { crminf, crm } from "./vocab";

// Core doubt management (framework-agnostic, no external dependencies)
export { DoubtManager } from "./core-simple";

// Vanilla JavaScript UI (no framework dependencies)
export { DoubtsUI } from "./ui/DoubtsUI";

// Advanced exports (require external dependencies)
// Note: These will fail if @inrupt/solid-client is not installed
// export { DoubtManager as DoubtManagerAdvanced } from "./core";
// export { doubtToThings, thingToDoubt } from "./serialization";

// React hooks and providers (require React and possibly other dependencies)
// export { useDoubtContext, DoubtProvider } from "./hooks";

// React components with Material-UI (require @mui/material)
// export { Doubts, RaiseDoubtDialog } from "./components";