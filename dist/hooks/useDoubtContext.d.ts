import { ReactNode, FC } from "react";
import { DoubtContextType, DoubtConfig } from "../types";
interface DoubtProviderProps {
    children: ReactNode;
    config?: DoubtConfig;
    isLoggedIn?: boolean;
    datasetUrl?: string;
}
/**
 * React context provider for doubt management
 */
export declare const DoubtProvider: FC<DoubtProviderProps>;
/**
 * Hook to access the doubt context
 */
export declare const useDoubtContext: () => DoubtContextType;
export {};
//# sourceMappingURL=useDoubtContext.d.ts.map