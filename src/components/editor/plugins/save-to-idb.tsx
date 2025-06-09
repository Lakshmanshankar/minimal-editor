import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useIDBStore } from '@/provider/useIDBStore';
import { Button } from '@/components/ui/button';
import {
    cn,
    getFileKeyFromURL,
    setFileKeyInURL,
    resetFileKeyInURL,
} from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DEFAULT_ROOT } from './default-editor';

export function SaveToIdbPlugin() {
    const [editor] = useLexicalComposerContext();
    const { files, setFile, getFile, reload, updateFileName, removeFile } =
        useIDBStore();
    const [currentFile, setCurrentFile] = useState<number | null>(null);
    const [currentFileName, setCurrentFileName] = useState<string>('');

    const saveToIdb = async () => {
        const content = JSON.stringify(editor.getEditorState().toJSON());
        const key = getFileKeyFromURL() || Date.now();
        if (key) {
            setFile(key, content);
            setFileKeyInURL(key);
            reload();
        }
    };

    const loadFile = async (key: number) => {
        let content = await getFile(key);
        console.log(content, 'CONNTE');
        if (!content) return;
        if (content.content) {
            content = content.content;
        }
        const editorState = editor.parseEditorState(content);
        editor.setEditorState(editorState);
        setFileKeyInURL(key);
        setCurrentFile(key);
    };

    const resetEditor = async (fileId: number) => {
        removeFile(fileId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const editorState = editor.parseEditorState(DEFAULT_ROOT as any);
        editor.setEditorState(editorState);
        setCurrentFile(null);
    };

    useEffect(() => {
        if (!editor) return;
        const key = getFileKeyFromURL();
        if (!key) return;
        loadFile(key);
        setCurrentFile(key);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="shadow-md">
            <Button onClick={saveToIdb} className="fixed top-2.5 right-12">
                Save to Local
            </Button>

            <div className="fixed top-20 left-0 h-[600px] w-56 border-none p-3 flex flex-col gap-3">
                <Button
                    className="w-full p-0.5 h-8 text-sm"
                    onClick={() => {
                        resetFileKeyInURL();
                        window.location.reload();
                    }}
                >
                    New File
                </Button>
                <ScrollArea className="hidden lg:block h-[500px] w-full rounded-md">
                    <div className="pr-3 space-y-2">
                        {Object.keys(files).map(key => (
                            <button
                                key={key}
                                className={cn(
                                    `w-[200px] flex items-center justify-between rounded-md p-1 hover:bg-accent group cursor-pointer`,
                                    key === currentFile?.toString() &&
                                        'bg-accent/80'
                                )}
                                onClick={() => loadFile(parseInt(key))}
                            >
                                <div className="text-sm flex items-center px-1 w-[calc(100%-32px)] overflow-hidden text-ellipsis whitespace-nowrap">
                                    {files[key]?.name || 'Untitled'}
                                </div>
                                <Dialog>
                                    <DialogTrigger
                                        asChild
                                        className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 mr-2"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setCurrentFileName(
                                                files[key]?.name
                                            );
                                        }}
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[400px] gap-0 border-none rounded-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-md">
                                                Edit File
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-4 py-3">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="fileName"
                                                    className="font-normal"
                                                >
                                                    File Name
                                                </Label>
                                                <Input
                                                    id="fileName"
                                                    value={currentFileName}
                                                    onChange={e =>
                                                        setCurrentFileName(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            updateFileName(
                                                                parseInt(key),
                                                                currentFileName
                                                            );
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter className="flex justify-between mt-2">
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    resetEditor(parseInt(key));
                                                }}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    updateFileName(
                                                        parseInt(key),
                                                        currentFileName
                                                    );
                                                }}
                                            >
                                                Update
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
