import React, { useState, useMemo, ReactElement, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "app/store/hooks/use_store";
import { AppDispatch } from "app/store";
import { loginAsyncUser, socialUserLogin } from "app/store/user/user.actions";
import { userState, clearErrors } from "app/store/user/user.slice";
import { LockIcon, ViewIcon } from "@chakra-ui/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Input, InputRightElement, InputGroup, Text } from "@chakra-ui/react";
import { blurred, inputError, errorValidationMessage } from "app/utils/validation";
import { useFormik } from "formik";
import {
    UserLoginSchema as validationSchema,
    IFormikLogin,
} from "app/lib/validation_schemas/auth.schema";
import { _isEmpty, getUrlParam, timeout } from "app/utils/helpers";
import { AsyncDispatch } from "app/store/types/action.types";
import Dialog from "app/components/elements/dialog";
import GoogleAuthLogin from "app/components/modules/google_auth";
import FacebookAuthLogin from "app/components/modules/facebook_auth";
import Storage from "app/utils/storage/local";
import logo from "assets/logo.svg";
import URL from "app/constants/route_urls";
import "./index.scss";

function Login(): ReactElement {
    const dispatch: AppDispatch = useAppDispatch();
    const navigate = useNavigate();
    const location: any = useLocation();
    const timeoutId = useRef(null);
    const verifyEmailId = useRef(null);

    // Store
    const { authLoading, loginErrors, isAuthenticated } = useAppSelector(userState);

    useEffect(() => {
        if (isAuthenticated) navigate(URL.DASHBOARD);
    }, [isAuthenticated, navigate]);

    // Local state
    const [togglePassword, setTogglePassword] = useState<boolean>(false);
    const [passwordResetMessage, setPasswordResetMessage] = useState<string>("");
    const [verifyEmailError, setVerifyEmailError] = useState<string>("");
    const [isTouched, setIsTouched] = useState<{ email: boolean; password: boolean }>({
        email: false,
        password: false,
    });

    // On login un-mount clear errors
    useEffect(
        () => () => {
            dispatch(clearErrors());
        },
        [dispatch]
    );

    // Cleanup
    useEffect(
        () => () => {
            clearTimeout(timeoutId.current as any);
        },
        []
    );

    // Check for password reset message
    useEffect(() => {
        const passwordReset = Storage.get("password_reset_message");
        const verifyEmailMessage = Storage.get("login_error_message");

        if (!_isEmpty(passwordReset)) {
            setPasswordResetMessage(passwordReset as string);

            const timeoutId = timeout(() => {
                setPasswordResetMessage("");
                Storage.remove("password_reset_message");
            }, 30000);

            timeoutId.current = timeoutId;
        }

        if (!_isEmpty(verifyEmailMessage)) {
            setVerifyEmailError(verifyEmailMessage as string);

            const timeoutId = timeout(() => {
                setPasswordResetMessage("");
                Storage.remove("password_reset_message");
            }, 30000);

            verifyEmailId.current = timeoutId;
        }
    }, []);

    // Get memoized version so the component won't rerender / array dependency
    const memoizedSearchParams = useMemo(() => getUrlParam(location, "next"), [location]);

    // If the user came from guarded route remember his previous location
    const memoizedFromLocation = useMemo(() => {
        let from = location.state && location.state.from.pathname;
        if (from === URL.LOGOUT) from = URL.DASHBOARD;
        return from || URL.DASHBOARD;
    }, [location]);

    // Formik
    const { handleSubmit, handleChange, handleBlur, values, errors, touched, resetForm } =
        useFormik({
            initialValues: {
                email: "",
                password: "",
            },
            validationSchema,
            onSubmit: async (values): Promise<void> => {
                const { email, password }: { [key: string]: string } = values;

                const response: AsyncDispatch<{ [key: string]: string }> = await dispatch(
                    loginAsyncUser({ email, password })
                );

                // When user data is being fetch only then redirect the user
                if (response && response.meta.requestStatus === "fulfilled") {
                    resetForm();
                    navigate(memoizedSearchParams || memoizedFromLocation);
                }
            },
        } as IFormikLogin);

    // If there is url param move that param to the register page as well
    const registerLink = (): string =>
        memoizedSearchParams ? `${URL.REGISTER}?next=${memoizedSearchParams}` : URL.REGISTER;

    // Display non-field errors in a dialog box
    const displayNonFieldErrors = (): JSX.Element[] | undefined | null => {
        if (loginErrors && Object.keys(loginErrors).length !== 0) {
            if (loginErrors && !_isEmpty(loginErrors.non_field_errors)) {
                return loginErrors.non_field_errors.map((error: string) => (
                    <Dialog message={error} key={error} type="error" />
                ));
            }
        }
        return null;
    };

    // Display success message
    const displayDialogMessage = (type: "success" | "error"): JSX.Element | undefined | null => {
        if (!_isEmpty(passwordResetMessage)) {
            return <Dialog type={type} message={passwordResetMessage} />;
        }

        if (!_isEmpty(verifyEmailError)) return <Dialog type={type} message={verifyEmailError} />;
        return null;
    };

    // Button disabled status
    const buttonDisabled = (): boolean | undefined => {
        const checkValues = Object.values(values).some((val: string) => val.length === 0);
        if (authLoading || (errors && Object.keys(errors).length !== 0 && checkValues)) return true;
        return false;
    };

    // Social login function
    const socialLoginHandler = async (
        socialToken: string,
        provider: "google" | "facebook"
    ): Promise<void> => {
        const response: AsyncDispatch<{ provider_token: string; provider: string }> =
            await dispatch(socialUserLogin({ provider_token: socialToken, provider }));

        // Check the status and redirect the user upon successful auth
        if (response && response.meta.requestStatus === "fulfilled")
            navigate(memoizedSearchParams || memoizedFromLocation);
    };

    // Touched Status utility
    const setTouchedStatus = (field: "email" | "password"): void => {
        if (isTouched[field]) return;
        setIsTouched({
            ...isTouched,
            [field]: true,
        });
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
                        {!_isEmpty(passwordResetMessage) && displayDialogMessage("success")}
                        {!_isEmpty(verifyEmailError) && displayDialogMessage("error")}
                        <div className="auth-wrap__auth-status">
                            <p>
                                Don&apos;t have an account?{" "}
                                <Link to={registerLink()}>Sign up now</Link>
                            </p>
                        </div>
                        <div className="auth-wrap__social-group">
                            <GoogleAuthLogin
                                text="Continue with Google"
                                tokenHandler={(token: string) =>
                                    socialLoginHandler(token, "google")
                                }
                            />
                        </div>
                        <div className="auth-wrap__social-group">
                            <FacebookAuthLogin
                                text="Continue with Facebook"
                                tokenHandler={(token: string) =>
                                    socialLoginHandler(token, "google")
                                }
                            />
                        </div>
                        <div className="auth-wrap__divider">
                            <p>Or, sign in with e-mail</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="auth-wrap__form-group">
                                <Text variant="labelDefault">Email</Text>
                                <Input
                                    name="email"
                                    size="lg"
                                    value={values.email || ""}
                                    placeholder="Enter your email address"
                                    isInvalid={inputError("email", errors, values, touched)}
                                    autoComplete="off"
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        Storage.set("login_email", event.target.value);
                                        handleChange(event);
                                    }}
                                    onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        handleBlur(event);
                                        blurred("email", event, errors);
                                        setTouchedStatus("email");
                                    }}
                                />
                                <span className="auth-wrap__span-error">
                                    {isTouched.email &&
                                        errorValidationMessage(
                                            "email",
                                            errors,
                                            values,
                                            touched,
                                            loginErrors
                                        )}
                                </span>
                            </div>
                            <div className="auth-wrap__form-group">
                                <div className="auth-wrap__password-label-wrap">
                                    <Text variant="labelDefault">Password</Text>
                                    <Text variant="labelDefault">
                                        <LockIcon />
                                        <Link to="/reset-password">Forgot your password</Link>
                                    </Text>
                                </div>
                                <InputGroup>
                                    <Input
                                        name="password"
                                        type={togglePassword ? "text" : "password"}
                                        value={values.password || ""}
                                        placeholder="Enter your password"
                                        isInvalid={inputError("password", errors, values, touched)}
                                        autoComplete="off"
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            handleChange(event);
                                        }}
                                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            handleBlur(event);
                                            blurred("password", event, errors);
                                            setTouchedStatus("password");
                                        }}
                                    />
                                    <InputRightElement
                                        className="password-icon"
                                        width="4.5rem"
                                        onClick={() => setTogglePassword(!togglePassword)}
                                    >
                                        <ViewIcon />
                                    </InputRightElement>
                                </InputGroup>

                                <span className="auth-wrap__span-error">
                                    {isTouched.password &&
                                        errorValidationMessage(
                                            "password",
                                            errors,
                                            values,
                                            touched,
                                            loginErrors
                                        )}
                                </span>
                            </div>

                            <div className="auth-wrap__form-group--submit">
                                <Button
                                    type="submit"
                                    disabled={buttonDisabled()}
                                    isLoading={authLoading}
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

export default Login;
