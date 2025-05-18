import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const setFileKeyInURL = (key: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('file', key.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
};

export const getFileKeyFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('file');
    return key ? parseInt(key) : null;
};

export const resetFileKeyInURL = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('file');
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
};

export const formatFileName = (timestamp: number): string => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    };
    return `${date.toLocaleString(undefined, options)}`;
};
