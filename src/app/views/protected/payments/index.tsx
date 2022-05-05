import React, { useEffect, ReactElement } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "app/store/hooks/use_store";
import { getAsyncUser } from "app/store/user/user.actions";
import { getAsyncStripeKey, getAsyncUserPlanDetails } from "app/store/payments/payments.actions";
import { _isEmpty } from "app/utils/helpers";
import LoadingScreen from "app/components/elements/loading_screen";
import URL from "app/constants/route_urls";

const Payments = (): ReactElement => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location: any = useLocation();

    // App store
    const { stripe, plan } = useAppSelector((state) => state.payments);
    const { user } = useAppSelector((state) => state.user);

    // If the user's plan is not upgreadable return back
    // Get Plan details for a user
    useEffect(() => {
        if (_isEmpty(user)) dispatch(getAsyncUser());
        if (!_isEmpty(user)) dispatch(getAsyncUserPlanDetails(user?.plan_upgrade_to?.pk ?? 3));

        // if (!_isEmpty(user)) dispatch(getAsyncUserPlanDetails(user?.plan_upgrade_to?.pk ?? 3));
    }, [user, navigate, dispatch]);

    // If there isn't a stripe key in the store fetch a new one
    useEffect(() => {
        if (_isEmpty(stripe.key)) dispatch(getAsyncStripeKey());
    }, [stripe.key, dispatch]);

    // If a stripe key and a user plan is obtained redirect the user to
    // Either Member Join or Listing credits page
    useEffect(() => {
        if (!_isEmpty(user) && !_isEmpty(stripe.key) && !_isEmpty(plan.planDetails)) {
            if (user.plan_upgradeable) navigate(location.state?.from ?? URL.MEMBERS_JOIN);
            else if (!user.plan_upgradeable) navigate(location.state?.from ?? URL.LISTING_CREDITS);
            else navigate(-1);
        }
    }, [location, navigate, stripe, user, plan]);

    return <LoadingScreen />;
};

export default Payments;
