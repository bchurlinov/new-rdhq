import React, { ComponentType, ReactElement } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "app/views/misc/error_page";
import chakraTheme from "app/lib/chakra/theme";
import App from "App";
import store from "app/store";

// Fountsource fonts
import "@fontsource/work-sans/300.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/700.css";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/700.css";

const AppProvider = (): ReactElement => (
    <Provider store={store}>
        <ChakraProvider theme={chakraTheme}>
            <ErrorBoundary FallbackComponent={ErrorPage as ComponentType<FallbackProps> | any}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/*" element={<App />} />
                    </Routes>
                </BrowserRouter>
            </ErrorBoundary>
        </ChakraProvider>
    </Provider>
);
export default AppProvider;
