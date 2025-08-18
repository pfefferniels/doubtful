import { Doubt, DoubtConfig, Actor } from "./types";
/**
 * Core doubt management class that handles persistence and retrieval
 */
export declare class DoubtManager {
    private config;
    private doubts;
    private listeners;
    private initialized;
    constructor(config?: DoubtConfig);
    private initialize;
    /**
     * Create a new doubt
     */
    createDoubt(about: string, question: string, actorOverride?: Actor): Promise<Doubt>;
    /**
     * Get all doubts about a specific resource
     */
    getDoubtsAbout(id: string): Doubt[];
    /**
     * Get all doubts
     */
    getAllDoubts(): Doubt[];
    /**
     * Load doubts from a Solid Pod dataset
     */
    loadFromSolid(datasetUrl: string): Promise<void>;
    /**
     * Save doubts to a Solid Pod dataset
     */
    saveToSolid(datasetUrl: string): Promise<void>;
    /**
     * Subscribe to doubt changes
     */
    subscribe(listener: (doubts: Doubt[]) => void): () => void;
    private notifyListeners;
}
//# sourceMappingURL=core.d.ts.map