import React from "react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { FieldInputProps, FormikState } from "formik";
import { fieldError } from "app/utils/helpers/formik";
import TimeField from "react-simple-timefield";

export default ({
    label,
    required,
    field,
    form,
    className,
    setFieldValue,
}: {
    label: string;
    required: boolean;
    field: FieldInputProps<string>;
    form: FormikState<string>;
    className?: string;
    setFieldValue: (fieldName: string, value: string | null) => void;
}) => {
    const error = fieldError(form, field);

    return (
        <FormControl isInvalid={!!error} className={`${className} ${error ? "hasError" : ""}`}>
            <FormLabel htmlFor={field.name}>
                {label} {required ? <span>*</span> : null}
            </FormLabel>
            <TimeField
                value={field.value}
                onChange={(event, value) => {
                    setFieldValue(field.name, value);
                }}
                colon=":"
            />
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
};
