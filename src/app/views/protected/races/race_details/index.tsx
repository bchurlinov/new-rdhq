import React, { ReactElement, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "app/store/hooks/use_store";
import { useParams, Navigate, Params } from "react-router-dom";
import { getAsyncRaceFormData, getAsyncRaceDetails } from "app/store/races/races.actions";
import { IUser } from "app/store/types/user.types";
import { isNumeric, _isEmpty } from "app/utils/helpers";
import { clearRaceDetail } from "app/store/races/races.slice";
import AddEditRace from "app/components/modules/add_edit_race";
import PageWithLoader from "app/hoc/page_with_loader";
import URL from "app/constants/route_urls";
import { RaceDetailsType } from "app/types/races/race.types";
import { defaultRaceData } from "app/components/modules/add_edit_race/constants";

/**
 * TODO ON Page Leave Reset race details and race import
 */

const RaceDetails = (): ReactElement => {
    const dispatch = useAppDispatch();
    const params = useParams<Readonly<Params<string>>>();
    const raceMode = useRef<string>(params && params.id ? "edit" : "add");

    // Redux Store
    const { user } = useAppSelector((state) => state.user);
    const { raceFormData, raceDetail, importedRace } = useAppSelector((state) => state.races);

    // Refetch race form data if it's empty
    useEffect(() => {
        if (_isEmpty(raceFormData.data)) dispatch(getAsyncRaceFormData());
    }, [dispatch, raceFormData.data]);

    // Fetch race details if mode is set to `edit`
    useEffect(() => {
        if (params?.id && raceMode.current === "edit") {
            if (isNumeric(params.id) && _isEmpty(raceDetail.data))
                dispatch(getAsyncRaceDetails({ pk: params.id }));
        }
    }, [dispatch, params, raceDetail.data]);

    // On component un-mount clear race detail
    useEffect(
        () => () => {
            dispatch(clearRaceDetail());
        },
        [dispatch]
    );

    // Memoized Race Data object depending on race mode
    const memoizedRaceData = (): RaceDetailsType => {
        // TODO Check typescript conditional types and add the correct type
        // TODO Build a combined Types from both import and details
        const race: any = raceMode.current === "edit" ? raceDetail.data : importedRace.race;

        return defaultRaceData(race, raceMode, user as IUser);
    };

    // Display content depending on certain conditions
    const renderRaceDetailsByType = (): JSX.Element => {
        if (params.id && !isNumeric(params.id)) return <Navigate to={URL.RACES} />;
        if (params?.id && isNumeric(params.id))
            return (
                <AddEditRace
                    mode={raceMode.current as "edit"}
                    user={user as IUser}
                    formData={raceFormData.data}
                    raceData={memoizedRaceData()}
                />
            );
        if (!params?.id)
            return (
                <AddEditRace
                    mode={raceMode.current as "add"}
                    user={user as IUser}
                    formData={raceFormData.data}
                    raceData={memoizedRaceData()}
                />
            );

        return <Navigate to={URL.RACES} />;
    };

    return (
        <PageWithLoader
            isLoading={raceFormData.isLoading || raceDetail.isLoading || _isEmpty(user)}
            rows={7}
        >
            {renderRaceDetailsByType()}
        </PageWithLoader>
    );
};

export default RaceDetails;
