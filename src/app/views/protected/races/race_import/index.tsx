import React, { useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "app/store/hooks/use_store";
import { importAsyncRace } from "app/store/races/races.actions";
import { getUrlParam, _isEmpty } from "app/utils/helpers";
import STORAGE_CONSTANTS from "app/constants/storage";
import Storage from "app/utils/storage/local";
import URL from "app/constants/route_urls";
import LoadingScreen from "app/components/elements/loading_screen";

const RaceImport = () => {
    const dispatch = useAppDispatch();
    const location: any = useLocation();
    const navigate = useNavigate();

    // redux store
    const { user } = useAppSelector((store) => store.user);

    // Get the `url` param
    const memoizedUrlParam = useMemo(() => getUrlParam(location, "url"), [location]);

    // Import Race
    const importRaceWithCallback = useCallback(async () => {
        const response = await dispatch(
            importAsyncRace({ url: memoizedUrlParam, fromPageImport: true })
        );

        if (response.meta.requestStatus === "fulfilled") navigate(URL.RACE);
        else {
            Storage.set(STORAGE_CONSTANTS.importRaceErrorMessage, response.payload);
            navigate(URL.RACES);
        }
    }, [dispatch, memoizedUrlParam, navigate]);

    useEffect(() => {
        if (!_isEmpty(user)) {
            if (!memoizedUrlParam) {
                navigate(URL.RACES);
                Storage.set(STORAGE_CONSTANTS.importRaceModalVisible, "visible");
                return;
            }

            importRaceWithCallback();
        }
    }, [memoizedUrlParam, dispatch, navigate, user, importRaceWithCallback]);

    return <LoadingScreen />;
};

export default RaceImport;
