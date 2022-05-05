import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "app/utils/api/axios";
import API_URL from "app/constants/api_urls";
import { AsyncThunkConfig } from "../types/action.types";
import { UserPlanDetails } from "./payments.types";

export const getAsyncStripeKey: any = createAsyncThunk(
    "payments/get_stripe_key",
    async (thunkApi: AsyncThunkConfig): Promise<string> => {
        try {
            const { data } = await API.get<{ api_key: string }>(API_URL.STRIPE_KEY);

            if (data?.api_key) return data.api_key;
            return "";
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

export const getAsyncUserPlanDetails: any = createAsyncThunk(
    "payments/get_plan_details",
    async (args: string, thunkApi: AsyncThunkConfig): Promise<UserPlanDetails> => {
        try {
            const { data } = await API.get<UserPlanDetails>(`${API_URL.USER_PLAN_DETAILS}${args}`);
            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);
