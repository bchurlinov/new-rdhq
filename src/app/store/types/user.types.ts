// User
export interface IUser {
    pk: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    greeting_name: string;
    has_listing_credits: boolean;
    has_listings: boolean;
    image: string;
    listing_credits: IUserListingCredits;
    location: IUserLocation;
    plan: IUserPlan | any;
    plan_renewal_date: any;
    plan_upgradeable: boolean;
    plan_upgrade_to: {
        pk: number;
        name: string;
    };
}

export interface IUserListingCredits {
    addon: number;
    subscription: number;
    total: number;
}

export interface IUserSideNavItems {
    races: boolean;
    offers: boolean;
    documents: boolean;
    cal_submit: boolean;
    sponsor_finder: boolean;
    eis_wizard?: boolean;
    budget_builder?: boolean;
}

export interface IUserLocation {
    pk: number;
    name: string;
    ccy: string;
    ccy_symbol: string;
    language: string;
    apps: IUserSideNavItems;
}

export interface IUserPlan {
    pk: number;
    name: string;
}

// Auth Types

export interface UserAuthErrors {
    email: string;
    username: string;
    password: string;
    password1: string;
    non_field_errors: string[];
}

export type LoginErrorsType = Pick<UserAuthErrors, "email" | "password" | "non_field_errors">;

export type RegisterErrorsType = Pick<UserAuthErrors, "email" | "password1" | "username">;
