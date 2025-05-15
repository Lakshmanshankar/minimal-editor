import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { Toolbar } from "./plugins/top-toolbar";
import { theme } from "./theme";
import { ListItemNode, ListNode } from "@lexical/list";
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { ORDERED_LIST, UNORDERED_LIST, HEADING, TEXT_FORMAT_TRANSFORMERS, type Transformer } from '@lexical/markdown';
const MD_TRANSFORMERS = [ORDERED_LIST, UNORDERED_LIST, HEADING, TEXT_FORMAT_TRANSFORMERS] as Transformer[]
  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onError(error: any) {
  console.error(error);
}

export function Editor() {

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [HeadingNode, QuoteNode, ListItemNode, ListNode, CodeHighlightNode, CodeNode, HorizontalRuleNode],
  };

  return (
    <div>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container">
          <Toolbar />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-block"
                  aria-placeholder="Type something"
                  placeholder={<div className="editor-placeholder">Type text or press / for commands</div>}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CheckListPlugin />
          <HorizontalRulePlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin transformers={MD_TRANSFORMERS} />
        </div>
      </LexicalComposer>

    </div>
  );
}
