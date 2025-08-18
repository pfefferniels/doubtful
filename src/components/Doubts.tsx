import React, { useState, FC, useRef } from "react";
import { IconButton, Popover, Tooltip, List, ListItem, ListItemText } from "@mui/material";
import { Add, QuestionAnswer } from "@mui/icons-material";
import { DoubtManager } from "../core";
import { RaiseDoubtDialog } from "./RaiseDoubtDialog";
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
export const Doubts: FC<DoubtsProps> = ({ about, onDoubtAdded, doubtManager, config }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const managerRef = useRef<DoubtManager>();

  // Initialize doubt manager if not provided
  React.useEffect(() => {
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

  const getDoubtsAbout = (id: string): Doubt[] => {
    return managerRef.current?.getDoubtsAbout(id) || [];
  };

  const doubts = getDoubtsAbout(about);
  const hasDoubts = doubts.length > 0;

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDoubtAdded = (question: string, actorName?: string) => {
    if (managerRef.current) {
      const actor = actorName ? { name: actorName } : config?.defaultActor;
      const doubt = managerRef.current.createDoubt(about, question, actor);
      setDialogOpen(false);
      onDoubtAdded?.(doubt);
    }
  };

  return (
    <>
      <IconButton
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
        color={hasDoubts ? "warning" : "default"}
      >
        <QuestionAnswer />
      </IconButton>

      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              padding: 2,
              maxWidth: 400,
            }
          }
        }}
      >
        {hasDoubts && (
          <List dense>
            {doubts.map((doubt) => (
              <ListItem key={`doubt_${doubt.id}`}>
                <ListItemText 
                  primary={doubt.question}
                  secondary={`by ${doubt.making.actor?.name || 'Unknown'}`}
                />
              </ListItem>
            ))}
          </List>
        )}
        
        {!hasDoubts && (
          <div style={{ padding: '8px 0', color: '#666' }}>
            No doubts raised yet.
          </div>
        )}
        
        <Tooltip title="Raise a doubt or question about this assumption">
          <IconButton onClick={handleOpenDialog}>
            <Add />
          </IconButton>
        </Tooltip>
      </Popover>

      {dialogOpen && (
        <RaiseDoubtDialog
          about={about}
          onClose={() => setDialogOpen(false)}
          onDone={handleDoubtAdded}
          defaultActor={config?.defaultActor}
        />
      )}
    </>
  );
};