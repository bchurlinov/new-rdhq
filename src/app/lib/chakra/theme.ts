import { extendTheme } from "@chakra-ui/react";
import { Button, Text, Tooltip } from "app/lib/chakra/components";

const chakraTheme = extendTheme({
    fonts: {
        body: "Open Sans",
        heading: "Work Sans",
    },
    colors: {
        brand: {
            primary: "#ee1e82",
            primaryHover: "#cc186e",
            secondary: "purple",
            secondaryHover: "#6e2a98",
        },
        text: {
            primary: "#4a4a4a",
            medium: "#868686",
        },
        grey: {
            100: "#f6f6f6",
            200: "#fafafa",
            250: "#ededed",
            300: "#d3d3d3",
            350: "#e9e9e9",
            400: "#a8a8a8",
            500: "#666666",
        },
        success: "#52c41a",
        error: "#dc3545",
        warning: "#ffca2c",
    },
    styles: {
        global: {
            a: {
                color: "brand.primary",
                fontSize: "1.6rem",
                _hover: {
                    color: "brand.primaryHover",
                    textDecoration: "underline",
                },
            },
            p: {
                fontSize: "1.6rem",
                color: "text.primary",
            },
            li: {
                fontSize: "1.6rem",
                color: "text.primary",
            },
            ul: {
                paddingLeft: "1.3rem",
            },
        },
    },
    components: {
        Button,
        Text,
        Tooltip,
    },
});

export default chakraTheme;
