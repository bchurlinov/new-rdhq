import { SponsorType } from "app/types/sponsors/sponsor.types";

export type InitialSponsorsStateType = {
    sponsors: SponsorType[];
    isLoading: boolean;
    current: number;
    error: string;
};
