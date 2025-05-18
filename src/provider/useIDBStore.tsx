import { openDB } from 'idb';
import { useCallback, useEffect, useState } from 'react';

const DB_NAME = 'no-bs-store';
const STORE_NAME = 'files';

type KV = Record<string, string>;

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

    const addFile = async (key: number, content: string) => {
        const db = await getDB();
        await db.put(STORE_NAME, content, key);
        return key;
    };

    const getFile = async (key: number) => {
        const db = await getDB();
        return db.get(STORE_NAME, key);
    };

    const updateFile = async (key: number, newContent: string) => {
        const db = await getDB();
        await db.put(STORE_NAME, newContent, key);
        await loadFiles();
    };

    const loadFiles = useCallback(async () => {
        const db = await getDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const all: KV = {};

        let cursor = await store.openCursor();
        while (cursor) {
            console.log(cursor.key, cursor.value);
            const cursorKey = cursor.key.toString();
            all[cursorKey] = cursor.value;
            cursor = await cursor.continue();
        }

        setFiles(all);
    }, []);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    return { files, addFile, updateFile, getFile, reload: loadFiles };
}
