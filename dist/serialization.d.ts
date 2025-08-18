import { Doubt, DoubtConfig } from "./types";
export interface ThingLocal {
}
export interface Thing {
}
export interface SolidDataset {
}
/**
 * Convert a Doubt to RDF Things (Argumentation and Belief)
 */
export declare function doubtToThings(doubt: Doubt, config?: DoubtConfig): Promise<ThingLocal[]>;
/**
 * Parse a Doubt from a crminf:Argumentation Thing.
 * If a dataset is provided, we follow crminf:concludedThat to the companion
 * crminf:Belief to recover the original `about`.
 */
export declare function thingToDoubt(thing: Thing, dataset: SolidDataset, config?: DoubtConfig): Promise<Doubt | null>;
//# sourceMappingURL=serialization.d.ts.map