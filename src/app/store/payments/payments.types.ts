export type InitialPaymentsStateType = {
    stripe: {
        keyFetching: boolean;
        key: string;
    };
    plan: {
        isLoading: boolean;
        planDetails: Partial<UserPlanDetails>;
    };
};

export type UserPlanDetails = {
    pk: number;
    display_price: string;
    name: string;
    premium_offers: boolean;
    stripe_id: string;
    stripe_amount: boolean;
    stripe_currency: string;
    terms_conditions_url: string;
    addons: {
        listing_credits: ListingCreditAddon[];
    };
};

export type ListingCreditAddon = {
    description: string;
    display_price: string;
    listing_credits: string;
    stripe_amount: number;
    stripe_currency: string;
    stripe_id: string;
};
