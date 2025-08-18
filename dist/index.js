"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubtsUI = exports.DoubtManager = exports.crm = exports.crminf = void 0;
// Vocabulary and ontology definitions
var vocab_1 = require("./vocab");
Object.defineProperty(exports, "crminf", { enumerable: true, get: function () { return vocab_1.crminf; } });
Object.defineProperty(exports, "crm", { enumerable: true, get: function () { return vocab_1.crm; } });
// Core doubt management (framework-agnostic, no external dependencies)
var core_simple_1 = require("./core-simple");
Object.defineProperty(exports, "DoubtManager", { enumerable: true, get: function () { return core_simple_1.DoubtManager; } });
// Vanilla JavaScript UI (no framework dependencies)
var DoubtsUI_1 = require("./ui/DoubtsUI");
Object.defineProperty(exports, "DoubtsUI", { enumerable: true, get: function () { return DoubtsUI_1.DoubtsUI; } });
// Advanced exports with Solid integration (require external dependencies)
// Uncomment these when @inrupt/solid-client and other dependencies are available:
// export { DoubtManager as DoubtManagerWithSolid } from "./core";
// export { doubtToThings, thingToDoubt } from "./serialization";
// React hooks and providers (require React)
// Uncomment when React is available:
// export { useDoubtContext, DoubtProvider } from "./hooks";
// React components with Material-UI (require @mui/material)
// Uncomment when Material-UI is available:
// export { Doubts, RaiseDoubtDialog } from "./components";
