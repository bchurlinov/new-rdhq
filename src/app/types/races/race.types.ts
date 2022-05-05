export type RaceType = {
    pk: number;
    name: string;
    display_date: string;
    city_state: string;
    logo: string;
    listed: boolean;
    type?: "past" | "upcoming";
};

export type WidgetRaceType = Pick<RaceType, "pk" | "display_date" | "name"> & {
    display_group: string;
};

export type RaceDetailsEventType = {
    id?: number; // this is for rendering purposes
    pk?: number;
    name: string;
    distance: string;
    distance_units: string;
    distance_full?: string;
    distance_alias?: string;
    start_time: string;
    entry_fee: string;
    participants?: number;
};

// Race Import Type
export type RaceImportType = {
    pk?: number;
    name: string;
    description: string;
    logo: {
        url: string;
    };
    venue: string | null;
    address: string;
    city: string;
    postal_code: string;
    region: { code: string };
    country: { name: string };
    timezone: { code: string };
    website: string;
    registration_page: string;
    events: RaceDetailsEventType[];
    start_date: string;
    type: { name: string; discipline__name: string };
};

// Race Details Type
export type RaceDetailsType = {
    pk?: number;
    owner: {
        pk: number;
        username: string;
        email: string;
    };
    name: string;
    type?: {
        pk: number;
        discipline: string;
        name: string;
        display_name: string;
    };
    start_date: string;
    weekday?: string;
    description: string;
    events: RaceDetailsEventType[];
    venue: string | null;
    address: string;
    city: string;
    region?: {
        pk: number;
        name: string;
        code: string;
    };
    country: {
        pk: number;
        name: string;
        language: string;
        ccy: string;
        ccy_symbol: string;
    };
    locality?: {
        pk: number;
        name: string;
        display_name: string;
    };
    postal_code: string;
    timezone?: {
        pk: number;
        code: string;
        display_name: string;
    };
    website: string;
    logo?: { url?: string; base64?: string };
    registration_page: string;
    num_participants?: number;
    listed?: boolean;
    display_group?: "past" | "upcoming";
    city_state?: string;
    display_date?: string;
    full_address?: string;
    start_time?: string;
};
