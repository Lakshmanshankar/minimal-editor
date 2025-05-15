import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const $updateToolbar = () => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                setIsBold(selection.hasFormat('bold'));
                setIsItalic(selection.hasFormat('italic'));
                setIsUnderline(selection.hasFormat('underline'));
            }
        });
    };

    useEffect(() => {
        if (!editor) return;
        const unregisterSelectionListener = editor.registerUpdateListener(
            ({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }
        );

        const unregisterFormat = editor.registerCommand(
            FORMAT_TEXT_COMMAND,
            () => {
                $updateToolbar();
                return false;
            },
            COMMAND_PRIORITY_CRITICAL
        );

        return () => {
            unregisterSelectionListener();
            unregisterFormat();
        };
    }, [editor]);

    const format = (type: 'bold' | 'italic' | 'underline') => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
    };

    return (
        <div className="mb-2 flex gap-2 border-b pb-2">
            <button
                onClick={() => format('bold')}
                className={`rounded px-2 py-1 ${isBold ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
                B
            </button>
            <button
                onClick={() => format('italic')}
                className={`rounded px-2 py-1 ${isItalic ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
                I
            </button>
            <button
                onClick={() => format('underline')}
                className={`rounded px-2 py-1 ${isUnderline ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
                U
            </button>
        </div>
    );
}
