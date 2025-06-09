import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
    $getSelection, 
    $isRangeSelection, 
    COMMAND_PRIORITY_EDITOR,
    type LexicalCommand,
    createCommand,
} from 'lexical';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { defaultColorConfig } from '../custom-nodes/color-system';
import { $createColoredTextNode, $isColoredTextNode } from '../custom-nodes/color-nodes';
import { $createTextNode } from 'lexical';

export type ColorNodeCommandPayload = {
    colorId: string;
    type: 'text' | 'background';
};

// eslint-disable-next-line react-refresh/only-export-components
export const INSERT_COLOR_NODE_COMMAND: LexicalCommand<ColorNodeCommandPayload> = createCommand('INSERT_COLOR_NODE_COMMAND');

export function ColorNodePlugin() {
    const [editor] = useLexicalComposerContext();
    const [currentColor, setCurrentColor] = useState<{ colorId: string; type: 'text' | 'background' } | null>(null);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const nodes = selection.getNodes();
                    const coloredNode = nodes.find((node) => $isColoredTextNode(node));
                    if (coloredNode && $isColoredTextNode(coloredNode)) {
                        setCurrentColor({ colorId: coloredNode.__highlightColor, type: coloredNode.__colorType });
                    } else {
                        setCurrentColor(null);
                    }
                } else {
                    setCurrentColor(null);
                }
            });
        });
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            INSERT_COLOR_NODE_COMMAND,
            ({ colorId, type }) => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const nodes = selection.getNodes();
                    let shouldUnwrap = false;

                    if (
                        nodes.length > 0 &&
                        nodes.every(
                            (node) =>
                                $isColoredTextNode(node) &&
                                node.__highlightColor === colorId &&
                                node.__colorType === type
                        )
                    ) {
                        shouldUnwrap = true;
                    }

                    if (shouldUnwrap) {
                        nodes.forEach((node) => {
                            if ($isColoredTextNode(node)) {
                                node.replace($createTextNode(node.getTextContent()));
                            }
                        });
                    } else {
                        selection.insertNodes([
                            $createColoredTextNode(selection.getTextContent(), colorId, type)
                        ]);
                    }
                    return true;
                }
                return false;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className='bg-rosewater'>
                    <span className="icon ">A</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-4 border border-gray-200">
                
                {/* Text color */}
                <div className="mb-2">
                    <div className="text-sm mb-2">Text color</div>
                    <div className="grid grid-cols-4 gap-2">
                        {defaultColorConfig.text.map((color) => (
                            <button
                                key={color.id}
                                className={`w-8 h-8 rounded border flex items-center justify-center ${color.id} ${currentColor && currentColor.colorId === color.id && currentColor.type === 'text' ? 'border-2' : 'border'}`}
                                onClick={() => {
                                    editor.dispatchCommand(INSERT_COLOR_NODE_COMMAND, {
                                        colorId: color.id,
                                        type: 'text'
                                    });
                                }}
                                title={color.name}
                                aria-label={color.name}
                            >
                                <span className="font-bold">A</span>
                            </button>
                        ))}
                    </div>
                </div>
                {/* Background color */}
                <div>
                <div className="text-sm mb-2 mt-2">Background color</div>
                <div className="grid grid-cols-4 gap-2">
                        {defaultColorConfig.background.map((color) => (
                            <button
                                key={color.id}
                                className={`w-8 h-8 rounded border ${color.id} ${currentColor && currentColor.colorId === color.id && currentColor.type === 'background' ? 'border-2 border-gray-200' : 'border border-gray-200'}`}
                                onClick={() => {
                                    editor.dispatchCommand(INSERT_COLOR_NODE_COMMAND, {
                                        colorId: color.id,
                                        type: 'background'
                                    });
                                }}
                                title={color.name}
                                aria-label={color.name}
                            />
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}