import { VendorOfferType } from "app/types/vendors/vendors.types";

export type InitialVendorsStateType = {
    offers: {
        isLoading: boolean;
        error: boolean;
        data: VendorOfferType[];
    };
};
