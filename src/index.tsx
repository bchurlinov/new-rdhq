import React from "react";
import ReactDOM from "react-dom";
import AppProvider from "app/hoc/app_providers";
import "app/styles/main.scss";

const ROOT_ELEMENT = document.getElementById("root");

ReactDOM.render(
    <React.StrictMode>
        <AppProvider />
    </React.StrictMode>,
    ROOT_ELEMENT
);
