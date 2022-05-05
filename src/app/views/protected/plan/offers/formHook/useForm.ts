import { useState, useCallback } from "react";

const useForm = (initialState: any, validate: any) => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState<any>({});

    // Set form data and errors
    const setDataAndErrors = useCallback(
        (data) => {
            setFormData(data);

            const errors = validate(data);

            setErrors(errors);
        },
        [validate]
    );

    // Change inputs handler
    const changeHandler = useCallback(
        (e) => {
            let updatedData;

            if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
                updatedData = {
                    ...formData,
                    [e.target.name]: {
                        ...formData[e.target.name],
                        value: e.target.checked,
                        touched: true,
                    },
                };
            } else if (e.target.tagName === "INPUT" && e.target.type === "file") {
                updatedData = {
                    ...formData,
                    [e.target.name]: {
                        ...formData[e.target.name],
                        value: e.target.files,
                        touched: true,
                    },
                };
            } else {
                updatedData = {
                    ...formData,
                    [e.target.name]: {
                        ...formData[e.target.name],
                        value: e.target.value,
                        touched: true,
                    },
                };
            }

            setDataAndErrors(updatedData);
        },
        [setDataAndErrors, formData]
    );

    const clearFormData = (): void => setFormData(initialState);

    return {
        formData,
        errors,
        changeHandler,
        setErrors,
        clearFormData,
    };
};

export default useForm;
