import {
    RaceImportType,
    RaceType,
    WidgetRaceType,
    RaceDetailsType,
} from "app/types/races/race.types";

// Race Types
type RaceTypes = "upcoming" | "past";
export type CurrentRaceType = { pk: number; name: string; type: "upcoming" | "past" };

// Race Groups
type RaceGroup = {
    [Key in RaceTypes]: {
        isLoading: boolean;
        results: RaceType[] | [];
        page: number | null;
        count: number;
    };
};

// Race Form Data Types
export type RaceFormDataTypes = {
    distance_units: { k: "K"; m: "Miles"; h: "Hours" };
    participants: {
        100: "0-100";
        500: "100-500";
        1000: "500-1000";
        5000: "1000-5000";
        10000: "5000-10000";
        99999: "10000+";
    };
    regions: { pk: number; name: string; code: string }[];
    timezones: { pk: number; code: string; display_name: string }[];
    types: { pk: number; discipline: string; name: string; display_name: string }[];
};

// Initial Races Types
export type InitialRacesStateType = {
    racesWidget: {
        isLoading: boolean;
        races: WidgetRaceType[];
    };
    currentRace: Partial<CurrentRaceType>;
    races: RaceGroup;
    raceFormData: {
        data: Partial<RaceFormDataTypes>;
        isLoading: boolean;
        error: boolean;
    };
    importedRace: {
        isLoading: boolean;
        error: string;
        race: Partial<RaceImportType>;
    };
    raceDetail: {
        data: Partial<RaceDetailsType>;
        isLoading: boolean;
        error: boolean;
    };
};

// Race Marketer
export type InitialRaceMarketerSliceStateType = {
    reportIsLoading: boolean;
    report: Partial<RaceReportType>;
    reportHasUpdated: boolean;
    error: boolean;
};

export type RaceReportEvent = {
    distance: string;
    entry_fee: string;
    name: string;
    participants: number;
    start_time: string;
};

export type RaceReportListing = {
    calendar: {
        base_url: string;
        logo: string;
        name: string;
    };
    listing_url: null | string;
    status: "Pending" | "Found";
};

export type RaceReportType = {
    pk: number;
    date_submitted: null | string;
    date_created: string;
    org_details: null | string;
    listings: RaceReportListing[];
    race: {
        pk: number;
        name: string;
        start_date: string;
    };
    race_details: {
        name: string;
        address: string;
        city: string;
        date: string;
        description: string;
        region: string;
        registration_page: string;
        timezone: string;
        type: string;
        venue: string;
        website: string;
        events: RaceReportEvent[];
    };
    events: RaceReportEvent[];
    search_tag: string;
    status: "Draft" | "Pending" | "Completed";
};
