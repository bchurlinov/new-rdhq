import React, { useState, useRef, useEffect, ReactElement } from "react";
import { useAppDispatch } from "app/store/hooks/use_store";
import { flushUserStore } from "app/store/user/user.slice";
import { Text, Button } from "@chakra-ui/react";
import URL from "app/constants/route_urls";
import "./index.scss";

type ErrorTypes = {
    errorCode: "404" | "500";
    resetErrorBoundary?: () => void;
};

function ErrorPage(props: ErrorTypes): ReactElement {
    const dispatch = useAppDispatch();

    const { errorCode = "500", resetErrorBoundary = null } = props;
    const firstRef = useRef<number>(0);
    const secondRef = useRef<number>(0);

    const firstErrorCode: number = +errorCode.split("")[0];
    const lastErrorCode: number = +errorCode.split("")[2];

    const firstInterval = useRef<ReturnType<typeof setTimeout>>();
    const secondInterval = useRef<ReturnType<typeof setTimeout>>();

    const randomNum = (): number => Math.floor(Math.random() * 9) + 1;

    const [first, setFirst] = useState<number | null>(null);
    const [second, setSecond] = useState<number | null>(null);

    const intervalWithCallback = React.useCallback((position: "first" | "second"): void => {
        switch (position) {
            case "first": {
                if (firstRef.current > 35) {
                    clearInterval(firstInterval.current as unknown as number);
                    setFirst(firstErrorCode);
                } else {
                    setFirst(randomNum());
                    firstRef.current += 1;
                }
                break;
            }
            case "second": {
                if (secondRef.current > 35) {
                    clearInterval(secondInterval.current as unknown as number);
                    setSecond(lastErrorCode);
                } else {
                    setSecond(randomNum());
                    secondRef.current += 1;
                }
                break;
            }
            default:
        }
    }, []);

    useEffect(() => {
        const first = setInterval(() => intervalWithCallback("first"), 40);
        const second = setInterval(() => intervalWithCallback("second"), 50);

        firstInterval.current = first;
        secondInterval.current = second;

        return () => {
            clearInterval(first);
            clearInterval(second);
        };
    }, [intervalWithCallback]);

    const renderErrorInfo = (): JSX.Element | null => {
        switch (errorCode) {
            case "404":
                return (
                    <>
                        <Text fontSize="6xl">Page not found</Text>
                        <Text fontSize="3xl">
                            We&apos;re sorry, but we can&apos;t find the page you were looking for.
                        </Text>
                    </>
                );
            case "500":
                return (
                    <>
                        <Text fontSize="6xl">
                            It looks like something went wrong. Even champions miss sometimes.
                        </Text>
                        <Text fontSize="3xl">You can either:</Text>
                        <div className="error__cta">
                            <Button
                                type="button"
                                variant="solid"
                                onClick={() => {
                                    dispatch(flushUserStore());
                                    window.location.href = URL.LOGIN;
                                }}
                            >
                                Try again
                            </Button>
                            <span className="error__span-divider">or</span>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    window.location.href = `${process.env.REACT_APP_BASE_URL}/contact`;
                                }}
                            >
                                Contact us
                            </Button>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="error">
            <div className="error__container">
                <div className="ground-color text-center">
                    <div className="container-error-404">
                        <div className="clip">
                            <div className="shadow">
                                <span className="digit thirdDigit">{first}</span>
                            </div>
                        </div>
                        <div className="clip">
                            <div className="shadow">
                                <span className="digit secondDigit">0</span>
                            </div>
                        </div>
                        <div className="clip">
                            <div className="shadow">
                                <span className="digit firstDigit">{second}</span>
                            </div>
                        </div>
                        <div className="msg">
                            OH!
                            <span className="triangle" />
                        </div>
                    </div>
                </div>
                <div className="error__text-content">{renderErrorInfo()}</div>
            </div>
        </div>
    );
}

export default ErrorPage;
