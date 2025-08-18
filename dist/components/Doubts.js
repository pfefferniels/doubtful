import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useRef } from "react";
import { IconButton, Popover, Tooltip, List, ListItem, ListItemText } from "@mui/material";
import { Add, QuestionAnswer } from "@mui/icons-material";
import { DoubtManager } from "../core";
import { RaiseDoubtDialog } from "./RaiseDoubtDialog";
/**
 * Component for displaying and managing doubts about a specific resource
 */
export const Doubts = ({ about, onDoubtAdded, doubtManager, config }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [doubts, setDoubts] = useState([]);
    const managerRef = useRef();
    // Initialize doubt manager if not provided
    React.useEffect(() => {
        if (doubtManager) {
            managerRef.current = doubtManager;
        }
        else if (!managerRef.current) {
            managerRef.current = new DoubtManager(config);
        }
        if (managerRef.current) {
            // Subscribe to changes and get initial doubts
            const unsubscribe = managerRef.current.subscribe(() => {
                setDoubts(managerRef.current.getDoubtsAbout(about));
            });
            setDoubts(managerRef.current.getDoubtsAbout(about));
            return unsubscribe;
        }
    }, [doubtManager, config, about]);
    const getDoubtsAbout = (id) => {
        return managerRef.current?.getDoubtsAbout(id) || [];
    };
    const doubts = getDoubtsAbout(about);
    const hasDoubts = doubts.length > 0;
    const handleOpenDialog = () => {
        setDialogOpen(true);
        setAnchorEl(null);
    };
    const handleDoubtAdded = (question, actorName) => {
        if (managerRef.current) {
            const actor = actorName ? { name: actorName } : config?.defaultActor;
            const doubt = managerRef.current.createDoubt(about, question, actor);
            setDialogOpen(false);
            onDoubtAdded?.(doubt);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(IconButton, { onClick: (event) => {
                    setAnchorEl(event.currentTarget);
                }, color: hasDoubts ? "warning" : "default", children: _jsx(QuestionAnswer, {}) }), _jsxs(Popover, { anchorEl: anchorEl, open: Boolean(anchorEl), onClose: () => setAnchorEl(null), anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                }, transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                }, slotProps: {
                    paper: {
                        elevation: 3,
                        sx: {
                            padding: 2,
                            maxWidth: 400,
                        }
                    }
                }, children: [hasDoubts && (_jsx(List, { dense: true, children: doubts.map((doubt) => (_jsx(ListItem, { children: _jsx(ListItemText, { primary: doubt.question, secondary: `by ${doubt.making.actor?.name || 'Unknown'}` }) }, `doubt_${doubt.id}`))) })), !hasDoubts && (_jsx("div", { style: { padding: '8px 0', color: '#666' }, children: "No doubts raised yet." })), _jsx(Tooltip, { title: "Raise a doubt or question about this assumption", children: _jsx(IconButton, { onClick: handleOpenDialog, children: _jsx(Add, {}) }) })] }), dialogOpen && (_jsx(RaiseDoubtDialog, { about: about, onClose: () => setDialogOpen(false), onDone: handleDoubtAdded, defaultActor: config?.defaultActor }))] }));
};
//# sourceMappingURL=Doubts.js.map