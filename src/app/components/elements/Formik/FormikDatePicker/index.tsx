import React, { HTMLAttributes } from "react";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import { FormControl, FormErrorMessage, FormLabel, useColorMode } from "@chakra-ui/react";

import "react-datepicker/dist/react-datepicker.css";
import "./index.scss";
import { FieldInputProps, FormikState } from "formik";
import { fieldError } from "app/utils/helpers/formik";

interface FormikProps {
    label: string;
    required: boolean;
    field: FieldInputProps<string>;
    form: FormikState<string>;
    className?: string;
    setFieldValue: (fieldName: string, value: string | null) => void;
}

const FormikDatePicker = ({
    label,
    required,
    field,
    form,
    className,
    setFieldValue,
    isClearable = false,
    showPopperArrow = false,
    ...props
}: FormikProps & ReactDatePickerProps & HTMLAttributes<HTMLElement>) => {
    const isLight = useColorMode().colorMode === "light"; // you can check what theme you are using right now however you want
    const error = fieldError(form, field);

    return (
        <FormControl
            isInvalid={!!error}
            className={`${className || ""} ${isLight ? "light-theme" : "dark-theme"} ${
                error ? "hasError" : ""
            }`}
        >
            <FormLabel htmlFor={field.name}>
                {label} {required ? <span>*</span> : null}
            </FormLabel>
            <ReactDatePicker
                id={field.name}
                selected={field.value ? new Date(field.value) : null}
                isClearable={isClearable}
                showPopperArrow={showPopperArrow}
                className="react-datapicker__input-text" // input is white by default and there is no already defined class for it so I created a new one
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
                onChange={(value: Date) =>
                    setFieldValue(field.name, value?.toLocaleDateString("fr-CA"))
                }
                onBlur={field.onBlur}
                ariaInvalid={error ? "true" : undefined}
            />
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
};

export default FormikDatePicker;
