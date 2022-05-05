import React from "react";
import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { FieldInputProps, FormikState } from "formik";
import { fieldError } from "app/utils/helpers/formik";

export default ({
    label,
    required,
    field,
    form,
}: {
    label: string;
    required: boolean;
    field: FieldInputProps<string>;
    form: FormikState<string>;
}) => {
    const error = fieldError(form, field);

    return (
        <FormControl isInvalid={error}>
            <FormLabel htmlFor={field.name}>
                {label} {required ? <span>*</span> : null}
            </FormLabel>
            <Textarea
                id={field.name}
                rows={6}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...field}
            />

            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
};
