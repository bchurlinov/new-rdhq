import React, { ReactElement, useState } from "react";
import { useAppDispatch } from "app/store/hooks/use_store";
import { IUser } from "app/store/types/user.types";
import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Text } from "@chakra-ui/react";
import "./index.scss";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { RaceDetailsType } from "app/types/races/race.types";
import { Field, FieldArray, Form, Formik, FormikHelpers } from "formik";
import {
    FormikInput,
    FormikSelect,
    FormikTextArea,
    FormikDatePicker,
} from "app/components/elements/Formik";
import { raceValidationSchema } from "app/utils/validation/raceValidationSchema";
import { createAsyncRace, updateAsyncRace } from "app/store/races/races.actions";
import { useNavigate } from "react-router-dom";
import URL from "app/constants/route_urls";
import uploadIcon from "../../../../assets/icons/upload.svg";
import RaceEvent from "./RaceEvent";

/**
 * TODO Add Error scenario when the user attempts to enter an invalid PK number
 * TODO Add EVENTS OBJ and set state so we can then set values with the onChange event
 * TODO Fetch the appropriate data from the Parent Component
 * TODO Improve error handling and displaying errors (line 53), especially for 500
 * TODO If the user changes language reload the SELECT data again
 */
const AddEditRace = ({
    mode,
    user,
    formData,
    raceData,
}: {
    mode: "edit" | "add";
    user: IUser;
    formData: any;
    raceData: RaceDetailsType;
}): ReactElement => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    const eventAddHandler = (push: (val: object) => void) => {
        push({ id: `${Math.random()}`, title: "" });
    };
    const submitRace = async (values: RaceDetailsType, actions: FormikHelpers<RaceDetailsType>) => {
        const response: { error?: any; payload: any; meta: any; type: string } = await dispatch(
            mode === "edit" ? updateAsyncRace(values) : createAsyncRace(values)
        );
        if (response?.error) {
            // Render server-side validation error
            Object.entries(response.payload as any).forEach(([key, value]) => {
                if (Array.isArray(value)) actions.setFieldError(key, value[0]);
            });
            return;
        }
        navigate(URL.RACES);
    };

    const removeLogoPreview = (setFieldValue: (field: string, value: any) => void): void => {
        setFieldValue("logo", undefined);
    };

    const customLogoHandler = (
        event: React.SyntheticEvent<any>,
        setFieldValue: (field: string, value: any) => void,
        setErrorValue: (field: string, message: string) => void
    ): void => {
        const imageFile = event.currentTarget.files[0];
        const imageSize = imageFile.size / 1024 / 1024;
        const reader = new FileReader();

        if (imageSize >= 2) {
            setErrorValue("logo", "Image file size should not exceed 2 mb");
            // eslint-disable-next-line no-param-reassign
            event.currentTarget.value = null;
            return;
        }

        if (!imageFile) return;

        if (
            imageFile.type.includes("image/png") ||
            imageFile.type.includes("image/jpeg") ||
            imageFile.type.includes("image/jpg")
        ) {
            reader.readAsDataURL(imageFile);
            reader.onload = () => {
                setFieldValue("logo", { base64: reader.result });
            };
            reader.onerror = (err) => console.log(err);
        } else {
            setErrorValue("logo", "Only .jpg, .jpeg, .png file types are accepted");
        }
    };

    return (
        <Formik
            validateOnChange={false}
            initialValues={raceData}
            validationSchema={raceValidationSchema}
            onSubmit={submitRace}
        >
            {({ values, errors, isSubmitting, setFieldValue, setFieldError }) => (
                <Form id="race-wrap">
                    <Heading as="h1" my={0}>
                        {mode === "edit" ? `Edit ${values.name}` : "Add race"}
                    </Heading>
                    <Text mt={3} mb="40px" fontSize="xl">
                        Fields marked with (<span>*</span>) are required
                    </Text>

                    <div className="add-race">
                        <div className="add-race__first-row">
                            <Field label="Race name" name="name" required component={FormikInput} />
                            <Field
                                label="Race date"
                                name="start_date"
                                required
                                minDate={new Date()}
                                setFieldValue={(key: string, value: Date | null) =>
                                    setFieldValue(key, value)
                                }
                                dateFormat="yyyy-MM-dd"
                                component={FormikDatePicker}
                            />
                            <Field
                                label="Race type"
                                name="type"
                                required
                                options={formData?.types}
                                component={FormikSelect}
                            />
                        </div>
                        {/* Second Row */}

                        <div className="add-race__second-row">
                            <Field
                                label="Race description"
                                name="description"
                                required
                                component={FormikTextArea}
                            />
                        </div>
                        {/* Third Row */}

                        <div className="add-race__third-row">
                            <Field label="Venue" name="venue" component={FormikInput} />
                            <Field
                                label="Address"
                                name="address"
                                required
                                component={FormikInput}
                            />
                        </div>

                        {/* Fourth Row */}

                        <div className="add-race__fourth-row">
                            <Field
                                label="City"
                                name="city"
                                required
                                className="add-race__city-input"
                                component={FormikInput}
                            />
                            <Field
                                label="Region"
                                name="region"
                                required
                                options={formData?.regions}
                                className="add-race__region-input"
                                component={FormikSelect}
                            />
                            <Field
                                label="Postal code"
                                name="postal_code"
                                required
                                component={FormikInput}
                                className="add-race__postal-code-input"
                            />
                            <Field
                                label="Timezone"
                                name="timezone"
                                required
                                options={formData?.timezones}
                                className="add-race__timezone-input"
                                component={FormikSelect}
                            />
                        </div>

                        {/* Single Row */}

                        <div className="add-race__single-row">
                            <Field
                                label="Race website"
                                name="website"
                                required
                                component={FormikInput}
                            />
                        </div>

                        {/* Single Row */}

                        <div className="add-race__single-row">
                            <Field
                                label="Race registration page"
                                name="registration_page"
                                required
                                component={FormikInput}
                            />
                        </div>
                        {/* !TODO optimize in separate component */}
                        <Field name="logo">
                            {({ field, form }: any) => (
                                <FormControl
                                    isInvalid={form.errors.logo && form.touched.logo}
                                    className="add-race__upload"
                                >
                                    <FormLabel htmlFor="race_logo" data-label="upload-label">
                                        Race logo (<span>*</span>)
                                    </FormLabel>
                                    <div className="add-race__upload-logo-wrap">
                                        {field.value && (
                                            <div className="add-race__upload-logo-wrap-item">
                                                <img
                                                    src={field.value?.base64 || field.value.url}
                                                    alt={form.values.name}
                                                    className={`add-race__upload-logo-image ${
                                                        imageLoaded
                                                            ? "image-loaded"
                                                            : "image-unloaded"
                                                    }`}
                                                    onLoad={() => setImageLoaded(true)}
                                                    onError={() => {
                                                        // setRaceLogo(undefined);
                                                    }}
                                                />
                                                <div
                                                    data-icon="close"
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => removeLogoPreview(setFieldValue)}
                                                >
                                                    <span>
                                                        <CloseIcon />
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div
                                            className={`add-race__upload-logo-wrap-item ${
                                                errors.logo && form.touched.logo ? "hasError" : ""
                                            }`}
                                        >
                                            <label
                                                htmlFor="add-race-upload-logo"
                                                className="add-race__upload-logo-label"
                                                aria-invalid={!!errors.logo && !!form.touched.logo}
                                            >
                                                <div>
                                                    <img src={uploadIcon} alt="upload icon" />
                                                    <p>
                                                        Max file size: 2mb | Accepted: .jpg, .jpeg,
                                                        .png{" "}
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    id="add-race-upload-logo"
                                                    accept="image/png, image/jpeg, image/jpg"
                                                    onChange={(event) =>
                                                        customLogoHandler(
                                                            event,
                                                            setFieldValue,
                                                            setFieldError
                                                        )
                                                    }
                                                />
                                            </label>
                                            <FormErrorMessage>{errors.logo}</FormErrorMessage>
                                        </div>
                                    </div>
                                </FormControl>
                            )}
                        </Field>
                        {/* EVENTS */}
                        <FieldArray name="events">
                            {({ push, remove }) => (
                                <>
                                    <div className="events">
                                        <Heading as="h4">Events</Heading>
                                        <Heading
                                            as="h6"
                                            mt={3}
                                            mb="40px"
                                            fontSize="lg"
                                            fontWeight="medium"
                                        >
                                            Please provide information for events included in this
                                            race
                                        </Heading>
                                        {values.events.map((event: any, index) => (
                                            <RaceEvent
                                                index={index}
                                                key={event.pk || event.id}
                                                item={event}
                                                setFieldValue={(
                                                    key: string,
                                                    value: string | null
                                                ) => setFieldValue(key, value?.toLocaleString())}
                                                deleteEvent={() => remove(index)}
                                                participants={formData.participants}
                                                distance_units={formData.distance_units}
                                            />
                                        ))}
                                    </div>
                                    {values.events?.length > 3 ? null : (
                                        <div className="add-race__event-header">
                                            <Button onClick={() => eventAddHandler(push)}>
                                                <AddIcon mr={4} /> add event
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </FieldArray>
                    </div>
                    <div className="add-race__errors-submit-actions">
                        <div className="submit-race">
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                disabled={!!Object.keys(errors).length}
                                loadingText="Saving"
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddEditRace;
