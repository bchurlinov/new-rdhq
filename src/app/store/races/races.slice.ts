import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "app/store";
import {
    CurrentRaceType,
    InitialRacesStateType,
    RaceFormDataTypes,
} from "app/store/races/races.types";
import { RaceImportType, RaceType, WidgetRaceType } from "app/types/races/race.types";
import {
    getAsyncRaces,
    getAsyncWidgetRaces,
    importAsyncRace,
    getAsyncRaceFormData,
    getAsyncRaceDetails,
    createAsyncRace,
    deleteAsyncRace,
} from "./races.actions";

/**
 * TODO Add error scenario on both Widget and Races routes
 */

const initialState: InitialRacesStateType = {
    racesWidget: {
        isLoading: false,
        races: [],
    },
    currentRace: {},
    races: {
        upcoming: {
            isLoading: true,
            results: [],
            page: null,
            count: 0,
        },
        past: {
            isLoading: true,
            results: [],
            page: null,
            count: 0,
        },
    },
    importedRace: {
        isLoading: false,
        error: "",
        race: {},
    },
    raceFormData: {
        isLoading: false,
        error: false,
        data: {},
    },
    raceDetail: {
        data: {},
        isLoading: false,
        error: false,
    },
};

export const RacesSlice = createSlice({
    name: "races",
    initialState,
    reducers: {
        flushRacesStore: (): InitialRacesStateType => initialState,
        setCurrentRace: (
            state: InitialRacesStateType,
            action: PayloadAction<CurrentRaceType>
        ): void => {
            state.currentRace = action.payload;
        },
        deleteRace: (
            state: InitialRacesStateType,
            action: PayloadAction<{ pk: number; raceType: "upcoming" | "past" }>
        ): void => {
            state.racesWidget.races = state.racesWidget.races.filter(
                (race: WidgetRaceType) => race.pk !== action.payload.pk
            );

            state.races[action.payload.raceType].results = state.races[
                action.payload.raceType
            ].results.filter((race: RaceType) => race.pk !== action.payload.pk);

            if (state.currentRace && state.currentRace.pk === action.payload.pk) {
                state.currentRace = {};
            }
        },
        clearRaceDetail: (state: InitialRacesStateType): void => {
            state.raceDetail.data = {};
        },
        clearRaceImportError: (state: InitialRacesStateType): void => {
            state.importedRace.error = "";
        },
    },
    extraReducers: {
        [getAsyncWidgetRaces.pending]: (state: InitialRacesStateType): void => {
            state.racesWidget.isLoading = true;
        },
        [getAsyncWidgetRaces.fulfilled]: (
            state: InitialRacesStateType,
            action: PayloadAction<any>
        ): void => {
            state.racesWidget.isLoading = false;
            state.racesWidget.races = action.payload;
        },
        [getAsyncRaces.pending]: (state: InitialRacesStateType, action): void => {
            state.races[action.meta.arg.filter].page = action.meta.arg.page;
            state.races[action.meta.arg.filter].isLoading = true;
        },
        [getAsyncRaces.fulfilled]: (state: InitialRacesStateType, action): void => {
            state.races[action.meta.arg.filter].isLoading = false;
            state.races[action.meta.arg.filter].results = action.payload.results;
            state.races[action.meta.arg.filter].count = action.payload.count;
        },
        [importAsyncRace.pending]: (state: InitialRacesStateType): void => {
            state.importedRace.error = "";
            state.importedRace.isLoading = true;
        },
        [importAsyncRace.fulfilled]: (
            state: InitialRacesStateType,
            action: PayloadAction<RaceImportType>
        ): void => {
            state.importedRace.error = "";
            state.importedRace.isLoading = false;
            state.importedRace.race = action.payload;
        },
        [importAsyncRace.rejected]: (state: InitialRacesStateType, action: any): void => {
            state.importedRace.isLoading = false;
            if (!Reflect.has(action?.meta?.arg, "fromPageImport"))
                state.importedRace.error = action.payload;
        },
        [getAsyncRaceFormData.pending]: (state: InitialRacesStateType): void => {
            state.raceFormData.isLoading = true;
            state.raceFormData.error = false;
        },
        [getAsyncRaceFormData.fulfilled]: (
            state: InitialRacesStateType,
            action: PayloadAction<RaceFormDataTypes>
        ): void => {
            state.raceFormData.isLoading = false;
            state.raceFormData.data = action.payload;
        },
        [getAsyncRaceDetails.pending]: (state: InitialRacesStateType): void => {
            state.raceDetail.isLoading = true;
        },
        [getAsyncRaceDetails.fulfilled]: (
            state: InitialRacesStateType,
            action: PayloadAction<any>
        ): void => {
            state.raceDetail.isLoading = false;
            state.raceDetail.data = action.payload;
        },
        [createAsyncRace.fulfilled]: (
            state: InitialRacesStateType,
            action: PayloadAction<RaceType>
        ): void => {
            const { pk, name, display_date, city_state, logo, listed } = action.payload;
            const raceToAdd: Omit<
                Pick<RaceType, "pk" | "name" | "display_date" | "city_state" | "logo" | "listed">,
                "type"
            > = {
                pk,
                name,
                display_date,
                city_state,
                logo,
                listed,
            };

            state.races.upcoming.results = [...state.races.upcoming.results, raceToAdd];
        },
        [deleteAsyncRace.pending]: (state: InitialRacesStateType): void => {
            state.racesWidget.isLoading = true;
        },
        [deleteAsyncRace.fulfilled]: (state: InitialRacesStateType): void => {
            state.racesWidget.isLoading = false;
        },
    },
});

export const racesState = (state: AppState) => state.races;
export const {
    flushRacesStore,
    setCurrentRace,
    deleteRace,
    clearRaceDetail,
    clearRaceImportError,
} = RacesSlice.actions;

export default RacesSlice.reducer;
