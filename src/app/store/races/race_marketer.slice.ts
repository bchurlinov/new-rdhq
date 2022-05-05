import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "app/store";
import {
    getAsyncMarketerReport,
    postAsyncOrganisationDetails,
} from "app/store/races/race_marketer.actions";
import { InitialRaceMarketerSliceStateType, RaceReportType } from "app/store/races/races.types";

const initialState: InitialRaceMarketerSliceStateType = {
    reportIsLoading: true,
    report: {},
    reportHasUpdated: false,
    error: false,
};

export const RaceMarketerSlice = createSlice({
    name: "races_marketer",
    initialState,
    reducers: {
        // flushRacesStore: (): InitialRacesStateType => initialState,
        updateReportHasUpdated: (state: InitialRaceMarketerSliceStateType): void => {
            state.reportHasUpdated = false;
        },
    },
    extraReducers: {
        [getAsyncMarketerReport.pending]: (state: InitialRaceMarketerSliceStateType): void => {
            state.reportIsLoading = true;
            state.report = {};
            state.error = false;
        },
        [getAsyncMarketerReport.fulfilled]: (
            state: InitialRaceMarketerSliceStateType,
            action: PayloadAction<RaceReportType>
        ): void => {
            state.reportIsLoading = false;
            state.report = action.payload;
        },
        [postAsyncOrganisationDetails.fulfilled]: (
            state: InitialRaceMarketerSliceStateType,
            action: PayloadAction<RaceReportType>
        ): void => {
            state.report = action.payload;
            state.reportHasUpdated = true;
        },
        [getAsyncMarketerReport.rejected]: (state: InitialRaceMarketerSliceStateType): void => {
            state.reportIsLoading = false;
            state.error = true;
        },
    },
});

export const raceMarketerState = (state: AppState) => state.races;
export const { updateReportHasUpdated } = RaceMarketerSlice.actions;

export default RaceMarketerSlice.reducer;
