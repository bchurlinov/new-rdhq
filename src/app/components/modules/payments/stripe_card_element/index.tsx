/* eslint-disable react/destructuring-assignment */
import React, { ReactElement } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { StripeCardElementChangeEvent } from "@stripe/stripe-js";

/**
 * TODO Add proper Stripe types
 */
const CARD_ELEMENT_OPTIONS: any = {
    iconStyle: "default",
    hidePostalCode: true,
    style: {
        base: {
            iconColor: "#ee1e82",
            color: "rgba(74,74,74, 0.8)",
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "Open sans, sans-serif",
            fontSmoothing: "antialiased",
            boxShadow: "0",
            ":-webkit-autofill": { color: "#d7d7d7", fontWeight: "400" },
            "::placeholder": { color: "#d7d7d7", fontWeight: "400" },
        },
        invalid: {
            color: "indianred",
            ":focus": {
                color: "indianred",
            },
        },
    },
};

const StripeCardElement = ({
    changeHandler,
}: {
    changeHandler: (event: StripeCardElementChangeEvent) => void;
}): ReactElement => (
    <div>
        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={changeHandler} />
    </div>
);

export default StripeCardElement;
