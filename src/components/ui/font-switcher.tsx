import { useState, useEffect } from 'react';
import { Button } from './button';

export function FontSwitcher() {
    const [currentFont, setCurrentFont] = useState<'inter' | 'geist'>('inter');

    useEffect(() => {
        // Apply font class to document body
        document.body.classList.remove('font-inter', 'font-geist');
        document.body.classList.add(`font-${currentFont}`);
    }, [currentFont]);

    const toggleFont = () => {
        setCurrentFont(prev => prev === 'inter' ? 'geist' : 'inter');
    };

    return (
        <Button
            onClick={toggleFont}
            variant="outline"
            size="sm"
            className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm"
        >
            {currentFont === 'inter' ? 'Switch to Geist' : 'Switch to Inter'}
        </Button>
    );
} 