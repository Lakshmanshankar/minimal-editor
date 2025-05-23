import {
    ORDERED_LIST,
    UNORDERED_LIST,
    HEADING,
    TEXT_FORMAT_TRANSFORMERS,
    QUOTE,
    CHECK_LIST,
    type Transformer,
    type ElementTransformer,
} from '@lexical/markdown';
import {
    $createHorizontalRuleNode,
    $isHorizontalRuleNode,
    HorizontalRuleNode,
} from '@lexical/react/LexicalHorizontalRuleNode';
import type { LexicalNode } from 'lexical';

export const HR: ElementTransformer = {
    dependencies: [HorizontalRuleNode],
    export: (node: LexicalNode) => {
        return $isHorizontalRuleNode(node) ? '***' : null;
    },
    regExp: /^(\*\*\*|---|___)\s?$/,
    replace: (parentNode, _1, _2, isImport) => {
        console.log('replace', parentNode, _1, _2, isImport);
        const line = $createHorizontalRuleNode();

        if (isImport || parentNode.getNextSibling() != null) {
            parentNode.replace(line);
        } else {
            parentNode.insertBefore(line);
        }

        line.selectNext();
    },
    type: 'element',
};
export const MD_TRANSFORMERS = [
    ORDERED_LIST,
    UNORDERED_LIST,
    HEADING,
    TEXT_FORMAT_TRANSFORMERS,
    QUOTE,
    HR,
    CHECK_LIST,
] as Transformer[];
