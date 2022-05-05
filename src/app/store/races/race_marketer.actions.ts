import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "app/utils/api/axios";
import API_URL from "app/constants/api_urls";
import { RaceMarketerFormType } from "app/lib/validation_schemas/marketer.schema";
import { getAsyncUser } from "app/store/user/user.actions";
import { AsyncThunkConfig } from "app/store/types/action.types";
import { RaceReportType } from "app/store/races/races.types";

/**
 * ! Once Panos updates ( slices the slow USER endpoint ), update the credit status with the new endpoint instead
 */

export const postAsyncOrganisationDetails: any = createAsyncThunk(
    "race_marketer/post_organisation_details",
    async (
        { pk, args }: { pk: number; args: RaceMarketerFormType },
        thunkApi: AsyncThunkConfig
    ) => {
        try {
            const { data } = await API.patch(
                `${API_URL.MARKETER_LIST_RACE}${pk}/listing_report/submit/`,
                { org_details: args }
            );

            await thunkApi.dispatch(getAsyncUser());
            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

export const getAsyncMarketerReport: any = createAsyncThunk(
    "race_marketer/get_marketer_report",
    async (
        { pk }: { pk: number },
        thunkApi: AsyncThunkConfig
    ): Promise<Omit<RaceReportType, "events">> => {
        try {
            const { data } = await API.get(`${API_URL.MARKETER_REPORT}${pk}/listing_report/`);
            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);
