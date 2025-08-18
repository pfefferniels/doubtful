import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
/**
 * Dialog component for creating new doubts
 */
export const RaiseDoubtDialog = ({ about, onClose, onDone, defaultActor = { name: "unknown" } }) => {
    const [question, setQuestion] = useState("");
    const handleDone = () => {
        if (!question.trim())
            return;
        onDone(question.trim(), defaultActor.name);
    };
    return (_jsxs(Dialog, { open: true, onClose: onClose, fullWidth: true, children: [_jsx(DialogTitle, { children: "Raise a Doubt" }), _jsx(DialogContent, { children: _jsx(TextField, { label: "Describe your doubt in form of a question", fullWidth: true, multiline: true, rows: 3, value: question, onChange: (e) => setQuestion(e.target.value), autoFocus: true, margin: "dense" }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, children: "Cancel" }), _jsx(Button, { disabled: !question.trim(), variant: "contained", onClick: handleDone, children: "Done" })] })] }));
};
//# sourceMappingURL=RaiseDoubtDialog.js.map