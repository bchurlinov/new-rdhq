import React, { useMemo } from "react";
import { FormControl, FormErrorMessage, FormLabel, Select } from "@chakra-ui/react";
import { FieldInputProps, FormikState } from "formik";
import { fieldError } from "app/utils/helpers/formik";

export default ({
    label,
    required,
    options,
    field,
    form,
    className,
}: {
    label: string;
    required: boolean;
    options: any;
    field: FieldInputProps<any>;
    form: FormikState<string>;
    className?: string;
}) => {
    const allOptions = useMemo(() => {
        if (!options) return [];
        // This is for timezones, regions and types
        if (Array.isArray(options)) {
            return options.map((o) => ({
                key: o.pk,
                label: o.display_name || o.name,
                value: JSON.stringify(o),
            }));
        }
        // This is for participants and distance_units
        return Object.keys(options || {}).map((key) => ({
            key: options[key],
            label: options[key],
            value: key,
        }));
    }, [options]);

    const error = fieldError(form, field);

    // We use additional function, because Chakra doesn't support objects as values
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let objValue;
        const { value: val } = e.target;
        try {
            // eslint-disable-next-line quotes
            objValue = val.includes('"') ? JSON.parse(val) : val;
        } catch (e) {
            console.error("Error parsing", e);
        }
        field.onChange({ target: { name: field.name, value: objValue } });
    };

    const calculatePlaceholder = (): string => {
        if (!field?.value || !options) return "Choose";
        if (!Array.isArray(options) && options?.[field.value]) return options[field.value];
        const { code, name } = field.value;
        let find;
        if (code) find = options.find((o: any) => o.code === code);
        else if (name) find = options.find((o: any) => o.name === name);

        return find?.display_name || find?.name || "Choose";
    };

    return (
        <FormControl isInvalid={!!error} className={className}>
            <FormLabel htmlFor={field.name}>
                {label} {required ? <span>*</span> : null}
            </FormLabel>
            <Select
                id={field.name}
                size="lg"
                h={14}
                className="add-race__select"
                placeholder={calculatePlaceholder()}
                // eslint-disable-next-line react/jsx-props-no-spreading
                name={field.name}
                value={JSON.stringify(field.value)}
                onChange={handleChange}
                onBlur={field.onBlur}
            >
                {allOptions.map((item: any) => (
                    <option key={item.key} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </Select>
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
};
