import React from "react";
import { _isEmpty } from "app/utils/helpers";

// Validation types
type TouchedType = {
    [key: string]: boolean;
};

type ErrorType = { [key: string]: string };
type ValueType = { [key: string]: string };

// Helper functions
export const blurred = (
    keyword: string,
    event: React.ChangeEvent<HTMLInputElement>,
    errors: ErrorType
): void => {
    if (errors && _isEmpty(errors[keyword])) event.currentTarget.classList.remove("input-error");
};

export const inputError = (
    keyword: string,
    errors: ErrorType,
    values: ValueType,
    touched: TouchedType
): boolean => {
    if (errors && !_isEmpty(errors[keyword]) && !_isEmpty(errors) && values[keyword].length) {
        return true;
    }
    if (touched[keyword] && !_isEmpty(errors) && !_isEmpty(errors[keyword])) return true;
    return false;
};

export const errorValidationMessage = (
    keyword: string,
    errors: ErrorType,
    values: ValueType,
    touched: TouchedType,
    backendValidationErrors: ErrorType
): string | undefined => {
    // Back-end validation
    if (backendValidationErrors && !_isEmpty(backendValidationErrors)) {
        return backendValidationErrors[keyword];
    }

    if (values[keyword].length !== 0) return errors[keyword];
    if (values[keyword].length === 0 && touched[keyword]) return errors[keyword];
    return undefined;
};
