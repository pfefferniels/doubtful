import { FC } from "react";
import { DoubtManager } from "../core-simple";
import { Doubt, DoubtConfig } from "../types";
interface DoubtsProps {
    about: string;
    onDoubtAdded?: (doubt: Doubt) => void;
    doubtManager?: DoubtManager;
    config?: DoubtConfig;
}
/**
 * Simple Doubts component that works without external dependencies
 * Provides a basic interface for viewing and creating doubts
 */
export declare const DoubtsSimple: FC<DoubtsProps>;
export {};
//# sourceMappingURL=DoubtsSimple.d.ts.map