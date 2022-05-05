import React, { ReactElement, useEffect, useCallback } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import API from "app/utils/api/axios";
import API_URL from "app/constants/api_urls";
import Storage from "app/utils/storage/local";
import LoadingScreen from "app/components/elements/loading_screen";
import URL from "app/constants/route_urls";

function VerifyEmail(): ReactElement {
    const navigate = useNavigate();
    const match = useMatch(URL.VERIFY_EMAIL);

    const verifyEmailWithCallback = useCallback(
        async (key: string) => {
            try {
                const { data } = await API.post(API_URL.VERIFY_EMAIL, { key });
                Storage.set("verify_email_success", data.detail);
                navigate(URL.DASHBOARD);
            } catch (error) {
                Storage.set(
                    "login_error_message",
                    "Something went wrong. Please use the verification link we sent you and try again."
                );

                navigate(URL.DASHBOARD);
            }
        },
        [navigate]
    );

    useEffect(() => {
        if (match && match?.params?.key) verifyEmailWithCallback(match.params.key);
    }, [match, verifyEmailWithCallback]);

    return <LoadingScreen />;
}

export default VerifyEmail;
