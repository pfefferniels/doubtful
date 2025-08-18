import { doubtToThings, thingToDoubt } from "./serialization";
// Optional dependencies with dynamic imports
let uuidv4;
let solidClient;
let solidFetch;
// Initialize UUID function
async function initUuid() {
    try {
        const uuid = await import("uuid");
        return uuid.v4;
    }
    catch {
        // Fallback UUID implementation
        return () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
// Initialize Solid dependencies
async function initSolid() {
    try {
        const solid = await import("@inrupt/solid-client");
        const solidAuth = await import("@inrupt/solid-client-authn-browser");
        return {
            solidClient: solid,
            solidFetch: solidAuth.fetch,
        };
    }
    catch {
        // Mock implementations when Solid is not available
        return {
            solidClient: {
                createSolidDataset: () => ({}),
                getSolidDataset: () => Promise.resolve({}),
                getThingAll: () => [],
                saveSolidDatasetAt: () => Promise.resolve(),
                setThing: (ds, thing) => ds,
            },
            solidFetch: fetch,
        };
    }
}
/**
 * Core doubt management class that handles persistence and retrieval
 */
export class DoubtManager {
    constructor(config = {}) {
        this.doubts = [];
        this.listeners = [];
        this.initialized = false;
        this.config = config;
    }
    async initialize() {
        if (this.initialized)
            return;
        uuidv4 = await initUuid();
        const solid = await initSolid();
        solidClient = solid.solidClient;
        solidFetch = solid.solidFetch;
        this.initialized = true;
    }
    /**
     * Create a new doubt
     */
    async createDoubt(about, question, actorOverride) {
        await this.initialize();
        const actor = actorOverride || this.config.defaultActor || { name: "unknown" };
        const doubt = {
            id: uuidv4(),
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
    getDoubtsAbout(id) {
        return this.doubts.filter((d) => d.about === id);
    }
    /**
     * Get all doubts
     */
    getAllDoubts() {
        return [...this.doubts];
    }
    /**
     * Load doubts from a Solid Pod dataset
     */
    async loadFromSolid(datasetUrl) {
        await this.initialize();
        try {
            let dataset;
            try {
                dataset = await solidClient.getSolidDataset(datasetUrl, { fetch: solidFetch });
            }
            catch (e) {
                // If 404 (not found) -> start a fresh dataset
                if (e.statusCode === 404) {
                    dataset = solidClient.createSolidDataset();
                    await solidClient.saveSolidDatasetAt(datasetUrl, dataset, { fetch: solidFetch });
                }
                else {
                    throw e;
                }
            }
            const things = solidClient.getThingAll(dataset);
            const parsed = [];
            for (const t of things) {
                const doubt = await thingToDoubt(t, dataset, this.config);
                if (doubt) {
                    parsed.push(doubt);
                }
            }
            this.doubts = parsed;
            this.notifyListeners();
        }
        catch (error) {
            console.error("Failed to load doubts from Pod", error);
            throw error;
        }
    }
    /**
     * Save doubts to a Solid Pod dataset
     */
    async saveToSolid(datasetUrl) {
        await this.initialize();
        try {
            let dataset = await solidClient.getSolidDataset(datasetUrl, { fetch: solidFetch });
            const allThings = [];
            for (const doubt of this.doubts) {
                const things = await doubtToThings(doubt, this.config);
                allThings.push(...things);
            }
            for (const thing of allThings) {
                dataset = solidClient.setThing(dataset, thing);
            }
            await solidClient.saveSolidDatasetAt(datasetUrl, dataset, { fetch: solidFetch });
        }
        catch (error) {
            console.error("Failed to save doubts to Pod", error);
            throw error;
        }
    }
    /**
     * Subscribe to doubt changes
     */
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }
    notifyListeners() {
        this.listeners.forEach(listener => listener([...this.doubts]));
    }
}
//# sourceMappingURL=core.js.map