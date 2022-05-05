/* eslint-disable react/no-danger */
import React, { ReactElement } from "react";
import { Text, Input, Textarea, Heading } from "@chakra-ui/react";
import { _isEmpty } from "app/utils/helpers";
import Dialog from "app/components/elements/dialog";
import useClaimOffer from "app/views/protected/plan/offers/useClaimOffer";
import Modal from "app/components/elements/layout/modal";
import validate from "./formHook/validate";
import useForm from "./formHook/useForm";

const initialState = {
    message: {
        value: "",
        required: true,
        minLength: 50,
        minLengthMessage:
            "Please help vendors better understand your needs by adding a few more details on your request (minimum 50 characters)",
    },
    phone_number: {
        value: "",
        required: true,
        number: true,
    },
};

const VendorOffersModal = ({
    pk,
    title,
    sponsor,
    content,
    claimMode,
    isVisible,
    claimInstructions,
    currentRace,
    footerVisible,
    closeModal,
}: {
    pk: number;
    title: string;
    content: string;
    sponsor: string;
    isVisible: boolean;
    claimMode: "quote" | "instructions";
    claimInstructions: string;
    currentRace: { pk: number; name: string };
    footerVisible: boolean;
    closeModal: () => void;
}): ReactElement => {
    const { isLoading, success, error, handler, clearClaimOffer }: any = useClaimOffer(pk);
    const { formData, errors, changeHandler, setErrors, clearFormData } = useForm(
        initialState,
        validate
    );

    const renderClaimModeContent = (): JSX.Element => {
        if (claimMode === "quote") {
            return (
                <>
                    <div className="vendor-offers-modal__form-group">
                        <Text variant="labelDefault">
                            Your message to <b>{sponsor}</b>
                        </Text>
                        <Textarea
                            id="message"
                            size="lg"
                            resize="vertical"
                            name="message"
                            rows={6}
                            value={formData.message.value}
                            onChange={changeHandler}
                        />
                        <span className="vendor-offers-modal__from-group-span-error">
                            {errors?.message}
                        </span>
                    </div>
                    <div className="vendor-offers-modal__form-group">
                        <Text variant="labelDefault">Your phone number</Text>
                        <Input
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number.value}
                            onChange={changeHandler}
                        />
                        <span className="vendor-offers-modal__from-group-span-error">
                            {errors?.phone_number}
                        </span>
                    </div>
                    <div className="vendor-offers-modal__form-group">
                        <Text variant="labelDefault">Selected race</Text>
                        <Input value={currentRace.name || "Please select a race"} readOnly />
                    </div>
                </>
            );
        }
        return (
            <div className="vendor-offers-modal__instructions-mode">
                <Heading as="h4">To claim this offer:</Heading>
                <div
                    className="vendor-offers-modal__html-content"
                    dangerouslySetInnerHTML={{ __html: claimInstructions }}
                />
            </div>
        );
    };

    // Close modal
    const closeModalHandler = (): void => {
        closeModal();
        clearClaimOffer();
        clearFormData();
    };

    // Disabled button status
    const disabledButton = (): boolean =>
        isLoading || !_isEmpty(errors) || _isEmpty(currentRace) || _isEmpty(formData.message.value);

    const claimOfferAction = async () => {
        const formErrors = validate(formData, true);
        setErrors(formErrors);

        const response = await handler({
            content: formData.message.value,
            author_phone: formData.phone_number.value,
            race: { pk: currentRace.pk },
        });

        if (response) clearFormData();
    };

    return (
        <Modal
            visible={isVisible}
            closeModal={closeModalHandler}
            title={title}
            footerVisible={footerVisible}
            actions={{
                primary: {
                    title: "Claim offer",
                    isLoading,
                    isDisabled: disabledButton(),
                    action: claimOfferAction,
                },
            }}
        >
            {!_isEmpty(success) && (
                <div className="vendor-offers-modal__dialog">
                    <Dialog type="success" message={success} />
                </div>
            )}
            {!_isEmpty(error) && (
                <div className="vendor-offers-modal__dialog">
                    <Dialog type="error" message={error} />
                </div>
            )}
            <div className="vendor-offers-modal">
                <div
                    className="vendor-offers-modal__content"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
                <div className="vendor-offers-modal__form-content">{renderClaimModeContent()}</div>
            </div>
        </Modal>
    );
};

export default VendorOffersModal;
