import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useState, useRef, useEffect } from "react";
import { DoubtManager } from "../core-simple";
/**
 * Simple Doubts component that works without external dependencies
 * Provides a basic interface for viewing and creating doubts
 */
export const DoubtsSimple = ({ about, onDoubtAdded, doubtManager, config }) => {
    const [showForm, setShowForm] = useState(false);
    const [question, setQuestion] = useState("");
    const [doubts, setDoubts] = useState([]);
    const managerRef = useRef();
    // Initialize doubt manager if not provided
    useEffect(() => {
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
    const handleAddDoubt = () => {
        if (!question.trim() || !managerRef.current)
            return;
        const actor = config?.defaultActor;
        const doubt = managerRef.current.createDoubt(about, question.trim(), actor);
        setQuestion("");
        setShowForm(false);
        onDoubtAdded?.(doubt);
    };
    const hasDoubts = doubts.length > 0;
    return (_jsxs("div", { style: { margin: '8px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', marginBottom: '8px' }, children: [_jsxs("span", { style: { fontWeight: 'bold', color: hasDoubts ? '#ff9800' : '#666' }, children: ["\u2753 Doubts (", doubts.length, ")"] }), _jsx("button", { onClick: () => setShowForm(!showForm), style: {
                            marginLeft: '8px',
                            padding: '4px 8px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#2196f3',
                            color: 'white',
                            cursor: 'pointer'
                        }, children: showForm ? 'Cancel' : 'Add Doubt' })] }), doubts.length > 0 && (_jsx("div", { style: { marginBottom: '8px' }, children: doubts.map((doubt) => (_jsxs("div", { style: {
                        padding: '8px',
                        marginBottom: '4px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px'
                    }, children: [_jsx("div", { style: { fontWeight: 'bold' }, children: doubt.question }), _jsxs("div", { style: { fontSize: '0.8em', color: '#666' }, children: ["by ", doubt.making.actor?.name || 'Unknown'] })] }, doubt.id))) })), showForm && (_jsxs("div", { style: { marginTop: '8px' }, children: [_jsx("textarea", { value: question, onChange: (e) => setQuestion(e.target.value), placeholder: "Describe your doubt in form of a question...", style: {
                            width: '100%',
                            minHeight: '60px',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            resize: 'vertical'
                        } }), _jsx("div", { style: { marginTop: '8px' }, children: _jsx("button", { onClick: handleAddDoubt, disabled: !question.trim(), style: {
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '4px',
                                backgroundColor: question.trim() ? '#4caf50' : '#ccc',
                                color: 'white',
                                cursor: question.trim() ? 'pointer' : 'not-allowed'
                            }, children: "Add Doubt" }) })] })), !hasDoubts && !showForm && (_jsx("div", { style: { color: '#666', fontStyle: 'italic' }, children: "No doubts raised yet." }))] }));
};
//# sourceMappingURL=DoubtsSimple.js.map