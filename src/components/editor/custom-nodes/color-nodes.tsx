import { defaultColorConfig } from './color-system';

import {
    TextNode,
    type EditorConfig,
    type LexicalNode,
    type NodeKey,
    type SerializedTextNode,
    type Spread,
} from 'lexical';

export type SerializedHighlightedTextNode = Spread<
    {
        highlightColor: string;
    },
    SerializedTextNode
>;

export class HighlightedTextNode extends TextNode {
    __highlightColor: string;

    static getType(): string {
        return 'highlighted-text';
    }

    static clone(node: HighlightedTextNode): HighlightedTextNode {
        return new HighlightedTextNode(
            node.getTextContent(),
            node.__highlightColor,
            node.getKey()
        );
    }

    constructor(text: string, highlightColor = 'yellow', key?: NodeKey) {
        super(text, key);
        this.__highlightColor = highlightColor;
        this.setMode('token');
    }

    createDOM(config: EditorConfig): HTMLElement {
        const dom = super.createDOM(config);
        dom.classList.add('highlighted-text-node');
        dom.style.backgroundColor = this.__highlightColor;
        dom.dataset.highlightColor = this.__highlightColor;
        return dom;
    }

    updateDOM(prev: HighlightedTextNode, dom: HTMLElement): boolean {
        const superUpdated = super.updateDOM(prev, dom);

        if (prev.__highlightColor !== this.__highlightColor) {
            dom.style.backgroundColor = this.__highlightColor;
            dom.dataset.highlightColor = this.__highlightColor;
        }

        // Return true if the DOM was already updated by TextNode's updateDOM
        return superUpdated;
    }

    static importJSON(
        node: SerializedHighlightedTextNode
    ): HighlightedTextNode {
        const instance = $createHighlightedTextNode(
            node.text,
            node.highlightColor
        );
        instance.setFormat(node.format);
        instance.setDetail(node.detail);
        instance.setMode(node.mode);
        instance.setStyle(node.style);
        return instance;
    }

    exportJSON(): SerializedHighlightedTextNode {
        return {
            ...super.exportJSON(),
            highlightColor: this.__highlightColor,
            type: 'highlighted-text',
            version: 1,
        };
    }

    setHighlightColor(color: string): this {
        const writable = this.getWritable();
        writable.__highlightColor = color;
        return writable;
    }

    getHighlightColor(): string {
        return this.__highlightColor;
    }

    // Add this method to properly handle text content updates
    updateText(text: string): this {
        return super.updateText(text);
    }
}

export function $createHighlightedTextNode(
    text: string,
    highlightColor = 'yellow'
): HighlightedTextNode {
    return new HighlightedTextNode(text, highlightColor);
}

export function $isHighlightedTextNode(
    node: LexicalNode | null | undefined
): node is HighlightedTextNode {
    return node instanceof HighlightedTextNode;
}
