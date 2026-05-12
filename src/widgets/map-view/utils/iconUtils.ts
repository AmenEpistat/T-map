type IconType = {
    filename: string;
    frame: { x: number; y: number; w: number; h: number };
    rotated: boolean;
    trimmed: boolean;
};

export const getIconMapping = (icons: { frames: IconType[] }) => {
    return icons.frames.reduce(
        (acc, value) => {
            const cleanKey = value.filename.replace('.svg', '');
            acc[cleanKey] = {
                x: value.frame.x,
                y: value.frame.y,
                width: value.frame.w,
                height: value.frame.h,
                anchorY: value.frame.h,
                anchorX: value.frame.w,
                mask: false,
            };

            return acc;
        },
        {} as Record<string, any>
    );
};
