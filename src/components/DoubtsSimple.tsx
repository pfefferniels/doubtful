import React, { useState, FC, useRef, useEffect } from "react";
import { DoubtManager } from "../core-simple";
import { Doubt, DoubtConfig, Actor } from "../types";

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
export const DoubtsSimple: FC<DoubtsProps> = ({ about, onDoubtAdded, doubtManager, config }) => {
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const managerRef = useRef<DoubtManager>();

  // Initialize doubt manager if not provided
  useEffect(() => {
    if (doubtManager) {
      managerRef.current = doubtManager;
    } else if (!managerRef.current) {
      managerRef.current = new DoubtManager(config);
    }

    if (managerRef.current) {
      // Subscribe to changes and get initial doubts
      const unsubscribe = managerRef.current.subscribe(() => {
        setDoubts(managerRef.current!.getDoubtsAbout(about));
      });
      
      setDoubts(managerRef.current.getDoubtsAbout(about));

      return unsubscribe;
    }
  }, [doubtManager, config, about]);

  const handleAddDoubt = () => {
    if (!question.trim() || !managerRef.current) return;
    
    const actor = config?.defaultActor;
    const doubt = managerRef.current.createDoubt(about, question.trim(), actor);
    setQuestion("");
    setShowForm(false);
    onDoubtAdded?.(doubt);
  };

  const hasDoubts = doubts.length > 0;

  return (
    <div style={{ margin: '8px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontWeight: 'bold', color: hasDoubts ? '#ff9800' : '#666' }}>
          ❓ Doubts ({doubts.length})
        </span>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ 
            marginLeft: '8px', 
            padding: '4px 8px', 
            border: 'none', 
            borderRadius: '4px',
            backgroundColor: '#2196f3',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancel' : 'Add Doubt'}
        </button>
      </div>

      {doubts.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          {doubts.map((doubt) => (
            <div 
              key={doubt.id} 
              style={{ 
                padding: '8px', 
                marginBottom: '4px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px' 
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{doubt.question}</div>
              <div style={{ fontSize: '0.8em', color: '#666' }}>
                by {doubt.making.actor?.name || 'Unknown'}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ marginTop: '8px' }}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Describe your doubt in form of a question..."
            style={{ 
              width: '100%', 
              minHeight: '60px', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
          <div style={{ marginTop: '8px' }}>
            <button 
              onClick={handleAddDoubt}
              disabled={!question.trim()}
              style={{ 
                padding: '8px 16px', 
                border: 'none', 
                borderRadius: '4px',
                backgroundColor: question.trim() ? '#4caf50' : '#ccc',
                color: 'white',
                cursor: question.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Add Doubt
            </button>
          </div>
        </div>
      )}

      {!hasDoubts && !showForm && (
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          No doubts raised yet.
        </div>
      )}
    </div>
  );
};