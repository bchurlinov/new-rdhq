import React, { ReactElement } from "react";
import logo from "assets/logo.svg";
import "./index.scss";

function LoadingScreen(): ReactElement {
    return (
        <div className="loader-wrapper">
            <div className="app-loading">
                <img className="main-logo" src={logo} alt="logo" />
                <div className="logo-wrap" />
            </div>
        </div>
    );
}

export default LoadingScreen;
