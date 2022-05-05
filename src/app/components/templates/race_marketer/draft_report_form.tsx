import React, { ReactElement, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/store/hooks/use_store";
import { Input, Text, Button } from "@chakra-ui/react";
import { useFormik } from "formik";
import { blurred, inputError, errorValidationMessage } from "app/utils/validation";
import {
    MarketerFormSchema as validationSchema,
    IFormikMarketerForm,
} from "app/lib/validation_schemas/marketer.schema";
import { postAsyncOrganisationDetails } from "app/store/races/race_marketer.actions";
import { toggleMembersProgramModal, toggleNoListingCreditsModal } from "app/store/misc/misc.slice";
import { timeout } from "app/utils/helpers";
import { updateReportHasUpdated } from "app/store/races/race_marketer.slice";
import useToastMessage from "app/hooks/useToastMessage";
import "./index.scss";

type FormTouchedFields = "organisation" | "org_fname" | "org_lname" | "org_email" | "org_phone";
type FormTouchedTypes = { [field in FormTouchedFields]: boolean };

const DraftReportForm = ({ pk }: { pk: number }): ReactElement => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formError, setFormError] = useState<boolean>(false);
    const [isTouched, setIsTouched] = useState<FormTouchedTypes>({
        organisation: false,
        org_fname: false,
        org_lname: false,
        org_email: false,
        org_phone: false,
    });

    useToastMessage({
        message: "Something went wrong. Please try again.",
        type: "error",
        isVisible: formError,
    });

    const setTouchedStatus = (field: FormTouchedFields): void => {
        if (isTouched[field]) return;
        setIsTouched({
            ...isTouched,
            [field]: true,
        });
    };

    const { handleSubmit, handleChange, handleBlur, values, errors, touched, resetForm } =
        useFormik({
            initialValues: {
                organisation: "",
                org_fname: "",
                org_lname: "",
                org_email: "",
                org_phone: "",
            },
            validationSchema,
            onSubmit: async (args): Promise<void> => {
                // Check if user has member status
                if (user.plan_upgradeable) {
                    dispatch(toggleMembersProgramModal());
                    return;
                }

                // Check if the user has member status and listing credits
                if (!user.plan_upgradeable && !user.has_listing_credits) {
                    dispatch(toggleNoListingCreditsModal());
                    return;
                }

                setIsLoading(true);
                const response = await dispatch(postAsyncOrganisationDetails({ pk, args }));

                if (response.meta.requestStatus === "fulfilled") {
                    setIsLoading(false);
                    resetForm();
                    dispatch(updateReportHasUpdated());
                }

                if (response.meta.requestStatus === "rejected") {
                    setIsLoading(false);
                    setFormError(true);
                    timeout(() => setFormError(false), 1000);
                }
            },
        } as IFormikMarketerForm);

    // Buttton's disabled status
    const buttonDisabled = (): boolean => {
        const checkValues = Object.values(values).some((val: string) => val.length === 0);
        if (isLoading || (errors && Object.keys(errors).length !== 0) || checkValues) return true;
        return false;
    };

    return (
        <div className="race-marketer__draft-report-form">
            <form onSubmit={handleSubmit} className="race-marketer__draft-report-form-wrap">
                <div className="race-marketer__draft-report-from-group">
                    <Text variant="labelDefault">Name of your organisation</Text>
                    <Input
                        name="organisation"
                        type="text"
                        value={values.organisation || ""}
                        isInvalid={inputError("organisation", errors, values, touched)}
                        autoComplete="off"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(event);
                        }}
                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleBlur(event);
                            blurred("organisation", event, errors);
                            setTouchedStatus("organisation");
                        }}
                    />
                    <span className="race-marketer__span-error">
                        {isTouched.organisation &&
                            errorValidationMessage("organisation", errors, values, touched, {})}
                    </span>
                </div>
                <div className="race-marketer__draft-report-from-group">
                    <Text variant="labelDefault">Race contact first name</Text>
                    <Input
                        name="org_fname"
                        type="text"
                        value={values.org_fname || ""}
                        isInvalid={inputError("org_fname", errors, values, touched)}
                        autoComplete="off"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(event);
                        }}
                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleBlur(event);
                            blurred("org_fname", event, errors);
                            setTouchedStatus("org_fname");
                        }}
                    />
                    <span className="race-marketer__span-error">
                        {isTouched.org_fname &&
                            errorValidationMessage("org_fname", errors, values, touched, {})}
                    </span>
                </div>
                <div className="race-marketer__draft-report-from-group">
                    <Text variant="labelDefault">Race contact last name</Text>
                    <Input
                        name="org_lname"
                        type="text"
                        value={values.org_lname || ""}
                        isInvalid={inputError("org_lname", errors, values, touched)}
                        autoComplete="off"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(event);
                        }}
                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleBlur(event);
                            blurred("org_lname", event, errors);
                            setTouchedStatus("org_lname");
                        }}
                    />
                    <span className="race-marketer__span-error">
                        {isTouched.org_lname &&
                            errorValidationMessage("org_lname", errors, values, touched, {})}
                    </span>
                </div>
                <div className="race-marketer__draft-report-from-group">
                    <Text variant="labelDefault">Race contact email</Text>
                    <Input
                        name="org_email"
                        type="email"
                        value={values.org_email || ""}
                        isInvalid={inputError("org_email", errors, values, touched)}
                        autoComplete="off"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(event);
                        }}
                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleBlur(event);
                            blurred("org_email", event, errors);
                            setTouchedStatus("org_email");
                        }}
                    />
                    <span className="race-marketer__span-error">
                        {isTouched.org_email &&
                            errorValidationMessage("org_email", errors, values, touched, {})}
                    </span>
                </div>
                <div className="race-marketer__draft-report-from-group">
                    <Text variant="labelDefault">Race contact phone</Text>
                    <Input
                        name="org_phone"
                        type="text"
                        value={values.org_phone || ""}
                        isInvalid={inputError("org_phone", errors, values, touched)}
                        autoComplete="off"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(event);
                        }}
                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleBlur(event);
                            blurred("org_phone", event, errors);
                            setTouchedStatus("org_phone");
                        }}
                    />
                    <span className="race-marketer__span-error">
                        {isTouched.org_phone &&
                            errorValidationMessage("org_phone", errors, values, touched, {})}
                    </span>
                </div>
                <div className="race-marketer__draft-report-from-group">
                    <Button type="submit" disabled={buttonDisabled()} isLoading={isLoading}>
                        List race
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default DraftReportForm;
