import React, { useEffect, ReactElement, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "app/store/hooks/use_store";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ListingCreditAddon } from "app/store/payments/payments.types";
import { _isEmpty } from "app/utils/helpers";
import CheckoutForm from "app/components/modules/payments/checkout_form";
import URL from "app/constants/route_urls";
import "../index.scss";

const MembersJoin = (): ReactElement | null => {
    const navigate = useNavigate();
    const initialLoadRef = useRef(false);

    const { stripe, plan } = useAppSelector((state) => state.payments);
    const { user } = useAppSelector((state) => state.user);

    // In case user tries accessing this page without certain data missing, redirect him
    useEffect(() => {
        if (!initialLoadRef.current) {
            initialLoadRef.current = true;

            if (_isEmpty(user) || _isEmpty(stripe.key) || _isEmpty(plan.planDetails)) {
                navigate(URL.MEMBERS, { state: { from: URL.MEMBERS_JOIN } });
                return;
            }

            if (!_isEmpty(user) && !user.plan_upgradeable) navigate(URL.MEMBERS);
        }
    }, [user, navigate, plan, stripe]);

    return !_isEmpty(stripe.key) && !_isEmpty(plan.planDetails) ? (
        <div className="payments">
            <Elements stripe={loadStripe(stripe.key) as Promise<Stripe>}>
                <CheckoutForm
                    type="subscription"
                    stripe_id={plan.planDetails.stripe_id as string}
                    addons={plan?.planDetails?.addons as { listing_credits: ListingCreditAddon[] }}
                    display_price={plan?.planDetails.display_price as string}
                    terms_conditions_url={plan?.planDetails.terms_conditions_url as string}
                />
            </Elements>
        </div>
    ) : null;
};
export default MembersJoin;
