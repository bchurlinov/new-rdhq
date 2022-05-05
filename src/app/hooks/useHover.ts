import { useState } from "react";
import { useEventListener } from "app/hooks";

export const useHover = <T extends { current: Window & typeof globalThis }>(ref: T): boolean => {
    const [hovered, setHovered] = useState<boolean>(false);

    useEventListener("mouseover", () => setHovered(true), ref.current);
    useEventListener("mouseout", () => setHovered(false), ref.current);

    return hovered;
};
