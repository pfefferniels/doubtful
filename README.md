# Doubtful

A TypeScript library for capturing, sharing, and provenancing doubts/objections in digital humanities projects, GLAM institutions, and knowledge management systems.

## Overview

Doubtful enables structured annotation of claims with "I'm not convinced because..." statements, supporting interpretations, debates, and evolving belief states over evidence. It follows CIDOC-CRM extension CRMinf for modeling arguments and beliefs.

## Features

- **Framework-agnostic**: Core functionality works without any UI framework
- **TypeScript support**: Full type safety and IntelliSense
- **Modular design**: Use only what you need
- **CIDOC-CRM compliant**: Follows semantic web standards for cultural heritage
- **Optional Solid integration**: Persist doubts to Solid Pods (when dependencies available)
- **Multiple UI options**: Vanilla JS, React components, or build your own

## Installation

```bash
npm install doubtful
```

## Quick Start

### Basic Usage (No Dependencies)

```typescript
import { DoubtManager, DoubtsUI } from 'doubtful';

// Create a doubt manager
const manager = new DoubtManager({
  defaultActor: { name: "Dr. Smith", sameAs: ["https://orcid.org/0000-0000-0000-0000"] }
});

// Create a doubt about a claim
const doubt = manager.createDoubt(
  "medieval-manuscript-dating", 
  "How can we be certain this manuscript is from the 12th century without carbon dating?"
);

// Get all doubts about a specific claim
const doubts = manager.getDoubtsAbout("medieval-manuscript-dating");

// Add UI to any HTML element
const container = document.getElementById('doubt-container');
const ui = new DoubtsUI(container, "medieval-manuscript-dating", {
  defaultActor: { name: "Researcher" }
});
```

### HTML Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>Historical Claims with Doubts</title>
</head>
<body>
    <div class="claim">
        <p>"This painting was created by Vermeer in 1665."</p>
        <div id="vermeer-doubts"></div>
    </div>

    <script type="module">
        import { DoubtsUI } from './dist/index.js';
        
        new DoubtsUI(
            document.getElementById('vermeer-doubts'),
            'vermeer-painting-1665'
        );
    </script>
</body>
</html>
```

## API Reference

### Core Types

```typescript
interface Doubt {
  id: string;
  about: string;  // The resource/claim being doubted
  question: string;  // The doubt expressed as a question
  making: {
    actor: {
      name: string;
      sameAs?: string[];  // URIs identifying the actor
    };
  };
}

interface DoubtConfig {
  baseUrl?: string;  // Base URL for encoding subjects
  defaultActor?: Actor;  // Default actor for creating doubts
}
```

### DoubtManager

```typescript
class DoubtManager {
  constructor(config?: DoubtConfig);
  
  createDoubt(about: string, question: string, actor?: Actor): Doubt;
  getDoubtsAbout(id: string): Doubt[];
  getAllDoubts(): Doubt[];
  subscribe(listener: (doubts: Doubt[]) => void): () => void;
}
```

### DoubtsUI

```typescript
class DoubtsUI {
  constructor(
    container: HTMLElement,
    about: string,
    config?: DoubtConfig,
    onDoubtAdded?: (doubt: Doubt) => void
  );
  
  getManager(): DoubtManager;
  destroy(): void;
}
```

## Use Cases

### Digital Humanities Research

```typescript
// Annotating uncertain historical claims
const manuscriptManager = new DoubtManager({
  defaultActor: { name: "Prof. Medieval Studies" }
});

manuscriptManager.createDoubt(
  "charter-authenticity-1204",
  "The paleographic analysis suggests 13th century features, not 12th century as claimed"
);
```

### GLAM Collections

```typescript
// Museum curators questioning attributions
const artworkManager = new DoubtManager({
  defaultActor: { name: "Chief Curator", sameAs: ["https://museum.org/staff/curator"] }
});

artworkManager.createDoubt(
  "painting-attribution-rembrandt",
  "Technical analysis shows pigments not available until after Rembrandt's death"
);
```

### Collaborative Fact-Checking

```typescript
// OSINT teams tracking evolving evidence
const investigationManager = new DoubtManager({
  baseUrl: "https://investigation.org/claims/",
  defaultActor: { name: "Fact Checker Team" }
});

investigationManager.createDoubt(
  "satellite-image-date",
  "Metadata suggests image was taken on different date than reported"
);
```

## Semantic Web Integration

Doubtful follows CIDOC-CRM extension CRMinf for semantic interoperability:

- `crminf:Argumentation` - Models the doubt/objection
- `crminf:Belief` - Models the belief state about the claim
- Standard vocabularies for cultural heritage and research data

## Advanced Features

### Solid Pod Integration

When `@inrupt/solid-client` is available, enable persistent storage:

```typescript
// Advanced usage with Solid Pods (requires additional dependencies)
// import { DoubtManagerWithSolid } from 'doubtful/advanced';
```

### React Components

When React and Material-UI are available:

```typescript
// import { DoubtProvider, Doubts } from 'doubtful/react';
```

## Development

```bash
# Clone and install
git clone https://github.com/pfefferniels/doubtful.git
cd doubtful
npm install

# Build library
npm run build

# Run demo
open demo.html
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Based on CIDOC-CRM extension CRMinf for argumentation modeling
- Inspired by digital humanities needs for uncertainty representation
- Built for GLAM and open knowledge communities