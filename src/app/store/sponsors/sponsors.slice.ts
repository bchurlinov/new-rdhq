import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "app/store";
import { SponsorType } from "app/types/sponsors/sponsor.types";
import { InitialSponsorsStateType } from "./sponsors.types";
import { getAsyncSponsors } from "./sponsors.actions";

const initialState: InitialSponsorsStateType = {
    sponsors: [],
    isLoading: false,
    current: 0,
    error: "",
};

export const SponsorsSlice = createSlice({
    name: "sponsors",
    initialState,
    reducers: { flushSponsorsStore: () => initialState },
    extraReducers: {
        [getAsyncSponsors.pending]: (state: InitialSponsorsStateType, action): void => {
            state.error = "";
            state.current = action.meta.arg.pk;
            state.isLoading = true;
        },
        [getAsyncSponsors.fulfilled]: (
            state: InitialSponsorsStateType,
            action: PayloadAction<SponsorType[]>
        ): void => {
            state.isLoading = false;
            state.sponsors = action.payload;
        },
        [getAsyncSponsors.rejected]: (
            state: InitialSponsorsStateType,
            action: PayloadAction<string>
        ): void => {
            state.isLoading = false;
            state.error = action.payload || "Something went wrong, please try again.";
        },
    },
});

export const sponsorsState = (state: AppState) => state.sponsors;
export const { flushSponsorsStore } = SponsorsSlice.actions;

export default SponsorsSlice.reducer;
