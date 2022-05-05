import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "app/utils/api/axios";
import API_URL from "app/constants/api_urls";
import { RaceImportType, RaceType, WidgetRaceType } from "app/types/races/race.types";
import { Option } from "app/components/elements/form/select/select.types";
import Storage from "app/utils/storage/local";
import STORAGE_CONSTANTS from "app/constants/storage";
import { AsyncThunkConfig } from "../types/action.types";
import { RaceFormDataTypes } from "./races.types";

/**
 * TODO Upon Race creation add the race in the Race Select widget
 * TODO Update the Types in Create, Edit functionalities
 * TODO After Edit update the race data
 * TODO Add proper type-safety
 */

// Get Races
export const getAsyncRaces: any = createAsyncThunk(
    "races/get_races",
    async (
        { filter, page }: { filter?: "upcoming" | "past" | ""; page?: number },
        thunkApi: AsyncThunkConfig
    ): Promise<{
        count: number;
        next: null | number;
        previous: null | number;
        results: RaceType[];
    }> => {
        try {
            let RACES_URL = API_URL.RACES;
            if (filter || page) RACES_URL += "?";
            if (filter) RACES_URL += `filter=${filter}&`;
            if (page) RACES_URL += `page=${page}&`;

            const { data } = await API.get(RACES_URL);
            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

// Widget Races
export const getAsyncWidgetRaces: any = createAsyncThunk(
    "races/get_widget_races",
    async (
        {
            filter,
            display,
            page,
        }: { filter?: "upcoming" | "past" | ""; display?: "menu" | ""; page?: number },
        thunkApi: AsyncThunkConfig
    ): Promise<Option[]> => {
        try {
            let RACES_URL = API_URL.RACES;
            if (filter || display || page) RACES_URL += "?";
            if (filter) RACES_URL += `filter=${filter}&`;
            if (display) RACES_URL += `display=${display}&`;
            if (page) RACES_URL += `page=${page}&`;

            const { data } = await API.get<{
                results: WidgetRaceType[];
            }>(RACES_URL);

            const raceData =
                data &&
                data.results.map((race: any) => ({
                    pk: race.pk,
                    name: race.name,
                    optionalName: race.display_date,
                    value: JSON.stringify(race),
                    groupLabel: race.display_group,
                }));

            return raceData;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

// Delete race
export const deleteAsyncRace: any = createAsyncThunk(
    "races/delete_race",
    async (
        { pk, raceType }: { pk: number; raceType: "upcoming" | "past"; raceName: string },
        thunkApi: AsyncThunkConfig
    ): Promise<{ pk: number; raceType: "upcoming" | "past" }> => {
        try {
            await API.delete(`${API_URL.DELETE_RACE}${pk}/delete/`);
            Storage.remove(STORAGE_CONSTANTS.currentRace);

            return {
                pk,
                raceType,
            };
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

const prepareRaceBody = (formData: any, mode: "add" | "edit") => {
    const { type, postal_code, timezone, country } = formData;
    const body = { ...formData };
    const createTypeObject = null;
    body.postal_code = postal_code.toString();
    body.timezone = { code: timezone?.code };
    body.country = { name: country?.name };

    // Prepare the logo for submission
    if (typeof formData.logo === "object" && mode === "edit" && formData.logo?.url)
        body.logo = formData.logo.url;

    // Transform Race type
    body.type = !type
        ? createTypeObject
        : {
              name: type.name,
              discipline__name: type?.discipline__name ? type.discipline__name : type.discipline,
          };

    return body;
};

// Create race
export const createAsyncRace: any = createAsyncThunk(
    "races/add_race",
    async (formData: any, thunkApi: AsyncThunkConfig): Promise<RaceType> => {
        try {
            const body = prepareRaceBody(formData, "add");
            const { data }: { data: RaceType } = await API.post(`${API_URL.ADD_RACE}`, body, {
                timeout: 60000,
            });

            return data;
        } catch (error) {
            console.log(error);
            return thunkApi.rejectWithValue(error?.response?.data || error?.message);
        }
    }
);

// Update race
export const updateAsyncRace: any = createAsyncThunk(
    "races/update_race",
    async (formData: any, thunkApi: AsyncThunkConfig) => {
        try {
            const { pk } = formData;
            const body = prepareRaceBody(formData, "edit");

            const { data } = await API.patch(`${API_URL.RACES}${pk}/update/`, body, {
                timeout: 60000,
            });

            return data;
        } catch (error) {
            console.log(error);
            return thunkApi.rejectWithValue(error?.response?.data || error?.message);
        }
    }
);

// Import race
export const importAsyncRace: any = createAsyncThunk(
    "races/import_race",
    async (
        { url, fromPageImport }: { url: string; fromPageImport?: boolean },
        thunkApi: AsyncThunkConfig
    ): Promise<RaceImportType> => {
        try {
            const { data } = await API.get<RaceImportType>(`${API_URL.IMPORT_RACE}`, {
                params: { registration_page_url: url },
            });

            return data;
        } catch (error) {
            if (error.response.status === 409) return error.response.data.pk;
            return thunkApi.rejectWithValue(error.response.data.non_field_errors, fromPageImport);
        }
    }
);

// Race Form Data
export const getAsyncRaceFormData: any = createAsyncThunk(
    "races/race_form_data",
    async (thunkApi: AsyncThunkConfig): Promise<RaceFormDataTypes> => {
        try {
            const { data } = await API.get<RaceFormDataTypes>(API_URL.RACE_FORM_DATA);
            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

// Race Details
// TODO Add Error Scenario - Wait for Panos to adjust this route
export const getAsyncRaceDetails: any = createAsyncThunk(
    "races/race_details",
    async ({ pk }: { pk: number }, thunkApi: AsyncThunkConfig) => {
        try {
            const { data } = await API.get<any>(`${API_URL.RACE_DETAILS}${pk}/`);
            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);
