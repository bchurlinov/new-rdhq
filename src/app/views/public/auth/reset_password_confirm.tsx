import React, { ReactElement, useState, useEffect } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import { useNavigate, useMatch } from "react-router-dom";
import { useAppSelector } from "app/store/hooks/use_store";
import { userState } from "app/store/user/user.slice";
import { Button, Input, InputRightElement, InputGroup, Text } from "@chakra-ui/react";
import { useFormik } from "formik";
import {
    UserNewPasswordSchema as validationSchema,
    IFormikNewPassword,
} from "app/lib/validation_schemas/auth.schema";
import { blurred, inputError, errorValidationMessage } from "app/utils/validation";
import { _isEmpty } from "app/utils/helpers";
import Dialog from "app/components/elements/dialog";
import Storage from "app/utils/storage/local";
import logo from "assets/logo.svg";
import URL from "app/constants/route_urls";
import API from "app/utils/api/axios";
import API_URL from "app/constants/api_urls";
import "./index.scss";

function ResetPasswordConfirm(): ReactElement {
    const match = useMatch(URL.VERIFY_PASSWORD_RESET);
    const navigate = useNavigate();

    // Store
    const { isAuthenticated } = useAppSelector(userState);

    const [togglePassword1, setTogglePassword1] = useState<boolean>(false);
    const [togglePassword2, setTogglePassword2] = useState<boolean>(false);
    const [params, setParams] = useState<{ uid: string; token: string }>({ uid: "", token: "" });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiErrors, setApiErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (match && !_isEmpty(match.params)) {
            if ("uid" in match.params && "token" in match.params) {
                setParams({ uid: match.params.uid as string, token: match.params.token as string });
            } else navigate(URL.LOGIN);
        }
    }, [match, navigate]);

    useEffect(() => {
        if (isAuthenticated) navigate(URL.DASHBOARD);
    }, [isAuthenticated, navigate]);

    const { handleSubmit, handleChange, handleBlur, values, errors, touched, resetForm } =
        useFormik({
            initialValues: {
                new_password1: "",
                new_password2: "",
            },
            validationSchema,
            onSubmit: async (values: {
                new_password1: string;
                new_password2: string;
            }): Promise<void> => {
                try {
                    setIsLoading(true);
                    const { newPassword1, newPassword2 }: { [key: string]: string } = values;

                    const { data } = await API.post(API_URL.PASSWORD_RESET_CONFIRM, {
                        newPassword1,
                        newPassword2,
                        uid: params.uid,
                        token: params.token,
                    });

                    Storage.set("password_reset_message", data.detail);
                    resetForm();
                    navigate(URL.LOGIN);
                } catch (error) {
                    setIsLoading(false);
                    setApiErrors(error.response.data);
                }
            },
        } as IFormikNewPassword);

    const displayNonFieldErrors = (): JSX.Element | undefined | null => {
        if (apiErrors && Object.keys(apiErrors).length !== 0) {
            if ("token" in apiErrors || "uid" in apiErrors) {
                return (
                    <Dialog
                        message="Something went wrong. Please use the link we sent you via email and try again"
                        type="error"
                    />
                );
            }
        }
        return null;
    };

    // Button disabled status
    const buttonDisabled = (): boolean | undefined | boolean => {
        const checkValues = Object.values(values).some((val: string) => val.length === 0);
        if (isLoading || (errors && Object.keys(errors).length !== 0 && checkValues)) return true;
        return false;
    };

    return (
        <div className="auth">
            <div className="auth-container">
                <div className="auth-wrap">
                    <div className="auth-wrap__header">
                        <a href="/" rel="noopener noreferrer">
                            <div className="auth-wrap__logo">
                                <img src={logo} alt="logo" />
                            </div>
                        </a>
                    </div>
                    <div className="auth-wrap__content">
                        {displayNonFieldErrors()}
                        <form onSubmit={handleSubmit}>
                            <div className="auth-wrap__form-group">
                                <Text variant="labelDefault">New password</Text>
                                <InputGroup>
                                    <Input
                                        name="new_password1"
                                        type={togglePassword1 ? "text" : "password"}
                                        value={values.new_password1 || ""}
                                        placeholder="Enter your password"
                                        isInvalid={inputError(
                                            "new_password1",
                                            errors,
                                            values,
                                            touched
                                        )}
                                        autoComplete="off"
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            handleChange(event);
                                        }}
                                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            handleBlur(event);
                                            blurred("new_password1", event, errors);
                                        }}
                                    />
                                    <InputRightElement
                                        className="password-icon"
                                        width="4.5rem"
                                        onClick={() => setTogglePassword1(!togglePassword1)}
                                    >
                                        <ViewIcon />
                                    </InputRightElement>
                                </InputGroup>

                                <span className="auth-wrap__span-error">
                                    {errorValidationMessage(
                                        "new_password1",
                                        errors,
                                        values,
                                        touched,
                                        apiErrors
                                    )}
                                </span>
                            </div>

                            <div className="auth-wrap__form-group">
                                <Text variant="labelDefault">Confirm new password</Text>
                                <InputGroup>
                                    <Input
                                        name="new_password2"
                                        type={togglePassword2 ? "text" : "password"}
                                        value={values.new_password2 || ""}
                                        placeholder="Enter your password"
                                        isInvalid={inputError(
                                            "new_password2",
                                            errors,
                                            values,
                                            touched
                                        )}
                                        autoComplete="off"
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            handleChange(event);
                                        }}
                                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            handleBlur(event);
                                            blurred("new_password2", event, errors);
                                        }}
                                    />
                                    <InputRightElement
                                        className="password-icon"
                                        width="4.5rem"
                                        onClick={() => setTogglePassword2(!togglePassword2)}
                                    >
                                        <ViewIcon />
                                    </InputRightElement>
                                </InputGroup>

                                <span className="auth-wrap__span-error">
                                    {errorValidationMessage(
                                        "new_password2",
                                        errors,
                                        values,
                                        touched,
                                        apiErrors
                                    )}
                                </span>
                            </div>

                            <div className="auth-wrap__form-group--submit">
                                <Button
                                    type="submit"
                                    disabled={buttonDisabled()}
                                    isLoading={isLoading}
                                >
                                    Sign in
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordConfirm;
