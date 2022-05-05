import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "app/store";
import {
    IUser,
    IUserLocation,
    LoginErrorsType,
    RegisterErrorsType,
} from "app/store/types/user.types";
import {
    getAsyncUser,
    loginAsyncUser,
    signUpAsyncUser,
    updateAsyncUserProfile,
    socialUserLogin,
} from "./user.actions";

export type InitialStateType = {
    isAuthenticated: boolean;
    authLoading: boolean;
    loginErrors: LoginErrorsType | any;
    registerErrors: RegisterErrorsType | any;
    userFetchLoading: boolean;
    userFetchError: boolean;
    userIsUpdating: boolean;
    user_locations: Partial<IUserLocation[]>;
    user: Partial<IUser>;
};

const initialState: InitialStateType = {
    isAuthenticated: false,
    authLoading: false,
    loginErrors: {},
    registerErrors: {},
    userFetchLoading: false,
    userFetchError: false,
    userIsUpdating: false,
    user_locations: [],
    user: {},
};

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearErrors: (state: InitialStateType): void => {
            state.registerErrors = {};
            state.loginErrors = {};
        },
        reAuthenticate: (state: InitialStateType): void => {
            state.isAuthenticated = true;
            state.authLoading = true;
        },
        flushUserStore: () => initialState,
        authError: (state: InitialStateType, action: PayloadAction<string>): void => {
            state.loginErrors = {
                non_field_errors: [action.payload],
            };
        },
    },
    extraReducers: {
        [getAsyncUser.pending]: (state: InitialStateType) => {
            state.userFetchLoading = true;
        },
        [getAsyncUser.fulfilled]: (
            state: InitialStateType,
            action: PayloadAction<{ user_data: IUser; locations: IUserLocation[] }>
        ) => {
            state.userFetchLoading = false;
            state.user = action.payload.user_data;
            state.user_locations = action.payload.locations;
        },
        [getAsyncUser.rejected]: (state: InitialStateType) => {
            state.userFetchError = true;
        },
        [loginAsyncUser.pending]: (state: InitialStateType) => {
            state.loginErrors = {};
            state.authLoading = true;
        },
        [loginAsyncUser.fulfilled]: (state: InitialStateType) => {
            state.authLoading = false;
            state.isAuthenticated = true;
            state.loginErrors = {};
        },
        [loginAsyncUser.rejected]: (
            state: InitialStateType,
            action: PayloadAction<{ [key: string]: string[] }>
        ) => {
            state.authLoading = false;
            state.loginErrors = action.payload;
        },
        [signUpAsyncUser.pending]: (state: InitialStateType) => {
            state.authLoading = true;
        },
        [signUpAsyncUser.fulfilled]: (state: InitialStateType) => {
            state.authLoading = false;
            state.isAuthenticated = true;
        },
        [signUpAsyncUser.rejected]: (state: InitialStateType, action: PayloadAction<any>) => {
            state.authLoading = false;
            state.registerErrors = action.payload;
        },
        [socialUserLogin.fulfilled]: (state: InitialStateType): void => {
            state.authLoading = false;
            state.isAuthenticated = true;
        },
        [updateAsyncUserProfile.pending]: (state: InitialStateType) => {
            state.userIsUpdating = true;
        },
        [updateAsyncUserProfile.fulfilled]: (
            state: InitialStateType,
            action: PayloadAction<any>
        ) => {
            state.userIsUpdating = false;
            state.user = action.payload;
        },
        [updateAsyncUserProfile.rejected]: (state: InitialStateType) => {
            state.userIsUpdating = false;
        },
    },
});

export const userState = (state: AppState) => state.user;
export const { clearErrors, reAuthenticate, flushUserStore, authError } = UserSlice.actions;

export default UserSlice.reducer;
