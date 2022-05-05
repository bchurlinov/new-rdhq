import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "app/store";
import { InitialMiscStateType } from "app/store/misc/misc.types";

const initialState: InitialMiscStateType = {
    modals: {
        membersProgram: {
            isVisible: false,
        },
        noListingCredits: {
            isVisible: false,
        },
        importRaceModal: {
            isVisible: false,
        },
        raceDetailsModal: {
            isVisible: false,
        },
    },
};

export const MiscSlice = createSlice({
    name: "misc",
    initialState,
    reducers: {
        toggleMembersProgramModal: (state: InitialMiscStateType): void => {
            state.modals.membersProgram.isVisible = !state.modals.membersProgram.isVisible;
        },
        toggleNoListingCreditsModal: (state: InitialMiscStateType): void => {
            state.modals.noListingCredits.isVisible = !state.modals.noListingCredits.isVisible;
        },
        toggleImportRaceModal: (state: InitialMiscStateType): void => {
            state.modals.importRaceModal.isVisible = !state.modals.importRaceModal.isVisible;
        },
        toggleRaceDetailsModal: (state: InitialMiscStateType): void => {
            state.modals.raceDetailsModal.isVisible = !state.modals.raceDetailsModal.isVisible;
        },
    },
});

export const documentsState = (state: AppState) => state.misc;
export const {
    toggleMembersProgramModal,
    toggleNoListingCreditsModal,
    toggleImportRaceModal,
    toggleRaceDetailsModal,
} = MiscSlice.actions;

export default MiscSlice.reducer;
