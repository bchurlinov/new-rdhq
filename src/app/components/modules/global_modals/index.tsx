import React, { ReactElement } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from "app/store/hooks/use_store";
import {
    toggleMembersProgramModal,
    toggleNoListingCreditsModal,
    toggleImportRaceModal,
} from "app/store/misc/misc.slice";
import { importAsyncRace } from "app/store/races/races.actions";
import { timeout } from "app/utils/helpers";
import { clearRaceImportError } from "app/store/races/races.slice";
import Modal from "app/components/elements/layout/modal";
import URL from "app/constants/route_urls";
import Storage from "app/utils/storage/local";
import STORAGE_CONSTANTS from "app/constants/storage";
import ImportRaceModal from "./modals/race_import_modal";
import "./index.scss";

/**
 * TODO Separate each modal into a separate file
 */
const GlobalModals = (): ReactElement => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { modals } = useAppSelector((store) => store.misc);
    const { importedRace } = useAppSelector((store) => store.races);

    const renderMembersProgramModal = (): JSX.Element => (
        <Modal
            visible={modals.membersProgram.isVisible || false}
            closeModal={() => dispatch(toggleMembersProgramModal())}
            title="Get more with our members program"
            actions={{
                primary: {
                    title: "Join - $99/year",
                    action: () => {
                        navigate(URL.MEMBERS_JOIN);
                        dispatch(toggleMembersProgramModal());
                        Storage.set(
                            STORAGE_CONSTANTS.paymentRedirect,
                            location.pathname || URL.DASHBOARD
                        );
                    },
                },
                secondary: {
                    title: "View all member benefits",
                    action: (): void => {
                        window.location.href =
                            `${process.env.REACT_APP_BASE_URL}/member-benefits/` as string;
                    },
                },
            }}
        >
            <div className="payments-modal">
                <Text>Sign up today and get:</Text>
                <ul className="payments-modal__list">
                    <li className="payments-modal__list-item">
                        Access to all our exclusive vendor offers
                    </li>
                    <li className="payments-modal__list-item">
                        Two of your races listed on the web&apos;s most popular race calendars
                    </li>
                    <li className="payments-modal__list-item">
                        Unlimited Sponsor Finder sponsor leads
                    </li>
                </ul>
            </div>
        </Modal>
    );

    const renderNoListingCreditsModal = (): JSX.Element => (
        <Modal
            visible={modals.noListingCredits.isVisible || false}
            closeModal={() => dispatch(toggleNoListingCreditsModal())}
            title="Ooops - you're out of credits"
            actions={{
                primary: {
                    title: "Add credits",
                    action: () => {
                        navigate(URL.LISTING_CREDITS);
                        dispatch(toggleNoListingCreditsModal());
                        Storage.set(
                            STORAGE_CONSTANTS.paymentRedirect,
                            location.pathname || URL.DASHBOARD
                        );
                    },
                },
            }}
        >
            <div className="payments-modal">
                <Text>
                    It looks like you&apos;ve used all your membership listing credits for this
                    year.
                </Text>
                <Text>
                    To purchase additional credits and get on with listing your race, click below.
                </Text>
            </div>
        </Modal>
    );

    return (
        <>
            {renderMembersProgramModal()}
            {renderNoListingCreditsModal()}
            <ImportRaceModal
                navigate={navigate}
                visible={modals.importRaceModal.isVisible}
                isLoading={importedRace.isLoading}
                closeModal={() => {
                    dispatch(toggleImportRaceModal());
                    dispatch(clearRaceImportError());
                }}
                isDisabled={importedRace.isLoading}
                error={importedRace.error}
                importRace={async (url: string) => {
                    const response = await dispatch(importAsyncRace({ url }));
                    if (response?.meta.requestStatus === "fulfilled") {
                        dispatch(toggleImportRaceModal());
                        if (response.payload && typeof response.payload === "number")
                            timeout(() => navigate(`${URL.RACE}${response.payload}`), 500);
                        else timeout(() => navigate(URL.RACE), 500);
                    }
                }}
            />
        </>
    );
};

export default GlobalModals;
