import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";

import { $setBlocksType } from "@lexical/selection";

type Decoration = "bold" | "italic" | "underline";

export function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [activeHeading, setActiveHeading] = useState<string | null>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const $updateToolbar = () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // Update formatting states
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));

            // Check for heading
            const anchorNode = selection.anchor.getNode();
            const element =
                anchorNode.getKey() === "root"
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow();

            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);
            // console.log(elementDOM, 'ELEMENT DOM');
            // Update heading state
            if (elementDOM) {
                if ($isHeadingNode(element)) {
                    const headingTag = element.getTag();
                    setActiveHeading(headingTag);
                } else {
                    setActiveHeading(null);
                }
            }
        }
    };

    const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () =>
                    $createHeadingNode(headingSize),
                );
            }
        });
    };

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                editor.getEditorState().read($updateToolbar);
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [$updateToolbar, editor]);

    const format = (type: Decoration) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
    };

    return (
        <div className="mb-2 flex gap-2 border-b border-border pb-2">
            <button
                onClick={() => format("bold")}
                className={`rounded px-2 py-1 ${isBold ? "bg-accent-elevated text-accent-elevated-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
                B
            </button>
            <button
                onClick={() => format("italic")}
                className={`rounded px-2 py-1 ${isItalic ? "bg-accent-elevated text-accent-elevated-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
                I
            </button>
            <button
                onClick={() => format("underline")}
                className={`rounded px-2 py-1 ${isUnderline ? "bg-accent-elevated text-accent-elevated-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
                U
            </button>

            <button
                onClick={() => formatHeading("h1")}
                className={`rounded px-2 py-1 ${activeHeading === "h1" ? "bg-accent-elevated text-accent-elevated-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
                H1
            </button>
            <button
                onClick={() => formatHeading("h2")}
                className={`rounded px-2 py-1 ${activeHeading === "h2" ? "bg-accent-elevated text-accent-elevated-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
                H2
            </button>
            <button
                onClick={() => formatHeading("h3")}
                className={`rounded px-2 py-1 ${activeHeading === "h3" ? "bg-accent-elevated text-accent-elevated-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
                H3
            </button>
        </div>
    );
}
