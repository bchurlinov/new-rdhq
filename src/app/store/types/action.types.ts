import { Dispatch } from "@reduxjs/toolkit";

export interface AsyncDispatch<T, K = void> {
    type: string;
    payload: K;
    meta: {
        arg: T;
        requestId: string;
        requestStatus: "pending" | "fulfilled" | "rejected";
    };
}

export type AsyncThunkConfig = {
    state?: any;
    dispatch: Dispatch;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
    rejectWithValue: any;
    getState?: any;
};
