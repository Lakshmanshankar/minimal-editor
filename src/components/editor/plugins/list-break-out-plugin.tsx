import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, KEY_ENTER_COMMAND } from 'lexical';
import { $isListItemNode, $isListNode } from '@lexical/list';
import { useEffect } from 'react';

export function ListBreakOutPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            KEY_ENTER_COMMAND,
            () => {
                const selection = $getSelection();
                if (!$isRangeSelection(selection)) return false;

                const anchor = selection.anchor;
                const anchorNode = anchor.getNode();
                const parentNode = anchorNode.getParent();

                if (!$isListItemNode(parentNode)) return false;

                // Check if we're at the end of the list item
                const isAtEnd = anchor.offset === anchorNode.getTextContentSize();
                if (!isAtEnd) return false;

                // Check if the list item is empty
                const isEmpty = parentNode.getTextContent().trim() === '';
                if (!isEmpty) return false;

                // Get the list node
                const listNode = parentNode.getParent();
                if (!$isListNode(listNode)) return false;

                // Check if this is the last item in the list
                const isLastItem = parentNode === listNode.getLastChild();
                if (!isLastItem) return false;

                // Break out of the list
                editor.update(() => {
                    parentNode.remove();
                    const newParagraph = $createParagraphNode();
                    listNode.insertAfter(newParagraph);
                    newParagraph.select();
                });

                return true;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor]);

    return null;
} 