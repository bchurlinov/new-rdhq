import * as yup from "yup";

// Login types
export type UserLoginType = {
    email: string;
    password: string;
};

export interface IFormikLogin {
    initialValues: {
        email: string;
        password: string;
    };
    validationSchema: yup.SchemaOf<UserLoginType>;
    onSubmit: (arg: { email: string; password: string }) => void;
}

export const UserLoginSchema = yup.object().shape({
    email: yup.string().required("This field is required").email("Must be a valid email"),
    password: yup.string().required("This field is required").ensure(),
});

// Register types
export type UserRegisterType = {
    email: string;
    username: string;
    password1: string;
};

export interface IFormikRegister {
    initialValues: {
        username: string;
        email: string;
        password1: string;
    };
    validationSchema: yup.SchemaOf<UserRegisterType>;
    onSubmit: (arg: { username: string; email: string; password1: string }) => void;
}

export const UserSignUpSchema = yup.object().shape({
    username: yup
        .string()
        .ensure()
        .required("This field is required")
        .min(4, "Ensure this field has at least 4 characters.")
        .max(100, "Ensure this field has 100 character at most"),
    email: yup.string().required("This field is required").email("Must be a valid email"),
    password1: yup
        .string()
        .required("This field is required")
        .ensure()
        .min(8, "This password is too short. It must contain at least 8 characters."),
});

// Reset password types
export type ResetPasswordType = {
    email: string;
};
export interface IFormikResetPassword {
    initialValues: {
        email: string;
    };
    validationSchema: yup.SchemaOf<ResetPasswordType>;
    onSubmit: (arg: { email: string }) => void;
}

export const UserPasswordResetSchema = yup.object().shape({
    email: yup.string().required("This field is required").email("Must be a valid email"),
});

// Add new password
export type NewPasswordsType = {
    new_password1: string;
    new_password2: string;
};

export interface IFormikNewPassword {
    initialValues: {
        new_password1: string;
        new_password2: string;
    };
    validationSchema: yup.SchemaOf<NewPasswordsType>;
    onSubmit: (arg: { new_password1: string; new_password2: string }) => void;
}

export const UserNewPasswordSchema = yup.object().shape({
    new_password1: yup
        .string()
        .required("This field is required")
        .ensure()
        .min(8, "This password is too short. It must contain at least 8 characters."),
    new_password2: yup
        .string()
        .required("This field is required")
        .ensure()
        .min(8, "This password is too short. It must contain at least 8 characters.")
        .oneOf([yup.ref("new_password1"), null], "Passwords must match"),
});
