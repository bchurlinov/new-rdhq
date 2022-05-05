import React, { ReactElement } from "react";
import FacebookLogin from "react-facebook-login";
import "./index.scss";

function FacebookAuthLogin({
    text,
    tokenHandler,
}: {
    text: string;
    tokenHandler: (arg: string) => void;
}): ReactElement {
    const responseFacebook = (response: any): void => {
        if (response && response.status === "unknown") return;
        if (tokenHandler) tokenHandler(response.accessToken);
    };

    return (
        <div className="facebook-login">
            <FacebookLogin
                appId="393845167659559"
                fields="name,email,picture,location"
                callback={responseFacebook}
                cssClass="facebook-auth"
                textButton={text}
                icon="fa-facebook"
            />
        </div>
    );
}

export default FacebookAuthLogin;
