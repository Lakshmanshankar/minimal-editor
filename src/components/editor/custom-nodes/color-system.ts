export interface ColorDefinition {
    id: string;
    name: string;
    code: string;
}

export interface ColorMap {
    text: ColorDefinition[];
    background: ColorDefinition[];
}

export class ColorSystem {
    private colors: ColorMap;

    constructor(initialColors: ColorMap) {
        this.colors = initialColors;
    }

    /**
     * Add a new color to the system
     */
    addColor(type: 'text' | 'background', color: ColorDefinition): void {
        const existingIndex = this.colors[type].findIndex(
            c => c.id === color.id
        );
        if (existingIndex !== -1) {
            throw new Error(
                `Color with ID '${color.id}' already exists. Use updateColor to modify existing colors.`
            );
        }

        if (!this.isValidColorCode(color.code)) {
            throw new Error(`Invalid color code: ${color.code}`);
        }

        this.colors[type].push({ ...color });
    }

    /**
     * List all colors of a specific type
     */
    listColors(type: 'text' | 'background'): ColorDefinition[] {
        return [...this.colors[type]];
    }

    /**
     * List all colors
     */
    getAllColors(): ColorMap {
        return {
            text: [...this.colors.text],
            background: [...this.colors.background],
        };
    }

    /**
     * Update an existing color by ID
     */
    updateColor(
        type: 'text' | 'background',
        id: string,
        updates: Partial<Omit<ColorDefinition, 'id'>>
    ): boolean {
        const colorIndex = this.colors[type].findIndex(c => c.id === id);
        if (colorIndex === -1) {
            return false;
        }

        const currentColor = this.colors[type][colorIndex];
        const updatedColor = { ...currentColor, ...updates };

        // Validate color code if it's being updated
        if (updates.code && !this.isValidColorCode(updates.code)) {
            throw new Error(`Invalid color code: ${updates.code}`);
        }

        this.colors[type][colorIndex] = updatedColor;
        return true;
    }

    /**
     * Remove a color by ID
     */
    removeColor(type: 'text' | 'background', id: string): boolean {
        const colorIndex = this.colors[type].findIndex(c => c.id === id);
        if (colorIndex === -1) {
            return false;
        }

        this.colors[type].splice(colorIndex, 1);
        return true;
    }

    /**
     * Generate CSS classes for all colors
     */
    generateCSSClasses(): string {
        const textClasses = this.colors.text
            .map(color => `.${color.id} { color: ${color.code}; }`)
            .join('\n');

        const backgroundClasses = this.colors.background
            .map(color => `.${color.id} { background-color: ${color.code}; }`)
            .join('\n');

        console.log(textClasses);
        console.log(backgroundClasses);
        return `${textClasses}\n${backgroundClasses}`;
    }

    /**
     * Export colors as JSON
     */
    exportColors(): string {
        return JSON.stringify(this.colors, null, 2);
    }

    /**
     * Import colors from JSON
     */
    importColors(jsonString: string): void {
        try {
            const importedColors = JSON.parse(jsonString) as ColorMap;

            if (!importedColors.text || !importedColors.background) {
                throw new Error('Invalid color map structure');
            }

            [...importedColors.text, ...importedColors.background].forEach(
                color => {
                    if (!color.id || !color.name || !color.code) {
                        throw new Error('Invalid color definition');
                    }
                    if (!this.isValidColorCode(color.code)) {
                        throw new Error(`Invalid color code: ${color.code}`);
                    }
                }
            );

            this.colors = importedColors;
        } catch (error) {
            throw new Error(
                `Failed to import colors: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Validate color code format
     */
    private isValidColorCode(code: string): boolean {
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(code)) {
            return true;
        }

        if (
            /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/.test(
                code
            )
        ) {
            return true;
        }

        if (
            /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/.test(
                code
            )
        ) {
            return true;
        }

        // Check for basic color names
        const cssColorNames = [
            'black',
            'white',
            'red',
            'green',
            'blue',
            'yellow',
            'cyan',
            'magenta',
            'gray',
            'grey',
            'orange',
            'purple',
            'pink',
            'brown',
            'transparent',
        ];

        return cssColorNames.includes(code.toLowerCase());
    }
}

export const defaultColorConfig: ColorMap = {
    text: [
        { id: 'text-obsidian', name: 'Obsidian', code: '#000000' },
        { id: 'text-gray-slate', name: 'Slate', code: '#374151' },
        { id: 'text-iron', name: 'Iron', code: '#6b7280' },
        { id: 'text-cobalt', name: 'Cobalt', code: '#2563eb' },
        { id: 'text-crimson', name: 'Crimson', code: '#dc2626' },
        { id: 'text-emerald', name: 'Emerald', code: '#16a34a' },
        { id: 'text-amethyst', name: 'Amethyst', code: '#9333ea' },
        { id: 'text-tiger', name: 'Tiger', code: '#ea580c' },
    ],
    background: [
        { id: 'bg-ivory', name: 'Ivory', code: '#ffffff' },
        { id: 'bg-whisper', name: 'Whisper', code: '#f9fafb' },
        { id: 'bg-porcelain', name: 'Porcelain', code: '#f3f4f6' },
        { id: 'bg-serenity', name: 'Serenity', code: '#eff6ff' },
        { id: 'bg-rosewater', name: 'Rosewater', code: '#fef2f2' },
        { id: 'bg-mint', name: 'Mint', code: '#f0fdf4' },
        { id: 'bg-lilac', name: 'Lilac', code: '#faf5ff' },
        { id: 'bg-daffodil', name: 'Daffodil', code: '#fefce8' },
    ],
};

export const defaultColorSystem = new ColorSystem(defaultColorConfig);
