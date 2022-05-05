import React, { ReactElement, useState } from "react";
import { RaceReportListing, RaceReportType } from "app/store/races/races.types";
import { Heading, Text } from "@chakra-ui/react";
import { ExternalLinkIcon, NotAllowedIcon } from "@chakra-ui/icons";
import DraftReportForm from "app/components/templates/race_marketer/draft_report_form";
import useToastMessage from "app/hooks/useToastMessage";
import "./index.scss";

type RaceCalType = "Found" | "Pending" | "Submitted";
type RaceReport = Partial<RaceReportType> & { reportHasUpdated: boolean };

const RaceReport = ({
    pk,
    listings,
    status,
    reportHasUpdated,
    race,
    search_tag,
    race_details,
    org_details,
    date_created,
    date_submitted,
}: RaceReport): ReactElement => {
    const [listingImageLoaded, setListingImageLoaded] = useState<boolean>(false);

    // Display toast message once the report status has updated
    useToastMessage({
        message: "Your race has been listed successfully",
        type: "success",
        isVisible: reportHasUpdated,
    });

    const filteredListingReports = (
        listings_list: RaceReportListing[],
        reportType: RaceCalType
    ): RaceReportListing[] =>
        listings_list &&
        listings_list.filter((item: RaceReportListing) => item.status === reportType);

    const calculateListingDifference = (
        listings_list: RaceReportListing[],
        reportType: RaceCalType
    ): number =>
        listings_list &&
        listings_list.length - filteredListingReports(listings_list, reportType).length;

    // Race calendar status
    const renderRaceCalendarStatus = (listing: RaceReportListing, status: RaceCalType) => {
        if (status === "Found") {
            return (
                <span>
                    <a
                        href={listing.listing_url || listing.calendar.base_url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Listing <ExternalLinkIcon />
                    </a>
                </span>
            );
        }

        if (status === "Submitted") {
            return (
                <span>
                    {listing.listing_url ? (
                        <a
                            href={listing.listing_url || listing.calendar.base_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Listing <ExternalLinkIcon />
                        </a>
                    ) : (
                        ""
                    )}
                </span>
            );
        }

        if (status === "Pending") return <span>Pending...</span>;

        return null;
    };

    // Race calendar listings
    const renderRaceCalendarsListings = (
        listings_list: RaceReportListing[],
        raceType: RaceCalType
    ) =>
        listings_list &&
        filteredListingReports(listings_list, raceType).map(
            (listing: RaceReportListing, index: number) => (
                <li key={index as number} className="race-marketer__listing-list-item">
                    <span>
                        {listing.calendar.logo ? (
                            <img
                                className={listingImageLoaded ? "hasLoaded" : ""}
                                onLoad={() => setListingImageLoaded(true)}
                                src={listing.calendar.logo}
                                alt={listing.calendar.name}
                            />
                        ) : (
                            <NotAllowedIcon />
                        )}

                        {listing.calendar.name}
                    </span>
                    {renderRaceCalendarStatus(listing, listing.status)}
                </li>
            )
        );

    // Race calendar content
    // const renderFoundCalendarContent = (): JSX.Element | null => {
    //     if (!_isEmpty(listings)) {
    //         return (
    //             <>
    //                 <Heading as="h4">
    //                     Found in{" "}
    //                     {filteredListingReports(listings as RaceReportListing[], "Found").length}{" "}
    //                     race calendar
    //                 </Heading>
    //                 <div className="race-marketer__listings-wrap">
    //                     <ul className="race-marketer__listing-list">
    //                         {renderRaceCalendarsListings(listings as RaceReportListing[], "Found")}
    //                     </ul>
    //                 </div>
    //             </>
    //         );
    //     }

    //     return null;
    // };

    // Pending race listings
    // const renderQueuedRaceCalendars = (): JSX.Element => (
    //     <div className="race-marketer__pending-completed-content">
    //         <Heading as="h4">
    //             Queued for listing on{" "}
    //             {filteredListingReports(listings as RaceReportListing[], "Pending").length} race
    //             calendars:
    //             <div className="race-marketer__listings-wrap">
    //                 <ul className="race-marketer__listing-list">
    //                     {renderRaceCalendarsListings(listings as RaceReportListing[], "Pending")}
    //                 </ul>
    //             </div>
    //         </Heading>
    //     </div>
    // );

    // Completed race listings
    // const renderCompletedRaceCalendars = (): JSX.Element => (
    //     <div className="race-marketer__pending-completed-content">
    //         <Heading as="h4">
    //             Submitted to{" "}
    //             {filteredListingReports(listings as RaceReportListing[], "Submitted").length} race
    //             calendars:
    //             <div className="race-marketer__listings-wrap">
    //                 <ul className="race-marketer__listing-list">
    //                     {renderRaceCalendarsListings(listings as RaceReportListing[], "Submitted")}
    //                 </ul>
    //             </div>
    //         </Heading>
    //     </div>
    // );

    const renderRaceCalendarsHeader = (type: RaceCalType): string => {
        switch (type) {
            case "Found":
                return `Found in
                ${filteredListingReports(listings as RaceReportListing[], type).length}
                race calendars`;
            case "Pending":
                return `Queued for listing on
                    ${filteredListingReports(listings as RaceReportListing[], type).length} race
                    calendars:`;
            case "Submitted":
                return `Submitted to
                        ${filteredListingReports(listings as RaceReportListing[], type).length} race
                        calendars:`;
            default:
                return "";
        }
    };

    const renderRaceCalendars = (type: RaceCalType): JSX.Element | null => {
        const listingReportLength = filteredListingReports(
            listings as RaceReportListing[],
            type
        ).length;

        if (listingReportLength !== 0) {
            return (
                <div className="race-marketer__pending-completed-content">
                    <Heading as="h4">{renderRaceCalendarsHeader(type)}</Heading>
                    <div className="race-marketer__listings-wrap">
                        <ul className="race-marketer__listing-list">
                            {renderRaceCalendarsListings(listings as RaceReportListing[], type)}
                        </ul>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="race-marketer__report">
            {renderRaceCalendars("Found")}
            {status === "Draft" && (
                <div className="race-marketer__draft-content">
                    <Text>
                        Your race could be listed on{" "}
                        <b>
                            {calculateListingDifference(listings as RaceReportListing[], "Found")}{" "}
                            more race calendars
                        </b>
                        . To list your race, fill in the details below:
                    </Text>
                    <DraftReportForm pk={pk as number} />
                </div>
            )}

            {(status === "Pending" || status === "Completed") && renderRaceCalendars("Pending")}
            {(status === "Pending" || status === "Completed") && renderRaceCalendars("Submitted")}
        </div>
    );
};

export default RaceReport;
