import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "app/utils/api/axios";
import API_URL from "app/constants/api_urls";
import { DocumentType } from "app/types/documents/document.types";
import { AsyncThunkConfig } from "../types/action.types";

export const getAsyncDocuments: any = createAsyncThunk(
    "documents/get_documents",
    async (thunkApi: AsyncThunkConfig): Promise<DocumentType[] | string> => {
        try {
            const { data } = await API.get<DocumentType[]>(API_URL.DOCUMENTS);
            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);
