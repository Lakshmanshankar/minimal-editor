import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useIDBStore } from '@/provider/useIDBStore';
import { Button } from '@/components/ui/button';
import { cn, formatFileName, getFileKeyFromURL, setFileKeyInURL, resetFileKeyInURL } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SaveToIdbPlugin() {
    const [editor] = useLexicalComposerContext();
    const { addFile, files, getFile, reload } = useIDBStore();
    const [currentFile, setCurrentFile] = useState<number | null>(null);

    const saveToIdb = async () => {
        const content = JSON.stringify(editor.getEditorState().toJSON());
        const key = getFileKeyFromURL() || Date.now();
        if (key) {
            addFile(key, content);
            setFileKeyInURL(key);
            reload();
        }
    };

    const loadFile = async (key: number) => {
        const content = await getFile(key);
        if (!content) return;

        const editorState = editor.parseEditorState(JSON.parse(content));
        editor.setEditorState(editorState);
        setFileKeyInURL(key);
        setCurrentFile(key);
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
        <div>
            <Button onClick={saveToIdb} className="fixed top-2.5 right-12">
                Save to IDB
            </Button>

            <div className="fixed top-15 left-2">
                <Button
                    className='w-full'
                    onClick={() => {
                        resetFileKeyInURL();
                        window.location.reload();
                    }}
                >
                    New File
                </Button>
                <ScrollArea className="h-96 w-48 rounded-md flex flex-col p-2 gap-1">
                    {Object.keys(files).map(key => {
                        return (
                            <Button
                                key={key}
                                onClick={() => loadFile(parseInt(key))}
                                className={cn(
                                    'w-full bg-accent text-secondary-foreground mt-1 hover:bg-accent-foreground hover:text-secondary',
                                    key === currentFile?.toString() && 'bg-accent-foreground/20'
                                )}
                            >
                                {formatFileName(parseInt(key))}
                            </Button>
                        );
                    })}
                </ScrollArea>
            </div>
        </div>
    );
}
