import React, { ReactElement, useState } from "react";
import { Link as ReactLink } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "app/store/hooks/use_store";
import { AppState } from "app/store";
import { Heading, Text, Link } from "@chakra-ui/react";
import { DateFormatFactory, _isEmpty } from "app/utils/helpers";
import { getAsyncUserPlanDetails } from "app/store/user/user.actions";

import URL from "app/constants/route_urls";
import "./index.scss";

function Account(): ReactElement {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state: AppState) => state.user);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getCustomerPortal = async (): Promise<void> => {
        setIsLoading(true);

        const response = await dispatch(getAsyncUserPlanDetails());

        if (response?.meta.requestStatus === "fulfilled") {
            setIsLoading(false);
            window.location.href = response?.payload?.customer_portal_url;
            setIsLoading(false);
        }
    };

    const renderPlanLink = (): JSX.Element =>
        user?.plan_upgradeable ? (
            <Link as={ReactLink} to={URL.MEMBERS_JOIN}>
                Upgrade membership
            </Link>
        ) : (
            <a href="# " onClick={getCustomerPortal}>
                View and update payment details {isLoading && <div className="account__loading" />}
            </a>
        );

    const renderBuyListingCreditsLink = (): JSX.Element =>
        user?.plan_upgradeable ? (
            <Link as={ReactLink} to={URL.REPORTS}>
                View listing reports
            </Link>
        ) : (
            <Link as={ReactLink} to={URL.LISTING_CREDITS}>
                Buy listing credits
            </Link>
        );

    return (
        <div className="account">
            <div className="account__wrap">
                <Heading as="h4">Account details</Heading>
                <div className="account-info-wrap">
                    <div className="account-info-wrap__item first">
                        <Text>Membership plan:</Text>
                    </div>
                    <div className="account-info-wrap__item last">
                        <Text fontSize="3xl">{user?.plan?.name}</Text>
                    </div>
                </div>
                <div className="account-info-wrap">
                    <div className="account-info-wrap__item first">
                        <Text>Plan renewal date:</Text>
                    </div>
                    <div className="account-info-wrap__item last">
                        <Text>
                            {user?.plan_renewal_date &&
                                DateFormatFactory.formatDateString(user?.plan_renewal_date)}
                        </Text>
                    </div>
                </div>
                <div className="account__anchor-wrap">{renderPlanLink()}</div>
            </div>
            <div className="account__wrap">
                <Heading as="h4">Race calendar listing credits</Heading>
                <div className="account-info-wrap">
                    <div className="account-info-wrap__item first">
                        <Text>Remaining membership listing credits:</Text>
                    </div>
                    <div className="account-info-wrap__item last">
                        <Text>
                            {!_isEmpty(user?.listing_credits) &&
                                user?.listing_credits?.subscription}
                        </Text>
                    </div>
                </div>
                <div className="account-info-wrap">
                    <div className="account-info-wrap__item first">
                        <Text>Additional unused listing credits:</Text>
                    </div>
                    <div className="account-info-wrap__item last">
                        <Text>
                            {!_isEmpty(user?.listing_credits) && user?.listing_credits?.addon}
                        </Text>
                    </div>
                </div>
                <div className="account-info-wrap">
                    <div className="account-info-wrap__item first">
                        <Text>Your total available listing credits:</Text>
                    </div>
                    <div className="account-info-wrap__item last">
                        <Text>
                            {!_isEmpty(user?.listing_credits) && user?.listing_credits?.total}
                        </Text>
                    </div>
                </div>
                <div className="account__anchor-wrap">{renderBuyListingCreditsLink()}</div>
            </div>
        </div>
    );
}

export default Account;
