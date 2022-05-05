import React from "react";
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from "@chakra-ui/react";
import { FieldInputProps, FormikState } from "formik";
import { fieldError } from "app/utils/helpers/formik";

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
    setFieldValue: (name: string, val: number) => void;
}) => {
    const error = fieldError(form, field);

    return (
        <FormControl isInvalid={error} className={className}>
            <FormLabel htmlFor={field.name}>
                {label} {required ? <span>*</span> : null}
            </FormLabel>

            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <NumberInput
                min={1}
                defaultValue={field.value}
                size="lg"
                onChange={(valString, valNum) => setFieldValue(field.name, valNum)}
                onBlur={field.onBlur}
            >
                <NumberInputField id={field.name} className="add-race__number" h={14} />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>

            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
};
