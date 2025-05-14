import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { type EditorState } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { Toolbar } from "./plugins/top-toolbar";
import { theme } from "./theme";
// import {ListItemNode, ListNode } from "@lexical/list";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onError(error: any) {
    console.error(error);
}

function MyOnChangePlugin({
    onChange,
}: {
    onChange: (editorState: EditorState) => void;
}) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editorState);
        });
    }, [editor, onChange]);
    return null;
}

export function Editor() {
    const initialConfig = {
        namespace: "MyEditor",
        theme,
        onError,
        nodes: [HeadingNode, QuoteNode],
    };

    const [, setEditorState] = useState<EditorState>();
    function onChange(editorState: EditorState) {
        setEditorState(editorState);
    }

    return (
        <div>
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="editor-block"
              aria-placeholder="Type something"
              placeholder={<></>}
            />
          }
          placeholder={
            <div className="placeholder">
              Type something
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <MyOnChangePlugin onChange={onChange} />
      </LexicalComposer>

    </div>
    );
}
