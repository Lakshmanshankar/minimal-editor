import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_NORMAL,
    $createTextNode,
} from 'lexical';
import { createCommand } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import {
    $createLinkNode,
    $isLinkNode,
    LinkNode,
    $toggleLink,
} from '@lexical/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export function LinkEditorPlugin() {
    const [editor] = useLexicalComposerContext();
    const [linkUrl, setLinkUrl] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const INSERT_LINK_COMMAND = createCommand<{ url: string }>(
        'INSERT_LINK_COMMAND'
    );

    const handleLinkButtonClick = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || selection.isCollapsed()) {
                setLinkUrl('');
                setIsEditing(false);
                return;
            }

            const nodes = selection.getNodes();
            let linkNode = nodes.find((node): node is LinkNode =>
                $isLinkNode(node)
            );
            if (!linkNode) {
                const nodeWithLinkParent = nodes.find(node => {
                    const parent = node.getParent();
                    return parent && $isLinkNode(parent);
                });
                if (nodeWithLinkParent) {
                    const parent = nodeWithLinkParent.getParent();
                    if (parent && $isLinkNode(parent)) {
                        linkNode = parent;
                    }
                }
            }

            if (linkNode) {
                setLinkUrl(linkNode.getURL());
            } else {
                setLinkUrl('');
            }
            setIsEditing(true);
        });
    }, [editor]);

    const handleLinkCreation = useCallback(() => {
        editor.update(() => {
            $toggleLink(linkUrl.trim() || null);
        });
        setIsEditing(false);
        setLinkUrl('');
    }, [editor, linkUrl]);

    useEffect(() => {
        if (!editor) return;

        const unregisterCommand = editor.registerCommand(
            INSERT_LINK_COMMAND,
            payload => {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        const text = selection.getTextContent();
                        const linkNode = $createLinkNode(payload.url);
                        const textNode = $createTextNode(text);
                        linkNode.append(textNode);
                        selection.insertNodes([linkNode]);
                    }
                });
                return true;
            },
            COMMAND_PRIORITY_NORMAL
        );

        const unregisterNodeTransform = editor.registerNodeTransform(
            LinkNode,
            (linkNode: LinkNode) => {
                const previousSibling = linkNode.getPreviousSibling();
                if (
                    $isLinkNode(previousSibling) &&
                    previousSibling.getURL() === linkNode.getURL()
                ) {
                    previousSibling.append(...linkNode.getChildren());
                    linkNode.remove();
                }
            }
        );

        return () => {
            unregisterCommand();
            unregisterNodeTransform();
        };
    }, [editor]);

    return (
        <Popover open={isEditing} onOpenChange={setIsEditing}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleLinkButtonClick}
                >
                    <Link className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-auto p-2 border border-accent rounded-lg"
                sideOffset={10}
            >
                <div className="flex items-center gap-2">
                    <Label htmlFor="link-url" className="sr-only">
                        URL
                    </Label>
                    <Input
                        id="link-url"
                        value={linkUrl}
                        onChange={e => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleLinkCreation();
                            }
                        }}
                        className="h-8"
                    />
                    <Button
                        onClick={handleLinkCreation}
                        size="sm"
                        className="h-8"
                    >
                        Save
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
