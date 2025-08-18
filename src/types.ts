// Optional React types - only used when React components are used
export interface ReactNode {
  // This is a placeholder for React.ReactNode
}

/**
 * Actor information for tracking who creates doubts
 */
export interface Actor {
  name: string;
  sameAs?: string[];
}

/**
 * Represents the creation metadata for a doubt
 */
export interface DoubtMaking {
  actor: Actor;
  // additional metadata can go here later
}

/**
 * Represents a doubt or objection about a specific resource or claim.
 * Follows CIDOC-CRM extension CRMinf for argumentation and belief modeling.
 */
export interface Doubt {
  /** Unique identifier for this doubt */
  id: string;
  
  /** The URL or identifier of the resource this doubt is about */
  about: string;
  
  /** The question or objection being raised */
  question: string;
  
  /** Information about who is making this doubt */
  making: DoubtMaking;
}

/**
 * Configuration options for the doubt management system
 */
export interface DoubtConfig {
  /** Base URL for encoding doubt subjects (default: "https://encoded-ghosts.org/") */
  baseUrl?: string;
  
  /** Default actor information for creating doubts */
  defaultActor?: Actor;
}

/**
 * Context type for React doubt management
 */
export interface DoubtContextType {
  raiseDoubt: (about: string) => void;
  getDoubtsAbout: (id: string) => Doubt[];
  all: Doubt[];
  isSyncing: boolean;
  syncError?: string;
}