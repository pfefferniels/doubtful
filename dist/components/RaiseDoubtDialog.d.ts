import { FC } from "react";
interface RaiseDoubtDialogProps {
    about: string;
    onClose: () => void;
    onDone: (question: string, actorName?: string) => void;
    defaultActor?: {
        name: string;
        sameAs?: string[];
    };
}
/**
 * Dialog component for creating new doubts
 */
export declare const RaiseDoubtDialog: FC<RaiseDoubtDialogProps>;
export {};
//# sourceMappingURL=RaiseDoubtDialog.d.ts.map