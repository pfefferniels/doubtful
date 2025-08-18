import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Popover, TextField, Tooltip } from "@mui/material";
import { WithActor, WithId } from "linked-rolls";
import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
    FC,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
    buildThing,
    createSolidDataset,
    createThing,
    getSolidDataset,
    getStringNoLocale,
    getThingAll,
    getUrl,
    saveSolidDatasetAt,
    setThing,
    asUrl,
    UrlString,
    ThingLocal,
    Thing,
    SolidDataset,
    getThing,
} from "@inrupt/solid-client";
import { RDF } from "@inrupt/vocab-common-rdf";
import { fetch as solidFetch } from "@inrupt/solid-client-authn-browser";
import { useSolidAuth } from "./SolidAuthProvider";
import { Add, QuestionAnswer } from "@mui/icons-material";
import { List, ListItem, ListItemText } from "@mui/material";

const crminf = {
    Argumentation: 'http://www.cidoc-crm.org/extensions/crminf/I1_Argumentation',
    Belief: 'http://www.cidoc-crm.org/extensions/crminf/I2_Belief',
    concludedThat: 'http://www.cidoc-crm.org/extensions/crminf/J2_concluded_that',
    holdsToBe: 'http://www.cidoc-crm.org/extensions/crminf/J5_holds_to_be',
    that: 'http://www.cidoc-crm.org/extensions/crminf/J4_that',
} as const

const crm = {
    hasNote: 'http://www.cidoc-crm.org/cidoc-crm/P3_has_note',
    hasTimeSpan: 'http://www.cidoc-crm.org/cidoc-crm/P4_has_time-span',
    carriedOutBy: 'http://www.cidoc-crm.org/cidoc-crm/P14_carried_out_by',
}

export interface Doubt extends WithId {
    about: UrlString;
    question: string;
    making: WithActor & {
        // additional metadata can go here later
    };
}

interface DoubtContextType {
    raiseDoubt: (about: string) => void;
    getDoubtsAbout: (id: string) => Doubt[];
    all: Doubt[];
    isSyncing: boolean;
    syncError?: string;
}

const DoubtContext = createContext<DoubtContextType>({
    raiseDoubt: () => { },
    getDoubtsAbout: () => [],
    all: [],
    isSyncing: false,
});

interface DoubtProviderProps {
    children: ReactNode;
}

export const DoubtProvider: FC<DoubtProviderProps> = ({ children }) => {
    const { isLoggedIn, datasetUrl } = useSolidAuth();

    const [dialogOpen, setDialogOpen] = useState<string | undefined>(undefined);
    const [doubts, setDoubts] = useState<Doubt[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState<string | undefined>();

    const hasLoadedFromPodRef = useRef(false);
    const savingRef = useRef(false);

    console.log('doubts', doubts)

    // 1) Load from Solid on first availability of datasetUrl
    useEffect(() => {
        if (!isLoggedIn || !datasetUrl || hasLoadedFromPodRef.current) return;

        (async () => {
            setIsSyncing(true);
            setSyncError(undefined);
            try {
                let dataset;
                try {
                    dataset = await getSolidDataset(datasetUrl, { fetch: solidFetch });
                } catch (e: any) {
                    // If 404 (not found) -> start a fresh dataset
                    if (e.statusCode === 404) {
                        dataset = createSolidDataset();
                        await saveSolidDatasetAt(datasetUrl, dataset, { fetch: solidFetch });
                    } else {
                        throw e;
                    }
                }

                const things = getThingAll(dataset);
                const parsed: Doubt[] = things
                    .map((t) => thingToDoubt(t, dataset))
                    .filter((x): x is Doubt => !!x);

                setDoubts(parsed);
                hasLoadedFromPodRef.current = true;
            } catch (e: any) {
                console.error("Failed to load doubts from Pod", e);
                setSyncError(e?.message ?? String(e));
            } finally {
                setIsSyncing(false);
            }
        })();
    }, [isLoggedIn, datasetUrl]);

    // 2) Persist every change to Solid (after initial load)
    useEffect(() => {
        if (!isLoggedIn || !datasetUrl) return;
        if (!hasLoadedFromPodRef.current) return; // avoid saving the just-loaded state
        if (savingRef.current) return; // avoid re-entrancy

        (async () => {
            savingRef.current = true;
            setIsSyncing(true);
            setSyncError(undefined);
            try {
                let ds = await getSolidDataset(datasetUrl, { fetch: solidFetch });
                doubts
                    .map(doubt => doubtToThings(doubt))
                    .flat()
                    .forEach(thing => {
                        ds = setThing(ds, thing);
                    })

                await saveSolidDatasetAt(datasetUrl, ds, { fetch: solidFetch });
            } catch (e: any) {
                console.error("Failed to save doubts to Pod", e);
                setSyncError(e?.message ?? String(e));
            } finally {
                setIsSyncing(false);
                savingRef.current = false;
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(doubts), isLoggedIn, datasetUrl]);

    const raiseDoubt = (id: string) => {
        setDialogOpen(id);
    };

    const getDoubtsAbout = (id: string): Doubt[] => doubts.filter((d) => d.about === id);

    return (
        <>
            {dialogOpen && (
                <RaiseDoubtDialog
                    about={dialogOpen}
                    onClose={() => setDialogOpen(undefined)}
                    onDone={(doubt) => {
                        console.log('onDone', doubt)
                        setDoubts((prev) => [...prev, doubt]);
                        setDialogOpen(undefined);
                    }}
                />
            )}

            <DoubtContext.Provider value={{ raiseDoubt, getDoubtsAbout, all: doubts, isSyncing, syncError }}>
                {children}
            </DoubtContext.Provider>
        </>
    );
};

export const useDoubtContext = (): DoubtContextType => {
    const context = useContext(DoubtContext);
    if (!context) {
        throw new Error("useDoubtContext must be used within a DoubtProvider");
    }
    return context;
};

interface RaiseDoubtDialogProps {
    about: string;
    onClose: () => void;
    onDone: (doubt: Doubt) => void;
}

const RaiseDoubtDialog: FC<RaiseDoubtDialogProps> = ({ about, onClose, onDone }) => {
    const [question, setQuestion] = useState<string>("");

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogTitle>Raise a Doubt</DialogTitle>
            <DialogContent>
                <TextField
                    label="Describe your doubt in form of a question"
                    fullWidth
                    multiline
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    disabled={!question.trim()}
                    variant="contained"
                    onClick={() => {
                        onDone({
                            about,
                            id: uuidv4(),
                            question: question.trim(),
                            making: {
                                actor: {
                                    name: "pfeffer",
                                    sameAs: ["https://nielspfeffer.com"],
                                },
                            },
                        });
                    }}
                >
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const doubtToThings = (d: Doubt): ThingLocal[] => {
    const belief = buildThing(createThing({ name: d.id + "-belief" }))
        .addUrl(RDF.type, crminf.Belief)
        .addUrl(crminf.that, `https://encoded-ghosts.org/${d.about}`)
        .addStringNoLocale(crminf.holdsToBe, "doubtful")
        .addDate(crm.hasTimeSpan, new Date())
        .build();

    const argumentation = buildThing(createThing({ name: d.id }))
        .addUrl(RDF.type, crminf.Argumentation)
        .addStringNoLocale(crm.hasNote, d.question)
        .addUrl(crminf.concludedThat, belief)
        .addStringNoLocale(crm.carriedOutBy, d.making.actor?.name || 'unknown')
        .build()

    return [belief, argumentation]
}

/**
 * Parse a Doubt from a crminf:Argumentation Thing.
 * If a dataset is provided, we follow crminf:concludedThat to the companion
 * crminf:Belief to recover the original `about`.
 */
export function thingToDoubt(t: Thing, dataset: SolidDataset): Doubt | null {
    const thingUrl = asUrl(t);
    let id: string | undefined;
    try {
        const u = new URL(thingUrl);
        id = u.hash ? u.hash.slice(1) : undefined;
        if (!id) {
            const segs = u.pathname.split("/").filter(Boolean);
            id = segs[segs.length - 1];
        }
    } catch {
        /* ignore */
    }
    if (!id) {
        console.log("Could not extract ID from Thing URL", thingUrl);
        return null
    }

    const question = getStringNoLocale(t as any, crm.hasNote) ?? "";
    const actorName = getStringNoLocale(t as any, crm.carriedOutBy) ?? "";

    const concludedThatUrl = getUrl(t as any, crminf.concludedThat);
    let beliefThing: Thing | null = null;

    if (!concludedThatUrl) {
        console.warn("No crminf:concludedThat URL found in Argumentation Thing", t);
        return null
    }

    beliefThing = getThing(dataset, concludedThatUrl)
    if (!beliefThing) {
        console.warn("Could not find Belief Thing for crminf:concludedThat URL", concludedThatUrl);
        return null;
    }

    const thatUrl = getUrl(beliefThing as any, crminf.that);
    if (!thatUrl) {
        console.log("Warning: Belief Thing does not have a crminf:that URL", beliefThing);
        return null;
    }
    const about = thatUrl.startsWith('https://encoded-ghosts.org/')
        ? thatUrl.slice('https://encoded-ghosts.org/'.length)
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

interface DoubtProps {
    about: string
}

export const Doubts = ({ about }: DoubtProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { getDoubtsAbout, raiseDoubt } = useDoubtContext();

    return (
        <>
            <IconButton
                onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                }}
            >
                <QuestionAnswer color={anchorEl ? 'primary' : 'inherit'} />
            </IconButton>

            <Popover
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                slotProps={{
                    paper: {
                        elevation: 3,
                        sx: {
                            padding: 3
                        }
                    }
                }}
            >
                <Popover
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    slotProps={{
                        paper: {
                            elevation: 3,
                        }
                    }}
                >
                    <List dense>
                        {getDoubtsAbout(about).map((doubt) => (
                            <ListItem key={`doubt_${doubt.id}`}>
                                <ListItemText primary={doubt.question} />
                            </ListItem>
                        ))}
                    </List>
                    <Tooltip title="Raise a doubt or question about this assumption">
                        <IconButton onClick={() => raiseDoubt(about)}>
                            <Add />
                        </IconButton>
                    </Tooltip>
                </Popover>
                <Tooltip title="Raise a doubt or question about this assumption">
                    <IconButton
                        onClick={() => {
                            raiseDoubt(about)
                        }}
                    >
                        <Add />
                    </IconButton>
                </Tooltip>
            </Popover>
        </>
    )
}
