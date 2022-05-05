import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
import { UserSlice } from "app/store/user/user.slice";
import { RootState } from "app/store/types/root_state";
import { DocumentsSlice } from "app/store/documents/document.slice";
import { MiscSlice } from "app/store/misc/misc.slice";
import { PaymentsSlice } from "app/store/payments/payments.slice";
import { SponsorsSlice } from "app/store/sponsors/sponsors.slice";
import { RacesSlice } from "app/store/races/races.slice";
import { RaceMarketerSlice } from "app/store/races/race_marketer.slice";
import { VendorsSlice } from "app/store/vendors/vendors.slice";

const rootReducer = combineReducers<RootState>({
    user: UserSlice.reducer,
    races: RacesSlice.reducer,
    marketer: RaceMarketerSlice.reducer,
    payments: PaymentsSlice.reducer,
    sponsors: SponsorsSlice.reducer,
    documents: DocumentsSlice.reducer,
    vendors: VendorsSlice.reducer,
    misc: MiscSlice.reducer,
});

export function makeStore() {
    return configureStore({
        reducer: rootReducer,
    });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
>;

export default store;
