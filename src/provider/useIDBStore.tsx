import { openDB } from 'idb';
import { useCallback, useEffect, useState } from 'react';

const DB_NAME = 'no-bs-store';
const STORE_NAME = 'files';

type File = {
    name: string;
    content: string;
};
type KV = Record<string, File>;

export function useIDBStore() {
    const [files, setFiles] = useState<KV>({});

    const getDB = async () => {
        return openDB(DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            },
        });
    };

    const setFile = async (key: number, content: string) => {
        const db = await getDB();
        let fname = await getFileName(key);
        if (!fname) {
            fname = 'Untitled';
        }
        const data: File = {
            content,
            name: fname || 'Untitled',
        };
        await db.put(STORE_NAME, data, key);
        loadFiles();
        return;
    };

    const getFile = async (key: number) => {
        const db = await getDB();
        return db.get(STORE_NAME, key);
    };

    const removeFile = async (key: number) => {
        const db = await getDB();
        await db.delete(STORE_NAME, key);
        await loadFiles();
    };

    const getFileName = async (key: number) => {
        const file = await getFile(key);
        if (!file) {
            return;
        }
        return file.name;
    };

    const updateFileName = async (key: number, newName: string) => {
        const db = await getDB();
        const file = await getFile(key);
        if (!file) {
            return;
        }
        const data: File = {
            name: newName,
            content: file.content,
        };
        await db.put(STORE_NAME, data, key);
        await loadFiles();
    };

    const loadFiles = useCallback(async () => {
        const db = await getDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const all: KV = {};

        let cursor = await store.openCursor();
        while (cursor && cursor.value) {
            const cursorKey = cursor.key.toString();
            all[cursorKey] = cursor.value;
            cursor = await cursor.continue();
        }
        setFiles(all);
    }, []);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    return {
        files,
        setFile,
        getFile,
        reload: loadFiles,
        updateFileName,
        removeFile,
    };
}
