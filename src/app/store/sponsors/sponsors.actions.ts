import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "app/utils/api/axios";
import API_URL from "app/constants/api_urls";
import { SponsorType } from "app/types/sponsors/sponsor.types";
import { AsyncThunkConfig } from "../types/action.types";

export const getAsyncSponsors: any = createAsyncThunk(
    "sponsors/get_sponsors",
    async (
        { pk, type }: { pk: number; type: "past" | "upcoming" },
        thunkApi: AsyncThunkConfig
    ): Promise<SponsorType[]> => {
        try {
            if (type === "past") throw new Error("Please select an upcoming race");
            const { data } = await API.get<SponsorType[]>(`${API_URL.SPONSORS}${pk}/sponsors/`);

            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.message || error.response.data);
        }
    }
);
