import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { Button, Input, Text } from "@chakra-ui/react";
import Dialog from "app/components/elements/dialog";
import API_URL from "app/constants/api_urls";
import URL from "app/constants/route_urls";
import {
    IFormikResetPassword,
    UserPasswordResetSchema as validationSchema,
} from "app/lib/validation_schemas/auth.schema";
import { useAppSelector } from "app/store/hooks/use_store";
import { userState } from "app/store/user/user.slice";
import API from "app/utils/api/axios";
import { _isEmpty } from "app/utils/helpers";
import Storage from "app/utils/storage/local";
import { blurred, errorValidationMessage, inputError } from "app/utils/validation";
import logo from "assets/logo.svg";
import axios from "axios";
import { useFormik } from "formik";

import { Link, useNavigate } from "react-router-dom";
import "./index.scss";

function PasswordReset(): ReactElement {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const cancelAxios = useMemo(() => axios.CancelToken.source(), []);

    // Store
    const { isAuthenticated } = useAppSelector(userState);

    // Clean up
    useEffect(() => () => cancelAxios.cancel(), [cancelAxios]);

    useEffect(() => {
        if (isAuthenticated) navigate(URL.DASHBOARD);
    }, [isAuthenticated, navigate]);

    const { handleSubmit, handleChange, handleBlur, values, errors, touched, resetForm } =
        useFormik({
            initialValues: {
                email: Storage.get("login_email") || "",
            },
            validationSchema,
            onSubmit: async (values: { email: string }): Promise<void> => {
                try {
                    setError("");
                    setIsLoading(true);

                    const { email }: { [key: string]: string } = values;

                    const { data } = await API.post(
                        API_URL.PASSWORD_RESET,
                        { email },
                        { cancelToken: cancelAxios.token }
                    );

                    setIsLoading(false);

                    Storage.set("password_reset_message", data.detail);
                    Storage.remove("login_email");

                    navigate(URL.LOGIN);
                    resetForm();
                } catch (error) {
                    setIsLoading(false);
                    setError("Something went wrong.Please try again");
                }
            },
        } as IFormikResetPassword);

    // Display back-end errors
    const renderError = () => <Dialog type="error" message={error} />;

    // Button disabled status
    const buttonDisabled = (): boolean => {
        const checkValues = Object.values(values).some((val: string) => val.length === 0);
        if (isLoading || (errors && Object.keys(errors).length !== 0 && checkValues)) return true;
        return false;
    };

    return (
        <div className="auth">
            <div className="auth-container">
                <div className="auth-wrap">
                    <div className="auth-wrap__header">
                        <a href={process.env.REACT_APP_BASE_URL} rel="noopener noreferrer">
                            <div className="auth-wrap__logo">
                                <img src={logo} alt="RDHQ - Main Logo" />
                            </div>
                        </a>
                    </div>
                    <div className="auth-wrap__content">
                        {!_isEmpty(error) && renderError()}
                        <form onSubmit={handleSubmit}>
                            <div className="auth-wrap__form-group">
                                <Text className="auth-wrap__text">
                                    To reset your password, please enter your email below.
                                </Text>
                                <Text variant="labelDefault">Email</Text>
                                <Input
                                    name="email"
                                    placeholder="Your email address"
                                    isInvalid={inputError("email", errors, values, touched)}
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        handleBlur(event);
                                        blurred("email", event, errors);
                                    }}
                                />
                                <span className="auth-wrap__span-error">
                                    {errorValidationMessage("email", errors, values, touched, {})}
                                </span>
                            </div>

                            <div className="auth-wrap__form-group--submit">
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    disabled={buttonDisabled()}
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="auth__linking">
                    <p>
                        Back to <Link to={URL.LOGIN}>sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PasswordReset;
