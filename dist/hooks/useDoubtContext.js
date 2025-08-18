import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { DoubtManager } from "../core";
const DoubtContext = createContext({
    raiseDoubt: () => { },
    getDoubtsAbout: () => [],
    all: [],
    isSyncing: false,
});
/**
 * React context provider for doubt management
 */
export const DoubtProvider = ({ children, config = {}, isLoggedIn = false, datasetUrl }) => {
    const [dialogOpen, setDialogOpen] = useState(undefined);
    const [doubts, setDoubts] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState();
    const managerRef = useRef();
    const hasLoadedFromPodRef = useRef(false);
    const savingRef = useRef(false);
    // Initialize doubt manager
    useEffect(() => {
        if (!managerRef.current) {
            managerRef.current = new DoubtManager(config);
            // Subscribe to doubt changes
            const unsubscribe = managerRef.current.subscribe((newDoubts) => {
                setDoubts(newDoubts);
            });
            return unsubscribe;
        }
    }, [config]);
    // Load from Solid on first availability of datasetUrl
    useEffect(() => {
        if (!isLoggedIn || !datasetUrl || hasLoadedFromPodRef.current || !managerRef.current)
            return;
        (async () => {
            setIsSyncing(true);
            setSyncError(undefined);
            try {
                await managerRef.current.loadFromSolid(datasetUrl);
                hasLoadedFromPodRef.current = true;
            }
            catch (e) {
                console.error("Failed to load doubts from Pod", e);
                setSyncError(e?.message ?? String(e));
            }
            finally {
                setIsSyncing(false);
            }
        })();
    }, [isLoggedIn, datasetUrl]);
    // Persist every change to Solid (after initial load)
    useEffect(() => {
        if (!isLoggedIn || !datasetUrl || !managerRef.current)
            return;
        if (!hasLoadedFromPodRef.current)
            return; // avoid saving the just-loaded state
        if (savingRef.current)
            return; // avoid re-entrancy
        (async () => {
            savingRef.current = true;
            setIsSyncing(true);
            setSyncError(undefined);
            try {
                await managerRef.current.saveToSolid(datasetUrl);
            }
            catch (e) {
                console.error("Failed to save doubts to Pod", e);
                setSyncError(e?.message ?? String(e));
            }
            finally {
                setIsSyncing(false);
                savingRef.current = false;
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(doubts), isLoggedIn, datasetUrl]);
    const raiseDoubt = (id) => {
        setDialogOpen(id);
    };
    const getDoubtsAbout = (id) => managerRef.current?.getDoubtsAbout(id) || [];
    const contextValue = {
        raiseDoubt,
        getDoubtsAbout,
        all: doubts,
        isSyncing,
        syncError,
    };
    return (_jsx(DoubtContext.Provider, { value: contextValue, children: children }));
};
/**
 * Hook to access the doubt context
 */
export const useDoubtContext = () => {
    const context = useContext(DoubtContext);
    if (!context) {
        throw new Error("useDoubtContext must be used within a DoubtProvider");
    }
    return context;
};
//# sourceMappingURL=useDoubtContext.js.map