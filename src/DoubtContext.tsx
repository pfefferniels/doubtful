import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import {
  buildThing,
  createSolidDataset,
  createThing,
  getSolidDataset,
  getThingAll,
  getStringNoLocale,
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

const crminf = {
  Argumentation: "http://www.cidoc-crm.org/extensions/crminf/I1_Argumentation",
  Belief: "http://www.cidoc-crm.org/extensions/crminf/I2_Belief",
  concludedThat: "http://www.cidoc-crm.org/extensions/crminf/J2_concluded_that",
  holdsToBe: "http://www.cidoc-crm.org/extensions/crminf/J5_holds_to_be",
  that: "http://www.cidoc-crm.org/extensions/crminf/J4_that",
} as const;

const crm = {
  hasNote: "http://www.cidoc-crm.org/cidoc-crm/P3_has_note",
  hasTimeSpan: "http://www.cidoc-crm.org/cidoc-crm/P4_has_time-span",
  carriedOutBy: "http://www.cidoc-crm.org/cidoc-crm/P14_carried_out_by",
} as const;

export interface Doubt {
  id: string;
  about: UrlString;
  question: string;
  making: {
    actor: {
      name: string;
      sameAs: string[];
    };
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
  raiseDoubt: () => {},
  getDoubtsAbout: () => [],
  all: [],
  isSyncing: false,
});

interface DoubtProviderProps {
  children: ReactNode;
  datasetUrl?: string;
  isLoggedIn?: boolean;
  fetch?: typeof solidFetch;
}

export const DoubtProvider: FC<DoubtProviderProps> = ({
  children,
  datasetUrl,
  isLoggedIn,
  fetch = solidFetch,
}) => {
  const [dialogOpen, setDialogOpen] = useState<string | undefined>();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | undefined>();

  const loaded = useRef(false);
  const saving = useRef(false);

  // load doubts from pod once
  useEffect(() => {
    if (!isLoggedIn || !datasetUrl || loaded.current) return;
    (async () => {
      setIsSyncing(true);
      setSyncError(undefined);
      try {
        let dataset;
        try {
          dataset = await getSolidDataset(datasetUrl, { fetch });
        } catch (e: any) {
          if (e.statusCode === 404) {
            dataset = createSolidDataset();
            await saveSolidDatasetAt(datasetUrl, dataset, { fetch });
          } else {
            throw e;
          }
        }
        const parsed: Doubt[] = getThingAll(dataset)
          .map((t) => thingToDoubt(t, dataset))
          .filter((x): x is Doubt => !!x);
        setDoubts(parsed);
        loaded.current = true;
      } catch (e: any) {
        setSyncError(e?.message ?? String(e));
      } finally {
        setIsSyncing(false);
      }
    })();
  }, [isLoggedIn, datasetUrl, fetch]);

  // persist changes
  useEffect(() => {
    if (!isLoggedIn || !datasetUrl || !loaded.current || saving.current) return;
    (async () => {
      saving.current = true;
      setIsSyncing(true);
      setSyncError(undefined);
      try {
        let ds = await getSolidDataset(datasetUrl, { fetch });
        doubts
          .map(doubtToThings)
          .flat()
          .forEach((t) => {
            ds = setThing(ds, t);
          });
        await saveSolidDatasetAt(datasetUrl, ds, { fetch });
      } catch (e: any) {
        setSyncError(e?.message ?? String(e));
      } finally {
        setIsSyncing(false);
        saving.current = false;
      }
    })();
  }, [JSON.stringify(doubts), isLoggedIn, datasetUrl, fetch]);

  const raiseDoubt = (id: string) => setDialogOpen(id);
  const getDoubtsAbout = (id: string): Doubt[] => doubts.filter((d) => d.about === id);

  return (
    <>
      {dialogOpen && (
        <RaiseDoubtDialog
          about={dialogOpen}
          onClose={() => setDialogOpen(undefined)}
          onDone={(d) => {
            setDoubts((prev) => [...prev, d]);
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

export const useDoubtContext = (): DoubtContextType => useContext(DoubtContext);

interface RaiseDoubtDialogProps {
  about: string;
  onClose: () => void;
  onDone: (doubt: Doubt) => void;
}

const RaiseDoubtDialog: FC<RaiseDoubtDialogProps> = ({ about, onClose, onDone }) => {
  const [question, setQuestion] = useState("");
  return (
    <Dialog open onClose={onClose} fullWidth>
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
          onClick={() =>
            onDone({
              id: uuidv4(),
              about,
              question: question.trim(),
              making: {
                actor: { name: "pfeffer", sameAs: ["https://nielspfeffer.com"] },
              },
            })
          }
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const doubtToThings = (d: Doubt): ThingLocal[] => {
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
    .addStringNoLocale(crm.carriedOutBy, d.making.actor.name || "unknown")
    .build();

  return [belief, argumentation];
};

export function thingToDoubt(t: Thing, dataset: SolidDataset): Doubt | null {
  const thingUrl = asUrl(t);
  let id: string | undefined;
  try {
    const u = new URL(thingUrl);
    id = u.hash ? u.hash.slice(1) : u.pathname.split("/").filter(Boolean).pop();
  } catch {
    /* ignore */
  }
  if (!id) return null;

  const question = getStringNoLocale(t as any, crm.hasNote) || "";
  const actorName = getStringNoLocale(t as any, crm.carriedOutBy) || "";

  const concludedThatUrl = getUrl(t as any, crminf.concludedThat);
  if (!concludedThatUrl) return null;
  const beliefThing = getThing(dataset, concludedThatUrl);
  if (!beliefThing) return null;

  const thatUrl = getUrl(beliefThing as any, crminf.that);
  if (!thatUrl) return null;
  const about = thatUrl.startsWith("https://encoded-ghosts.org/")
    ? thatUrl.slice("https://encoded-ghosts.org/".length)
    : thatUrl;

  return {
    id,
    about,
    question,
    making: { actor: { name: actorName, sameAs: [] } },
  };
}
