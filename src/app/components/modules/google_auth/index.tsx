import React, { ReactElement, useRef } from "react";
import { useAppDispatch } from "app/store/hooks/use_store";
import { authError } from "app/store/user/user.slice";
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import "./index.scss";

type GoogleLoginType = GoogleLoginResponseOffline & GoogleLoginResponse;

function GoogleAuthLogin({
    text = "Google",
    tokenHandler,
}: {
    text: string;
    tokenHandler: (arg: string) => void;
}): ReactElement {
    const runOnceRef = useRef<boolean>(false);
    const dispatch = useAppDispatch();

    const googleError = (): void => {
        if (!runOnceRef.current) {
            runOnceRef.current = true;
            dispatch(authError("We can't use Google's provider at this moment."));
        }
    };

    const successHandler = (response: GoogleLoginResponse | GoogleLoginType): void => {
        if (tokenHandler) tokenHandler(response.accessToken as GoogleLoginResponse["accessToken"]);
    };

    return (
        <div className="google-login">
            <GoogleLogin
                className="google-auth"
                clientId={process.env.REACT_APP_GOOGLE_AUTH as string}
                buttonText={text}
                onSuccess={successHandler as () => void}
                onFailure={googleError}
                uxMode="popup"
            />
        </div>
    );
}

export default GoogleAuthLogin;
