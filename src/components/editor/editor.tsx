import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
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

import { MATCHERS } from './plugins/auto-link-plugin';
import { Toolbar } from './plugins/top-toolbar';
import { MD_TRANSFORMERS } from './plugins/markdown-plugin';
import { LexicalNodes } from './nodes';
import { theme } from './theme';

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
                                    placeholder={
                                        <div className="editor-placeholder">Type text or press / for commands</div>
                                    }
                                />
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                    </div>
                    <HistoryPlugin />
                    <AutoFocusPlugin />
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
    );
}
