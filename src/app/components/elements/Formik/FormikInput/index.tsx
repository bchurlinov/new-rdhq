import React from "react";
import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { FieldInputProps, FormikState } from "formik";
import { fieldError } from "app/utils/helpers/formik";

export default ({
    label,
    required,
    field,
    form,
    className,
}: {
    label: string;
    required: boolean;
    field: FieldInputProps<string>;
    form: FormikState<string>;
    className?: string;
}) => {
    const error = fieldError(form, field);

    return (
        <FormControl isInvalid={error} className={className}>
            <FormLabel htmlFor={field.name}>
                {label} {required ? <span>*</span> : null}
            </FormLabel>
            <Input
                id={field.name}
                type="text"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...field}
            />

            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
};
