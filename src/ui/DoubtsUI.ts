import { DoubtManager } from "../core-simple";
import { Doubt, DoubtConfig } from "../types";

/**
 * Framework-agnostic doubt UI that works with vanilla JavaScript
 */
export class DoubtsUI {
  private manager: DoubtManager;
  private about: string;
  private container: HTMLElement;
  private onDoubtAdded?: (doubt: Doubt) => void;

  constructor(
    container: HTMLElement,
    about: string,
    config?: DoubtConfig,
    onDoubtAdded?: (doubt: Doubt) => void
  ) {
    this.container = container;
    this.about = about;
    this.manager = new DoubtManager(config);
    this.onDoubtAdded = onDoubtAdded;
    
    // Subscribe to changes
    this.manager.subscribe(() => this.render());
    
    // Initial render
    this.render();
  }

  private render(): void {
    const doubts = this.manager.getDoubtsAbout(this.about);
    const hasDoubts = doubts.length > 0;

    this.container.innerHTML = `
      <div style="margin: 8px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <span style="font-weight: bold; color: ${hasDoubts ? '#ff9800' : '#666'};">
            ❓ Doubts (${doubts.length})
          </span>
          <button id="add-doubt-btn" style="
            margin-left: 8px; 
            padding: 4px 8px; 
            border: none; 
            border-radius: 4px;
            background-color: #2196f3;
            color: white;
            cursor: pointer;
          ">
            Add Doubt
          </button>
        </div>

        ${doubts.length > 0 ? `
          <div style="margin-bottom: 8px;">
            ${doubts.map(doubt => `
              <div style="
                padding: 8px; 
                margin-bottom: 4px; 
                background-color: #f5f5f5; 
                border-radius: 4px;
              ">
                <div style="font-weight: bold;">${this.escapeHtml(doubt.question)}</div>
                <div style="font-size: 0.8em; color: #666;">
                  by ${this.escapeHtml(doubt.making.actor?.name || 'Unknown')}
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="color: #666; font-style: italic;">
            No doubts raised yet.
          </div>
        `}

        <div id="doubt-form" style="display: none; margin-top: 8px;">
          <textarea id="doubt-question" placeholder="Describe your doubt in form of a question..." style="
            width: 100%; 
            min-height: 60px; 
            padding: 8px; 
            border: 1px solid #ccc; 
            border-radius: 4px;
            resize: vertical;
            box-sizing: border-box;
          "></textarea>
          <div style="margin-top: 8px;">
            <button id="submit-doubt-btn" style="
              padding: 8px 16px; 
              border: none; 
              border-radius: 4px;
              background-color: #4caf50;
              color: white;
              cursor: pointer;
              margin-right: 8px;
            ">
              Add Doubt
            </button>
            <button id="cancel-doubt-btn" style="
              padding: 8px 16px; 
              border: none; 
              border-radius: 4px;
              background-color: #f44336;
              color: white;
              cursor: pointer;
            ">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    const addBtn = this.container.querySelector('#add-doubt-btn') as HTMLButtonElement;
    const form = this.container.querySelector('#doubt-form') as HTMLDivElement;
    const textarea = this.container.querySelector('#doubt-question') as HTMLTextAreaElement;
    const submitBtn = this.container.querySelector('#submit-doubt-btn') as HTMLButtonElement;
    const cancelBtn = this.container.querySelector('#cancel-doubt-btn') as HTMLButtonElement;

    addBtn?.addEventListener('click', () => {
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
      if (form.style.display === 'block') {
        textarea.focus();
      }
    });

    submitBtn?.addEventListener('click', () => {
      const question = textarea.value.trim();
      if (question) {
        const doubt = this.manager.createDoubt(this.about, question);
        textarea.value = '';
        form.style.display = 'none';
        this.onDoubtAdded?.(doubt);
      }
    });

    cancelBtn?.addEventListener('click', () => {
      textarea.value = '';
      form.style.display = 'none';
    });

    textarea?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        submitBtn.click();
      }
    });
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get the doubt manager instance
   */
  getManager(): DoubtManager {
    return this.manager;
  }

  /**
   * Destroy the UI and clean up event listeners
   */
  destroy(): void {
    this.container.innerHTML = '';
  }
}