import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_NORMAL, $createTextNode } from 'lexical'
import { createCommand } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import { $createLinkNode, $isLinkNode, LinkNode, $toggleLink} from '@lexical/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";

export function LinkEditorPlugin() {
    const [editor] = useLexicalComposerContext();
    const [linkUrl, setLinkUrl] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const INSERT_LINK_COMMAND = createCommand<{ url: string }>('INSERT_LINK_COMMAND');

    const handleLinkButtonClick = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || selection.isCollapsed()) {
                setLinkUrl('');
                setIsEditing(false);
                return;
            }
            const nodes = selection.getNodes();
            // First try to find if we're directly in a link node
            let linkNode = nodes.find((node): node is LinkNode => $isLinkNode(node));
            // If not, check if any of the nodes have a link parent
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

        const unregisterCommand = editor.registerCommand(INSERT_LINK_COMMAND, (payload) => {
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
        }, COMMAND_PRIORITY_NORMAL);

        const unregisterNodeTransform = editor.registerNodeTransform(LinkNode, (linkNode: LinkNode) => {
            const previousSibling = linkNode.getPreviousSibling();
            if ($isLinkNode(previousSibling) && previousSibling.getURL() === linkNode.getURL()) {
                previousSibling.append(...linkNode.getChildren());
                linkNode.remove();
            }
        });

        return () => {
            unregisterCommand();
            unregisterNodeTransform();
        }
    }, [editor]);

    return (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleLinkButtonClick}
                >
                    <Link className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div className="space-y-2">
                    <Label htmlFor="link-url">URL</Label>
                    <Input
                        id="link-url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="Enter URL"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleLinkCreation();
                            }
                        }}
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleLinkCreation}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
