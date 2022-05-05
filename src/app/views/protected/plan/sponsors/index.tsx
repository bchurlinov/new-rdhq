import React, { useEffect, ReactElement, useState } from "react";
import { Link } from "react-router-dom";
import { Heading, Text, Skeleton, Button, Tooltip } from "@chakra-ui/react";
import { InfoIcon, LinkIcon } from "@chakra-ui/icons";
import { toggleMembersProgramModal } from "app/store/misc/misc.slice";
import { SponsorType } from "app/types/sponsors/sponsor.types";
import { useAppDispatch, useAppSelector } from "app/store/hooks/use_store";
import { getAsyncSponsors } from "app/store/sponsors/sponsors.actions";
import useToastMessage from "app/hooks/useToastMessage";
import { timeout, _isEmpty } from "app/utils/helpers";
import API_URL from "app/constants/api_urls";
import API from "app/utils/api/axios";
import URL from "app/constants/route_urls";
import PageWithLoader from "app/hoc/page_with_loader";
import SponsorCard from "app/components/elements/cards/sponsor_card";
import { reportBrokenLinkClass } from "./sponsor_utils";
import "./index.scss";

/**
 * TODO Wait for the Race Select widget Races to Load
 * @returns JSX
 */

const SponsorFinder = (): ReactElement => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.user);
    const { sponsors, isLoading, current, error } = useAppSelector((state) => state.sponsors);
    const { currentRace, racesWidget } = useAppSelector((state) => state.races);

    // Broken links
    const [brokenLinks, setBrokenLinks] = useState<number[]>([]);
    const [brokenLinkSuccess, setBrokenLinkSuccess] = useState<string>("");
    const [brokenLinkError, setBrokenLinkError] = useState<string>("");

    // Display toast after successful broken link report
    useToastMessage({
        message: brokenLinkSuccess,
        type: "success",
        isVisible: !_isEmpty(brokenLinkSuccess),
    });

    // Display toast after erroring broken link report
    useToastMessage({
        message: brokenLinkError,
        type: "error",
        isVisible: !_isEmpty(brokenLinkError),
    });

    // Fetch async sponsors depending on certain criteria
    useEffect(() => {
        if (!_isEmpty(currentRace) && current !== currentRace.pk)
            dispatch(getAsyncSponsors({ pk: currentRace.pk, type: currentRace.type }));
    }, [currentRace, dispatch, current]);

    // API call to report broken links
    const reportBrokenLink = async (pk: number): Promise<void> => {
        try {
            setBrokenLinks([...brokenLinks, pk]);
            const { data } = await API.get(`${API_URL.SPONSORS_BROKEN_LINK}${pk}/report-broken/`);

            setBrokenLinkSuccess(data);
            timeout(() => setBrokenLinkSuccess(""), 500);
        } catch (error) {
            setBrokenLinkError("Something went wrong. Please try again");
            timeout(() => setBrokenLinkError(""), 500);
            setBrokenLinks((prevState: number[]) =>
                prevState.filter((link: number) => link !== pk)
            );
        }
    };

    const renderSponsorCards = (sponsor: SponsorType, index: number): JSX.Element => (
        <SponsorCard
            key={index}
            pk={sponsor.pk}
            name={sponsor.name}
            description={sponsor.description}
            logo={sponsor.logo}
            image={sponsor.image}
            benefits={sponsor.benefits}
            category={sponsor.category}
            response_by={sponsor.response_by}
            apply_url={sponsor.apply_url}
            apply_mode={sponsor.apply_mode}
            reportLink={reportBrokenLink}
            brokenLinks={brokenLinks}
        />
    );

    // Check if user's plan is upgreadable
    const restrictedSponsors = (): JSX.Element[] | boolean | undefined =>
        user?.plan_upgradeable
            ? sponsors
                  .slice(0, 5)
                  .map((sponsor: SponsorType, index: number) => renderSponsorCards(sponsor, index))
            : sponsors.map((sponsor: SponsorType, index: number) =>
                  renderSponsorCards(sponsor, index)
              );

    // Sponsors content
    const renderSponsorsContent = (): JSX.Element => {
        if (racesWidget.races.length === 0 && !racesWidget.isLoading) {
            return (
                <div className="sponsors__no-sponsors-content">
                    <Text>
                        To find sponsors for your event,{" "}
                        <Link to={URL.RACES}>add a race first</Link>
                    </Text>
                </div>
            );
        }

        if (_isEmpty(currentRace))
            return (
                <div className="sponsors__no-sponsors-content">
                    <Text>To find sponsors for your event, please select a race first.</Text>
                </div>
            );

        return (
            <PageWithLoader
                isLoading={_isEmpty(sponsors) || isLoading || racesWidget.isLoading}
                rows={7}
            >
                {!_isEmpty(sponsors) && (
                    <div className={`sponsors__content ${isLoading ? "isLoading" : ""}`}>
                        <div className="sponsors__content-wrap">
                            <div className="sponsors__content-wrap-top-item">
                                <Skeleton isLoaded={!isLoading}>
                                    <Text>{sponsors?.length}</Text>
                                </Skeleton>
                            </div>
                            <div className="sponsors__content-wrap-top-item">
                                <Text>
                                    direct application sponsorships found for {currentRace.name}
                                </Text>
                            </div>
                        </div>
                        <div className="sponsors__content-cards-wrap">{restrictedSponsors()}</div>
                        {user?.plan_upgradeable && (
                            <Button
                                variant="ghost"
                                className="sponsors__more-results"
                                onClick={() => dispatch(toggleMembersProgramModal())}
                            >
                                Show all results
                            </Button>
                        )}
                    </div>
                )}
            </PageWithLoader>
        );
    };

    return (
        <div className="sponsors">
            <Heading as="h1">Sponsor Finder</Heading>
            <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
            {_isEmpty(error) ? (
                renderSponsorsContent()
            ) : (
                <div className="sponsors__error">
                    <Text>{error}</Text>
                </div>
            )}
        </div>
    );
};

export default SponsorFinder;
