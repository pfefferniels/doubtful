import { crminf, crm } from "./vocab";
// Mock implementations when Solid client is not available
const mockSolidClient = {
    buildThing: (thing) => ({
        addUrl: () => mockSolidClient.buildThing(thing),
        addStringNoLocale: () => mockSolidClient.buildThing(thing),
        addDate: () => mockSolidClient.buildThing(thing),
        build: () => ({}),
    }),
    createThing: (options) => ({}),
    getStringNoLocale: () => null,
    getUrl: () => null,
    asUrl: () => "",
    getThing: () => null,
};
// Initialize dependencies dynamically
let solidClient = mockSolidClient;
let RDF = { type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" };
// Try to initialize Solid client
async function initSolidClient() {
    try {
        solidClient = await import("@inrupt/solid-client");
        const vocabRdf = await import("@inrupt/vocab-common-rdf");
        RDF = vocabRdf.RDF;
        return true;
    }
    catch {
        return false;
    }
}
const DEFAULT_BASE_URL = "https://encoded-ghosts.org/";
/**
 * Convert a Doubt to RDF Things (Argumentation and Belief)
 */
export async function doubtToThings(doubt, config = {}) {
    await initSolidClient();
    const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    const belief = solidClient.buildThing(solidClient.createThing({ name: doubt.id + "-belief" }))
        .addUrl(RDF.type, crminf.Belief)
        .addUrl(crminf.that, `${baseUrl}${doubt.about}`)
        .addStringNoLocale(crminf.holdsToBe, "doubtful")
        .addDate(crm.hasTimeSpan, new Date())
        .build();
    const argumentation = solidClient.buildThing(solidClient.createThing({ name: doubt.id }))
        .addUrl(RDF.type, crminf.Argumentation)
        .addStringNoLocale(crm.hasNote, doubt.question)
        .addUrl(crminf.concludedThat, belief)
        .addStringNoLocale(crm.carriedOutBy, doubt.making.actor?.name || 'unknown')
        .build();
    return [belief, argumentation];
}
/**
 * Parse a Doubt from a crminf:Argumentation Thing.
 * If a dataset is provided, we follow crminf:concludedThat to the companion
 * crminf:Belief to recover the original `about`.
 */
export async function thingToDoubt(thing, dataset, config = {}) {
    await initSolidClient();
    const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    const thingUrl = solidClient.asUrl(thing);
    let id;
    try {
        const u = new URL(thingUrl);
        id = u.hash ? u.hash.slice(1) : undefined;
        if (!id) {
            const segs = u.pathname.split("/").filter(Boolean);
            id = segs[segs.length - 1];
        }
    }
    catch {
        /* ignore */
    }
    if (!id) {
        console.log("Could not extract ID from Thing URL", thingUrl);
        return null;
    }
    const question = solidClient.getStringNoLocale(thing, crm.hasNote) ?? "";
    const actorName = solidClient.getStringNoLocale(thing, crm.carriedOutBy) ?? "";
    const concludedThatUrl = solidClient.getUrl(thing, crminf.concludedThat);
    let beliefThing = null;
    if (!concludedThatUrl) {
        console.warn("No crminf:concludedThat URL found in Argumentation Thing", thing);
        return null;
    }
    beliefThing = solidClient.getThing(dataset, concludedThatUrl);
    if (!beliefThing) {
        console.warn("Could not find Belief Thing for crminf:concludedThat URL", concludedThatUrl);
        return null;
    }
    const thatUrl = solidClient.getUrl(beliefThing, crminf.that);
    if (!thatUrl) {
        console.log("Warning: Belief Thing does not have a crminf:that URL", beliefThing);
        return null;
    }
    const about = thatUrl.startsWith(baseUrl)
        ? thatUrl.slice(baseUrl.length)
        : thatUrl;
    return {
        id,
        about,
        question,
        making: {
            actor: {
                name: actorName,
                sameAs: [], // not modeled in this shape
            },
        },
    };
}
//# sourceMappingURL=serialization.js.map