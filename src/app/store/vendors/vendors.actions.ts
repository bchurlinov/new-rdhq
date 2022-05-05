import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "app/utils/api/axios";
import API_URL from "app/constants/api_urls";
import { VendorOfferType } from "app/types/vendors/vendors.types";
import { AsyncThunkConfig } from "../types/action.types";

export const getAsyncVendorOffers: any = createAsyncThunk(
    "vendors/get_vendor_offers",
    async (thunkApi: AsyncThunkConfig): Promise<VendorOfferType[]> => {
        try {
            const { data } = await API.get<VendorOfferType[]>(API_URL.VENDOR_OFFERS);
            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);
