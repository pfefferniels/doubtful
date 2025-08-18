import React, { useState, FC } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

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
export const RaiseDoubtDialog: FC<RaiseDoubtDialogProps> = ({ 
  about, 
  onClose, 
  onDone,
  defaultActor = { name: "unknown" }
}) => {
  const [question, setQuestion] = useState<string>("");

  const handleDone = () => {
    if (!question.trim()) return;
    
    onDone(question.trim(), defaultActor.name);
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth>
      <DialogTitle>Raise a Doubt</DialogTitle>
      <DialogContent>
        <TextField
          label="Describe your doubt in form of a question"
          fullWidth
          multiline
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          autoFocus
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={!question.trim()}
          variant="contained"
          onClick={handleDone}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};