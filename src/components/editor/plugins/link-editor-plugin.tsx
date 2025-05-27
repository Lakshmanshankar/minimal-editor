import { $getSelection, $isNodeSelection, $isRangeSelection, COMMAND_PRIORITY_NORMAL } from 'lexical'
import { createCommand } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect } from 'react';

export function LinkEditorPlugin() {
    const [editor] = useLexicalComposerContext();
    const INSERT_LINK_COMMAND = createCommand<{ url: string }>('INSERT_LINK_COMMAND');

    const $updateLinkInFloatingToolbar = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                return selection.getTextContent();
            } else if ($isNodeSelection(selection)) {
                console.log(selection.getNodes());
            }
        });
    }, [editor]);


    useEffect(() => {
        if (!editor) return;
        editor.registerCommand(INSERT_LINK_COMMAND, (url) => {
            console.log(url);
            $updateLinkInFloatingToolbar();
            return true;
        }, COMMAND_PRIORITY_NORMAL);
    }, [INSERT_LINK_COMMAND, editor]);

    // useEffect(() => {
    //     if (!editor) return;
    //     const unregisterSelectionListener = editor.registerUpdateListener(({ editorState }) => {
    //         editorState.read(() => {
    //             $updateLinkInFloatingToolbar();
    //         });
    //     });

    //     return () => {
    //         unregisterSelectionListener();
    //     };
    // }, [$updateLinkInFloatingToolbar, editor]);

    return (
        <div className="mb-2 flex gap-2 border-b pb-2">
            <button onClick={() => {
                editor.dispatchCommand(INSERT_LINK_COMMAND, { url: 'https://www.google.com' })
            }}>
                LInk editor plugin
            </button>
        </div>
    );
}
