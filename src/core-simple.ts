import { Doubt, DoubtConfig, Actor } from "./types";

/**
 * Simple doubt management class that works without external dependencies
 */
export class DoubtManager {
  private config: DoubtConfig;
  private doubts: Doubt[] = [];
  private listeners: Array<(doubts: Doubt[]) => void> = [];

  constructor(config: DoubtConfig = {}) {
    this.config = config;
  }

  /**
   * Create a new doubt
   */
  createDoubt(about: string, question: string, actorOverride?: Actor): Doubt {
    const actor = actorOverride || this.config.defaultActor || { name: "unknown" };
    
    // Simple UUID fallback
    const generateId = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    
    const doubt: Doubt = {
      id: generateId(),
      about,
      question: question.trim(),
      making: {
        actor: {
          name: actor.name,
          sameAs: actor.sameAs || [],
        },
      },
    };

    this.doubts.push(doubt);
    this.notifyListeners();
    return doubt;
  }

  /**
   * Get all doubts about a specific resource
   */
  getDoubtsAbout(id: string): Doubt[] {
    return this.doubts.filter((d) => d.about === id);
  }

  /**
   * Get all doubts
   */
  getAllDoubts(): Doubt[] {
    return [...this.doubts];
  }

  /**
   * Subscribe to doubt changes
   */
  subscribe(listener: (doubts: Doubt[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.doubts]));
  }
}