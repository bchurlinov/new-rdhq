import { ListingCreditAddon } from "app/store/payments/payments.types";

export type CheckoutFormProps = {
    type: "subscription" | "credits";
    stripe_id: string;
    addons: {
        listing_credits: ListingCreditAddon[];
    };
    display_price: string;
    terms_conditions_url: string;
};

export type FormContent = {
    [K in CheckoutFormProps["type"]]: {
        heading: string;
        subHeading: string;
    };
};
