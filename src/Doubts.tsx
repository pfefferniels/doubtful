import { Add, QuestionAnswer } from "@mui/icons-material";
import { IconButton, List, ListItem, ListItemText, Popover, Tooltip } from "@mui/material";
import { FC, useState } from "react";
import { useDoubtContext } from "./DoubtContext";

interface DoubtProps {
  about: string;
}

export const Doubts: FC<DoubtProps> = ({ about }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { getDoubtsAbout, raiseDoubt } = useDoubtContext();
  const doubts = getDoubtsAbout(about);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <QuestionAnswer color={anchorEl ? "primary" : "inherit"} />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { elevation: 3, sx: { p: 2 } } }}
      >
        <List dense>
          {doubts.map((d) => (
            <ListItem key={d.id}>
              <ListItemText primary={d.question} />
            </ListItem>
          ))}
        </List>
        <Tooltip title="Raise a doubt or question about this assumption">
          <IconButton onClick={() => raiseDoubt(about)}>
            <Add />
          </IconButton>
        </Tooltip>
      </Popover>
    </>
  );
};
