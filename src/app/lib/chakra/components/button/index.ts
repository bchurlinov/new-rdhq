export const Button = {
    baseStyle: {
        borderRadius: "5px",
        fontWeight: "400",
    },
    sizes: {
        sm: {
            fontSize: "sm",
            px: 4,
            py: 3,
        },
        md: {
            fontSize: "md",
            px: 8,
            py: 7,
        },
    },
    variants: {
        solid: {
            bg: "brand.primary",
            fontSize: "1.5rem",
            color: "#ffffff",
            height: "3.5rem",
            _hover: {
                bg: "brand.primaryHover",
                _disabled: {
                    bg: "brand.primaryHover",
                },
            },
            _disabled: {
                bg: "brand.primaryHover",
            },
            _focus: {
                outline: "0",
                boxShadow: "none",
            },
            _active: {
                boxShadow: "none",
            },
        },
        outline: {
            bg: "#ffffff",
            fontSize: "1.5rem",
            borderColor: "brand.primary",
            height: "3.5rem",
            color: "brand.primary",
            _hover: {
                color: "brand.primaryHover",
                borderColor: "brand.primaryHover",
                bg: "#ffffff",
            },
            _focus: {
                bg: "transparent",
                outline: "0",
                boxShadow: "none",
            },
            _active: {
                bg: "transparent",
                boxShadow: "none",
            },
        },
        ghost: {
            fontSize: "1.5rem",
            borderBottomWidth: "1px",
            borderColor: "text.primaryColor",
            padding: "0.35rem 1rem",
            borderRadius: "0",
            height: "3.5rem",
            _hover: {
                color: "brand.primaryHover",
                borderColor: "brand.primaryHover",
                bg: "transparent",
                _disabled: {
                    bg: "brand.primaryHover",
                },
            },
            _focus: {
                bg: "transparent",
                outline: "0",
                boxShadow: "none",
            },
            _active: {
                bg: "transparent",
            },
        },
        text: {
            fontSize: "1.5rem",
            padding: 0,
            color: "brand.primary",
            _hover: {
                color: "brand.primaryHover",
                textDecoration: "underline1",
            },
            _focus: {
                bg: "transparent",
                outline: "0",
                boxShadow: "none",
            },
            _active: {
                bg: "transparent",
            },
        },
    },
    defaultProps: {
        size: "md",
        variant: "solid",
    },
};
