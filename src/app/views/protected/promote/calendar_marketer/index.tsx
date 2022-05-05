import React, { ReactElement, useEffect } from "react";
import { Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/store/hooks/use_store";
import { getAsyncMarketerReport } from "app/store/races/race_marketer.actions";
import { _isEmpty, DateFormatFactory } from "app/utils/helpers";
import { toggleRaceDetailsModal } from "app/store/misc/misc.slice";
import { RaceReportType } from "app/store/races/races.types";
import PageWithLoader from "app/hoc/page_with_loader";
import RaceReport from "app/components/templates/race_marketer/race_report";
import URL from "app/constants/route_urls";
import RaceDetailsModal from "app/components/modules/global_modals/modals/race_details_modal";
import "./index.scss";

const CalendarMarketer = (): ReactElement => {
    const dispatch = useAppDispatch();
    const { currentRace, racesWidget } = useAppSelector((state) => state.races);
    const { raceDetailsModal } = useAppSelector((state) => state.misc.modals);
    const { report, reportIsLoading, reportHasUpdated, error } = useAppSelector(
        (state) => state.marketer
    );

    // Get or Create race report
    useEffect(() => {
        if (currentRace.pk) {
            dispatch(getAsyncMarketerReport({ pk: currentRace.pk }));
        }
    }, [dispatch, currentRace.pk]);

    const renderReportByType = (): JSX.Element | null => {
        if (!_isEmpty(report)) {
            return (
                <RaceReport
                    pk={currentRace.pk as number}
                    listings={report.listings}
                    status={report.status}
                    race={report.race}
                    search_tag={report.search_tag}
                    race_details={report.race_details}
                    org_details={report.org_details}
                    date_created={report.date_created}
                    date_submitted={report.date_submitted}
                    reportHasUpdated={reportHasUpdated}
                />
            );
        }

        return null;
    };

    // Race Marketer Content
    const renderRaceMarketerContent = (): JSX.Element => {
        if (racesWidget.races.length === 0 && !racesWidget.isLoading) {
            return (
                <div className="race-marketer__no-race">
                    <Text>
                        To create or view listing report,{" "}
                        <Link to={URL.RACES}>add a race first</Link>
                    </Text>
                </div>
            );
        }

        if (_isEmpty(currentRace))
            return (
                <div className="race-marketer__no-current-race">
                    <Text>To view your listing report, please select a race first.</Text>
                </div>
            );

        return (
            <PageWithLoader
                isLoading={_isEmpty(report) || reportIsLoading || racesWidget.isLoading}
                rows={7}
            >
                <div className="race-marketer__wrap">
                    <Heading as="h1">Listing report for {report?.race?.name}</Heading>
                    <Text>
                        Run on{" "}
                        {DateFormatFactory.formatDateString(report?.race?.start_date as string)} -{" "}
                        <button
                            className="race-marketer__race-details"
                            type="button"
                            onClick={() => dispatch(toggleRaceDetailsModal())}
                        >
                            race details
                        </button>
                    </Text>
                    {renderReportByType()}
                </div>
            </PageWithLoader>
        );
    };

    return (
        <div className="race-marketer">
            {!error ? (
                renderRaceMarketerContent()
            ) : (
                <div className="race-marketer__error">
                    <Text>Something went wrong. Please try again.</Text>
                </div>
            )}
            {!_isEmpty(report) && (
                <RaceDetailsModal
                    isVisible={raceDetailsModal.isVisible}
                    closeModal={() => dispatch(toggleRaceDetailsModal())}
                    title={report?.race?.name as string}
                    raceDetails={report.race_details as RaceReportType["race_details"]}
                />
            )}
        </div>
    );
};

export default CalendarMarketer;
