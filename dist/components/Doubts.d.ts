import { FC } from "react";
import { DoubtManager } from "../core";
import { Doubt, DoubtConfig } from "../types";
interface DoubtsProps {
    about: string;
    onDoubtAdded?: (doubt: Doubt) => void;
    doubtManager?: DoubtManager;
    config?: DoubtConfig;
}
/**
 * Component for displaying and managing doubts about a specific resource
 */
export declare const Doubts: FC<DoubtsProps>;
export {};
//# sourceMappingURL=Doubts.d.ts.map