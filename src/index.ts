// Core types and interfaces
export type { Doubt, DoubtConfig, DoubtContextType } from "./types";

// Vocabulary and ontology definitions
export { crminf, crm } from "./vocab";

// Core doubt management (framework-agnostic)
export { DoubtManager } from "./core";

// RDF serialization utilities
export { doubtToThings, thingToDoubt } from "./serialization";

// React hooks and providers
export { useDoubtContext, DoubtProvider } from "./hooks";

// React components (optional, requires @mui/material)
export { Doubts, RaiseDoubtDialog } from "./components";