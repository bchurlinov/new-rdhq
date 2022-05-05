import { DocumentType } from "app/types/documents/document.types";

export type InitialDocumentsStateType = {
    isFetchingDocuments: boolean;
    documentsError: boolean;
    documents: DocumentType[];
};
