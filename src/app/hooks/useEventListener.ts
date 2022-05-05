import { useRef, useEffect } from "react";

type EventType =
    | "click"
    | "keydown"
    | "change"
    | "focus"
    | "keyup"
    | "mouseover"
    | "mouseleave"
    | "mouseout";

export const useEventListener = (
    eventType: EventType,
    callback: (event: Event | MouseEvent | KeyboardEvent | FocusEvent) => void,
    element: any = window
): void => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (element == null) return undefined;

        const handler = (event: Event) => {
            callbackRef.current(event);
        };

        element.addEventListener(eventType, handler);

        return () => {
            element.removeEventListener(eventType, handler);
        };
    }, [eventType, element]);
};
