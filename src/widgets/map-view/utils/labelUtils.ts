export const sanitizeVenueName = (name: string): string => {
    if (!name) return '';
    if (name === name.toUpperCase() && name.length > 3) {
        name = name.charAt(0) + name.slice(1).toLowerCase();
    }

    const words = name.split(/\s+/);

    if (words.length >= 2 && name.length > 10) {
        const mid = Math.ceil(words.length / 2);
        const line1 = words.slice(0, mid).join(' ');
        const line2 = words.slice(mid).join(' ');

        return `${line1}\n${line2}`;
    }

    return name;
};
