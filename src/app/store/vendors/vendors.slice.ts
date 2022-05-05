import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "app/store";
import { VendorOfferType } from "app/types/vendors/vendors.types";
import { InitialVendorsStateType } from "./vendors.types";
import { getAsyncVendorOffers } from "./vendors.actions";

const initialState: InitialVendorsStateType = {
    offers: {
        isLoading: true,
        error: false,
        data: [],
    },
};

export const VendorsSlice = createSlice({
    name: "vendors",
    initialState,
    reducers: {},
    // reducers: { flushDocumentsStore: () => initialState },
    extraReducers: {
        [getAsyncVendorOffers.pending]: (state: InitialVendorsStateType): void => {
            state.offers.isLoading = true;
            state.offers.error = false;
        },
        [getAsyncVendorOffers.fulfilled]: (
            state: InitialVendorsStateType,
            action: PayloadAction<VendorOfferType[]>
        ): void => {
            state.offers.isLoading = false;
            state.offers.data = action.payload;
        },
        [getAsyncVendorOffers.rejected]: (
            state: InitialVendorsStateType,
            action: PayloadAction<any>
        ): void => {
            console.error("Vendor Offers Error >>", action.payload);
            state.offers.isLoading = false;
            state.offers.error = true;
        },
    },
});

export const vendorsState = (state: AppState) => state.vendors;
// export const { flushDocumentsStore } = DocumentsSlice.actions;

export default VendorsSlice.reducer;
