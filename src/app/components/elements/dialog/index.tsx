import React from "react";
import { IDialog } from "./index.types";
import "./index.scss";

function Dialog({ message, type }: IDialog): JSX.Element {
    return (
        <div className={`dialog-wrap dialog-wrap--${type}`}>
            <p>{message}</p>
        </div>
    );
}

export default Dialog;
