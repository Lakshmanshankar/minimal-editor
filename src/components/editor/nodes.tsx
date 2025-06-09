import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { ColoredTextNode } from './custom-nodes/color-nodes';

export const LexicalNodes = [
    HeadingNode,
    QuoteNode,
    ListItemNode,
    ListNode,
    CodeHighlightNode,
    CodeNode,
    HorizontalRuleNode,
    LinkNode,
    AutoLinkNode,
    ColoredTextNode,
];
