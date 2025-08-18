import { DoubtManager } from "../core-simple";
import { Doubt, DoubtConfig } from "../types";
/**
 * Framework-agnostic doubt UI that works with vanilla JavaScript
 */
export declare class DoubtsUI {
    private manager;
    private about;
    private container;
    private onDoubtAdded?;
    constructor(container: HTMLElement, about: string, config?: DoubtConfig, onDoubtAdded?: (doubt: Doubt) => void);
    private render;
    private attachEventListeners;
    private escapeHtml;
    /**
     * Get the doubt manager instance
     */
    getManager(): DoubtManager;
    /**
     * Destroy the UI and clean up event listeners
     */
    destroy(): void;
}
//# sourceMappingURL=DoubtsUI.d.ts.map