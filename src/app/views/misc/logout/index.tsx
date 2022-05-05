import React, { ReactElement, useEffect } from "react";
import { useAppDispatch } from "app/store/hooks/use_store";
import { logoutAsyncUser } from "app/store/user/user.actions";
import { useNavigate } from "react-router-dom";
import { AsyncDispatch } from "app/store/types/action.types";
import { flushDocumentsStore } from "app/store/documents/document.slice";
import { flushUserStore } from "app/store/user/user.slice";
import { flushPaymentsStore } from "app/store/payments/payments.slice";
import { flushRacesStore } from "app/store/races/races.slice";
import LoadingScreen from "app/components/elements/loading_screen";
import Storage from "app/utils/storage/local";
import STORAGE_CONSTANTS from "app/constants/storage";
import URL from "app/constants/route_urls";

function Logout(): ReactElement {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async (): Promise<void> => {
            const response: AsyncDispatch<{ [key: string]: string }> = await dispatch(
                logoutAsyncUser()
            );

            if (response && response.meta.requestStatus === "fulfilled") {
                dispatch(flushUserStore());
                dispatch(flushDocumentsStore());
                dispatch(flushPaymentsStore());
                dispatch(flushRacesStore());
                navigate(URL.LOGIN, { replace: false, state: { from: URL.DASHBOARD } });
                Storage.remove(STORAGE_CONSTANTS.currentRace);
            }
        };

        logoutUser();
    }, [dispatch, navigate]);

    return <LoadingScreen />;
}

export default Logout;
