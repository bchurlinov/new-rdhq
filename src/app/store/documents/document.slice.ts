import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "app/store";
import { DocumentType } from "app/types/documents/document.types";
import { InitialDocumentsStateType } from "./document.types";
import { getAsyncDocuments } from "./document.actions";

const initialState: InitialDocumentsStateType = {
    isFetchingDocuments: true,
    documentsError: false,
    documents: [],
};

export const DocumentsSlice = createSlice({
    name: "documents",
    initialState,
    reducers: { flushDocumentsStore: () => initialState },
    extraReducers: {
        [getAsyncDocuments.pending]: (state: InitialDocumentsStateType) => {
            state.documentsError = false;
            state.isFetchingDocuments = true;
        },
        [getAsyncDocuments.fulfilled]: (
            state: InitialDocumentsStateType,
            action: PayloadAction<DocumentType[]>
        ) => {
            state.isFetchingDocuments = false;
            state.documents = action.payload;
        },
        [getAsyncDocuments.rejected]: (state: InitialDocumentsStateType) => {
            state.isFetchingDocuments = false;
            state.documentsError = true;
        },
    },
});

export const documentsState = (state: AppState) => state.documents;
export const { flushDocumentsStore } = DocumentsSlice.actions;

export default DocumentsSlice.reducer;
