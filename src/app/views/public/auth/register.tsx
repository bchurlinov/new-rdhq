import React, { useState, useMemo, ReactElement, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "app/store/hooks/use_store";
import { AppDispatch } from "app/store";
import { signUpAsyncUser, socialUserLogin } from "app/store/user/user.actions";
import { userState, clearErrors } from "app/store/user/user.slice";
import { ViewIcon } from "@chakra-ui/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Input, InputRightElement, InputGroup, Text } from "@chakra-ui/react";
import { blurred, inputError, errorValidationMessage } from "app/utils/validation";
import { useFormik } from "formik";
import {
    UserSignUpSchema as validationSchema,
    IFormikRegister,
} from "app/lib/validation_schemas/auth.schema";
import { _isEmpty, getUrlParam } from "app/utils/helpers";
import { AsyncDispatch } from "app/store/types/action.types";
import Dialog from "app/components/elements/dialog";
import GoogleAuthLogin from "app/components/modules/google_auth";
import FacebookAuthLogin from "app/components/modules/facebook_auth";
import logo from "assets/logo.svg";
import URL from "app/constants/route_urls";
import "./index.scss";

type FieldTypes = "email" | "password" | "username";

function Register(): ReactElement {
    const dispatch: AppDispatch = useAppDispatch();
    const navigate = useNavigate();
    const location: any = useLocation();

    // Store
    const { authLoading, registerErrors, isAuthenticated } = useAppSelector(userState);

    // On login un-mount clear errors
    useEffect(
        () => () => {
            dispatch(clearErrors());
        },
        [dispatch]
    );

    useEffect(() => {
        if (isAuthenticated) navigate(URL.DASHBOARD);
    }, [isAuthenticated, navigate]);

    // Local state
    const [togglePassword, setTogglePassword] = useState<boolean>(false);
    const [isTouched, setIsTouched] = useState<{
        [field in FieldTypes]: boolean;
    }>({
        username: false,
        email: false,
        password: false,
    });

    // URL Search Param
    const memoizedSearchParams = useMemo(() => getUrlParam(location, "next"), [location]);

    // If the user came from guarded route remember his previous location
    const memoizedFromLocation = useMemo(() => {
        const from = location.state && location.state.from.pathname;
        return from || URL.DASHBOARD;
    }, [location]);

    // Formik
    const { handleSubmit, handleChange, handleBlur, values, errors, touched, resetForm } =
        useFormik({
            initialValues: {
                username: "",
                email: "",
                password1: "",
            },
            validationSchema,
            onSubmit: async (values: any): Promise<void> => {
                const { username, email, password1 }: { [key: string]: string } = values;

                const response: AsyncDispatch<{ [key: string]: string }> = await dispatch(
                    signUpAsyncUser({ username, email, password1 })
                );

                // // When user data is being fetch only then redirect the user
                if (response && response.meta.requestStatus === "fulfilled") {
                    resetForm();
                    navigate(memoizedSearchParams || memoizedFromLocation);
                }
            },
        } as IFormikRegister);

    // Display non-field errors in a dialog box
    const displayNonFieldErrors = (): JSX.Element[] | undefined | null => {
        if (registerErrors && Object.keys(registerErrors).length !== 0) {
            if (registerErrors && !_isEmpty(registerErrors.non_field_errors)) {
                return registerErrors.non_field_errors.map((error: string) => (
                    <Dialog message={error} key={error} type="error" />
                ));
            }
        }
        return null;
    };

    // Button disabled status
    const buttonDisabled = (): boolean => {
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
    const setTouchedStatus = (field: FieldTypes): void => {
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
                            <p>Or, sign up with e-mail</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="auth-wrap__form-group">
                                <Text variant="labelDefault">Username</Text>
                                <Input
                                    name="username"
                                    size="lg"
                                    value={values.username || ""}
                                    placeholder="e.g. Run for Hunger 5K"
                                    isInvalid={inputError("username", errors, values, touched)}
                                    autoComplete="off"
                                    onChange={handleChange}
                                    onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        handleBlur(event);
                                        blurred("username", event, errors);
                                        setTouchedStatus("username");
                                    }}
                                />
                                <span className="auth-wrap__span-error">
                                    {isTouched.username &&
                                        errorValidationMessage(
                                            "username",
                                            errors,
                                            values,
                                            touched,
                                            registerErrors
                                        )}
                                </span>
                            </div>
                            <div className="auth-wrap__form-group">
                                <Text variant="labelDefault">Email</Text>
                                <Input
                                    name="email"
                                    size="lg"
                                    value={values.email || ""}
                                    placeholder="e.g. john@runforthehunger5k.com"
                                    isInvalid={inputError("email", errors, values, touched)}
                                    autoComplete="off"
                                    onChange={handleChange}
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
                                            registerErrors
                                        )}
                                </span>
                            </div>
                            <div className="auth-wrap__form-group">
                                <Text variant="labelDefault">Password</Text>
                                <InputGroup>
                                    <Input
                                        name="password1"
                                        type={togglePassword ? "text" : "password"}
                                        value={values.password1 || ""}
                                        placeholder="Enter your password"
                                        isInvalid={inputError("password1", errors, values, touched)}
                                        autoComplete="off"
                                        onChange={handleChange}
                                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            handleBlur(event);
                                            blurred("password1", event, errors);
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
                                            "password1",
                                            errors,
                                            values,
                                            touched,
                                            registerErrors
                                        )}
                                </span>
                            </div>

                            <div className="auth-wrap__form-group--submit">
                                <Button
                                    type="submit"
                                    disabled={buttonDisabled()}
                                    isLoading={authLoading}
                                >
                                    Sign up
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="auth__linking">
                    <p>
                        Already have an account? <Link to={URL.LOGIN}>Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
