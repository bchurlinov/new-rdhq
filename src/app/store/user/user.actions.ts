import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUser, IUserLocation } from "app/store/types/user.types";
import { IUserProfile } from "app/types";
import { AsyncThunkConfig } from "app/store/types/action.types";
import API from "app/utils/api/axios";
import API_URL from "app/constants/api_urls";
import Storage from "app/utils/storage/local";
import STORAGE_CONSTANTS from "app/constants/storage";

// User info
export const getAsyncUser: any = createAsyncThunk(
    "user/get_user",
    async (): Promise<{ user_data: IUser; locations: IUserLocation[] } | undefined> => {
        try {
            const [user_data, locations] = await Promise.all([
                API.get(API_URL.USER_DATA),
                API.get(API_URL.USER_LOCATIONS),
            ]);

            return {
                user_data: user_data.data,
                locations: locations.data,
            };
        } catch (error) {
            return undefined;
        }
    }
);

// Login
export const loginAsyncUser: any = createAsyncThunk(
    "user/login_user",
    async (args: { email: string; password: string }, thunkApi: AsyncThunkConfig): Promise<any> => {
        try {
            const { email, password }: { email: string; password: string } = args;

            const { data } = await API.post(API_URL.LOGIN_USER, {
                email,
                password,
            });

            Storage.set("access_token", data.key);
            const userDataResponse = await thunkApi.dispatch(getAsyncUser());

            Storage.set(
                STORAGE_CONSTANTS.loginSuccessMessage,
                `Welcome ${userDataResponse.payload.user_data.greeting_name}`
            );

            return data;
        } catch (err) {
            return thunkApi.rejectWithValue(err.response.data);
        }
    }
);

// Register
export const signUpAsyncUser: any = createAsyncThunk(
    "user/register_user",
    async (
        args: { username: string; email: string; password1: string },
        thunkApi
    ): Promise<void | unknown> => {
        try {
            const { username, email, password1 }: { [key: string]: string } = args;

            // If token exists remove it -> Subject to change
            Storage.remove("access_token");

            const { data } = await API.post(API_URL.REGISTER_USER, {
                username,
                email,
                password1,
                password2: password1,
            });

            Storage.set("access_token", data.key);
            const userDataResponse = await thunkApi.dispatch(getAsyncUser());

            Storage.set(
                STORAGE_CONSTANTS.loginSuccessMessage,
                `Welcome ${userDataResponse.payload.user_data.greeting_name}`
            );

            return true;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

// Social Logins
export const socialUserLogin: any = createAsyncThunk(
    "user/social_login_user",
    async (
        args: { provider_token: string; provider: "google" | "facebook" },
        thunkApi: AsyncThunkConfig
        // eslint-disable-next-line consistent-return
    ): Promise<string | undefined> => {
        try {
            const data: Partial<{ key: string }> = {};

            const {
                provider_token,
                provider,
            }: { provider_token: string; provider: "google" | "facebook" } = args;

            if (provider === "google") {
                const response = await API.post(API_URL.LOGIN_GOOGLE, {
                    access_token: provider_token,
                });
                data.key = response.data.key;
            } else if (provider === "facebook") {
                const response = await API.post(API_URL.LOGIN_FACEBOOK, {
                    access_token: provider_token,
                });

                data.key = response.data.key;
            }

            if (data && data.key) Storage.set("access_token", data.key);
            const userDataResponse = await thunkApi.dispatch(getAsyncUser());

            Storage.set(
                STORAGE_CONSTANTS.loginSuccessMessage,
                `Welcome ${userDataResponse.payload.user_data.greeting_name}`
            );

            return data.key;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

// Logout
export const logoutAsyncUser: any = createAsyncThunk("user/logout_user", async () => {
    try {
        const { status } = await API.get(API_URL.LOGOUT_USER);
        if (status === 200) Storage.remove("access_token");
    } catch (error) {
        // @TODO - Logout user functionality
    }
});

// Update user profile
export const updateAsyncUserProfile: any = createAsyncThunk(
    "user/update_profile",
    async (args: IUserProfile, thunkApi: AsyncThunkConfig) => {
        try {
            const { data } = await API.patch(API_URL.UPDATE_USER_PROFILE, args);
            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

// Get user plan details
export const getAsyncUserPlanDetails: any = createAsyncThunk(
    "user/get_plan_details",
    async (_, thunkApi: AsyncThunkConfig) => {
        try {
            const { data } = await API.get(API_URL.CUSTOMER_DETAILS);
            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);
