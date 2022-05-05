import { InitialStateType } from "app/store/user/user.slice";
import { InitialDocumentsStateType } from "app/store/documents/document.types";
import { InitialMiscStateType } from "app/store/misc/misc.types";
import { InitialPaymentsStateType } from "app/store/payments/payments.types";
import {
    InitialRaceMarketerSliceStateType,
    InitialRacesStateType,
} from "app/store/races/races.types";
import { InitialSponsorsStateType } from "app/store/sponsors/sponsors.types";
import { InitialVendorsStateType } from "../vendors/vendors.types";

export type RootState = {
    user: InitialStateType;
    races: InitialRacesStateType;
    marketer: InitialRaceMarketerSliceStateType;
    payments: InitialPaymentsStateType;
    sponsors: InitialSponsorsStateType;
    documents: InitialDocumentsStateType;
    vendors: InitialVendorsStateType;
    misc: InitialMiscStateType;
};
