import { Doubt, DoubtConfig, Actor } from "./types";
/**
 * Simple doubt management class that works without external dependencies
 */
export declare class DoubtManager {
    private config;
    private doubts;
    private listeners;
    constructor(config?: DoubtConfig);
    /**
     * Create a new doubt
     */
    createDoubt(about: string, question: string, actorOverride?: Actor): Doubt;
    /**
     * Get all doubts about a specific resource
     */
    getDoubtsAbout(id: string): Doubt[];
    /**
     * Get all doubts
     */
    getAllDoubts(): Doubt[];
    /**
     * Subscribe to doubt changes
     */
    subscribe(listener: (doubts: Doubt[]) => void): () => void;
    private notifyListeners;
}
//# sourceMappingURL=core-simple.d.ts.map