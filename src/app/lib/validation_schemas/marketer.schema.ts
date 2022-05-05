import * as yup from "yup";

export interface IFormikMarketerForm {
    initialValues: {
        organisation: string;
        org_fname: string;
        org_lname: string;
        org_email: string;
        org_phone: string;
    };
    validationSchema: yup.SchemaOf<RaceMarketerFormType>;
    onSubmit: (arg: {
        organisation: string;
        org_fname: string;
        org_lname: string;
        org_email: string;
        org_phone: string;
    }) => void;
}

export type RaceMarketerFormType = {
    organisation: string;
    org_fname: string;
    org_lname: string;
    org_email: string;
    org_phone: string;
};

export const MarketerFormSchema = yup.object().shape({
    organisation: yup
        .string()
        .required("This field is required")
        .min(2, "At least 2 characters are required"),
    org_fname: yup
        .string()
        .required("This field is required")
        .min(2, "At least 2 characters are required"),
    org_lname: yup
        .string()
        .required("This field is required")
        .min(2, "At least 2 characters are required"),
    org_email: yup.string().required("This field is required").email("Must be a valid email"),
    org_phone: yup
        .string()
        .required("This field is required")
        .matches(/\d+/g, "Must contain numbers"),
});
