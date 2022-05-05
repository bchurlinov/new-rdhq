import { useEventListener } from "app/hooks/useEventListener";

export const useClickOutside = (ref: any, cb: any) => {
    useEventListener(
        "click",
        (event: any) => {
            if (ref.current == null || ref.current.contains(event.target)) return;
            cb(event);
        },
        document as any
    );
};
