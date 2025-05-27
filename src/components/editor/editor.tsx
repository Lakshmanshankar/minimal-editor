// import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';

import { SaveToIdbPlugin } from '@/components/editor/plugins/save-to-idb';
import { MATCHERS } from './plugins/auto-link-plugin';
import { MD_TRANSFORMERS } from './plugins/markdown-plugin';
import { LexicalNodes } from './nodes';
import { theme } from './theme';
import { LinkEditorPlugin } from './plugins/link-editor-plugin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onError(error: any) {
    console.error(error);
}

export function Editor() {
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
        nodes: LexicalNodes,
    };

    return (
        <div className="my-10 mt-20">
            <div>
                <LexicalComposer initialConfig={initialConfig}>
                    <SaveToIdbPlugin />
                    <LinkEditorPlugin />
                    <div className="editor-container">
                        <div className="relative">
                            <RichTextPlugin
                                contentEditable={
                                    <ContentEditable
                                        className="editor-block"
                                        spellCheck={false}
                                        aria-placeholder="Type something"
                                        placeholder={<div className="editor-placeholder">Just start typing</div>}
                                    />
                                }
                                ErrorBoundary={LexicalErrorBoundary}
                            />
                        </div>
                        <HistoryPlugin />
                        {/* <AutoFocusPlugin /> */}
                        <HorizontalRulePlugin />
                        <ListPlugin hasStrictIndent={true} />
                        <LinkPlugin />
                        <CheckListPlugin />
                        <AutoLinkPlugin matchers={MATCHERS} />
                        <TabIndentationPlugin />
                        <MarkdownShortcutPlugin transformers={MD_TRANSFORMERS} />
                    </div>
                </LexicalComposer>
            </div>
        </div>
    );
}
