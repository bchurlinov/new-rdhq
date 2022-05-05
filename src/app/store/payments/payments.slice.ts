import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "app/store";
import { InitialPaymentsStateType, UserPlanDetails } from "./payments.types";
import { getAsyncStripeKey, getAsyncUserPlanDetails } from "./payments.actions";

/**
 * TODO Add Error Scenarios when something bad happens
 */

const initialState: InitialPaymentsStateType = {
    stripe: {
        keyFetching: false,
        key: "",
    },
    plan: {
        isLoading: false,
        planDetails: {},
    },
};

export const PaymentsSlice = createSlice({
    name: "payments",
    initialState,
    reducers: { flushPaymentsStore: () => initialState },
    extraReducers: {
        [getAsyncStripeKey.pending]: (state: InitialPaymentsStateType): void => {
            state.stripe.keyFetching = true;
        },
        [getAsyncStripeKey.fulfilled]: (
            state: InitialPaymentsStateType,
            action: PayloadAction<string>
        ): void => {
            state.stripe.keyFetching = false;
            state.stripe.key = action.payload;
        },
        [getAsyncUserPlanDetails.pending]: (state: InitialPaymentsStateType): void => {
            state.plan.isLoading = true;
        },
        [getAsyncUserPlanDetails.fulfilled]: (
            state: InitialPaymentsStateType,
            action: PayloadAction<UserPlanDetails>
        ): void => {
            state.plan.isLoading = false;
            state.plan.planDetails = action.payload;
        },
    },
});

export const documentsState = (state: AppState) => state.payments;
export const { flushPaymentsStore } = PaymentsSlice.actions;

export default PaymentsSlice.reducer;
