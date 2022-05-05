import React, { useState } from "react";
import { Text, Input } from "@chakra-ui/react";
import { timeout, _isEmpty } from "app/utils/helpers";
import URL from "app/constants/route_urls";
import Modal from "app/components/elements/layout/modal";
import Dialog from "app/components/elements/dialog";

const ImportRaceModal = ({
    navigate,
    isLoading,
    visible,
    isDisabled,
    error,
    importRace,
    closeModal,
}: {
    navigate: any;
    isLoading: boolean;
    visible: boolean;
    isDisabled: boolean;
    error: string;
    importRace: (arg: string) => void;
    closeModal: () => void;
}): JSX.Element => {
    const [inputValue, setInputValue] = useState<string>("");
    const importButtonDisabled: boolean = _isEmpty(inputValue) || isDisabled;

    const renderDialogError = () => !_isEmpty(error) && <Dialog type="error" message={error} />;

    return (
        <Modal
            visible={visible}
            closeModal={closeModal}
            title="Add a race"
            actions={{
                primary: {
                    title: "Import race",
                    isLoading,
                    isDisabled: importButtonDisabled,
                    action: () => {
                        importRace(inputValue);
                    },
                },
                secondary: {
                    title: "Add race details manually",
                    action: (): void => {
                        closeModal();
                        setInputValue("");
                        timeout(() => navigate(URL.RACE), 500);
                    },
                },
            }}
        >
            <div className="race-import-modal">
                <div
                    className={`race-import-modal__error ${
                        !_isEmpty(error) ? "erroring" : "no-error"
                    }`}
                >
                    {renderDialogError()}
                </div>
                <div className="race-import-modal__info">
                    <Text>
                        Enter your registration page URL below to import your race details directly
                        from your registration page:
                    </Text>
                </div>
                <div className="race-import-modal__input">
                    <Input
                        placeholder="Race registration page URL"
                        value={inputValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setInputValue(event.target.value)
                        }
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ImportRaceModal;
