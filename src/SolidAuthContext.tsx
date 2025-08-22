import { getIriAll, getSolidDataset, getStringNoLocale, getThing } from "@inrupt/solid-client";
import {
    handleIncomingRedirect,
    getDefaultSession,
    login as solidLogin,
    logout as solidLogout,
    fetch
} from "@inrupt/solid-client-authn-browser";
import { FOAF } from "@inrupt/vocab-common-rdf";
import { LoginOutlined, LogoutRounded } from "@mui/icons-material";
import { CircularProgress, IconButton, Paper, Tooltip } from "@mui/material";
import { FC, ReactNode, useState, useMemo, useEffect, useContext, createContext } from "react";

interface SolidAuthContextType {
    isLoggedIn: boolean;
    webId?: string;
    podUrl?: string;
    datasetUrl?: string;
    login: (opts?: { issuer?: string; redirectPath?: string; clientName?: string }) => Promise<void>;
    logout: (opts?: { fromIdP?: boolean; postLogoutUrl?: string }) => Promise<void>;
}

const SolidAuthContext = createContext<SolidAuthContextType | undefined>(undefined);

interface SolidAuthProviderProps {
    children: ReactNode;
    datasetPath: string;
}

export const SolidAuthProvider = ({
    children,
    datasetPath
}: SolidAuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [webId, setWebId] = useState<string | undefined>();
    const [podUrl, setPodUrl] = useState<string | undefined>();

    const datasetUrl = useMemo(() => {
        if (!podUrl) return undefined;
        const normalized = podUrl.endsWith("/") ? podUrl : `${podUrl}/`;
        return new URL(datasetPath, normalized).toString();
    }, [podUrl, datasetPath]);

    useEffect(() => {
        (async () => {
            await handleIncomingRedirect({ restorePreviousSession: true });
            const session = getDefaultSession();
            setIsLoggedIn(session.info.isLoggedIn);
            setWebId(session.info.webId ?? undefined);

            if (session.info.isLoggedIn && session.info.webId) {
                try {
                    console.log(session.info.webId, await session.fetch('https://pfefferniels.solidcommunity.net'));
                    console.log(await getSolidDataset(session.info.webId, { fetch: session.fetch }));
                    const profile = await getSolidDataset(session.info.webId)
                    if (!profile) return

                    const webIdThing = getThing(profile, session.info.webId);
                    if (!webIdThing) return

                    const podUrls = getIriAll(webIdThing, "http://www.w3.org/ns/pim/space#storage")
                    setPodUrl(podUrls[0] ?? undefined);
                } catch (e) {
                    console.error("Failed to discover Pod URLs", e);
                }
            }
        })();
    }, []);

    const login: SolidAuthContextType["login"] = async (opts) => {
        const issuer = opts?.issuer ?? "https://solidcommunity.net";
        const redirectPath = opts?.redirectPath ?? "/";
        const clientName = opts?.clientName ?? "Roll Desk Doubts";

        await solidLogin({
            oidcIssuer: issuer,
            redirectUrl: new URL(redirectPath, window.location.href).toString(),
            clientName,
        });
    };

    const logout: SolidAuthContextType["logout"] = async (_opts) => {
        await solidLogout({ logoutType: "app" });
        setIsLoggedIn(false);
        setWebId(undefined);
        setPodUrl(undefined);
    };

    const value = useMemo(
        () => ({ isLoggedIn, webId, podUrl, datasetUrl, login, logout }),
        [isLoggedIn, webId, podUrl, datasetUrl]
    );

    return <SolidAuthContext.Provider value={value}>{children}</SolidAuthContext.Provider>;
};

export const useSolidAuth = (): SolidAuthContextType => {
    const ctx = useContext(SolidAuthContext);
    if (!ctx) throw new Error("useSolidAuth must be used within SolidAuthProvider");
    return ctx;
};

export const SolidStatusBar = () => {
    const { isLoggedIn, webId, login, logout } = useSolidAuth();
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        const fetchName = async (webId: string) => {
            const ds = await getSolidDataset(webId, { fetch: fetch });
            if (!ds) return

            const profile = getThing(ds, webId);
            if (!profile) return

            setName(getStringNoLocale(profile, FOAF.name));
        }

        if (!webId) return
        fetchName(webId)
    }, [webId]);

    return (
        <Paper
            elevation={5}
            style={{
                display: "flex",
                position: 'absolute',
                top: 8,
                right: 8,
                gap: 8,
                alignItems: "center",
                padding: 8,
                zIndex: 1000,
            }}>
            {isLoggedIn ? (
                <>
                    {name
                        ? <span>Welcome,{' '}
                            <a
                                style={{ opacity: 0.7 }}
                                href={webId}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {name}
                            </a>
                        </span>
                        : <CircularProgress size='small' />
                    }
                    <IconButton onClick={() => logout()} size='small'>
                        <LogoutRounded />
                    </IconButton>
                </>
            ) : (
                <Tooltip title="Sign in to your Solid Pod">
                    <IconButton size="small" onClick={() => login()}>
                        <LoginOutlined />
                    </IconButton>
                </Tooltip>
            )
            }
        </Paper>
    );
};
