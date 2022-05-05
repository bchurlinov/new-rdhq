import React, { ReactElement, useState, useEffect } from "react";
import { Button, Heading, SkeletonText } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useAppDispatch, useAppSelector } from "app/store/hooks/use_store";
import { toggleImportRaceModal } from "app/store/misc/misc.slice";
import useToastMessage from "app/hooks/useToastMessage";
import UpcomingRaces from "app/components/templates/races/upcoming_races";
import PastRaces from "app/components/templates/races/past_races";
import Storage from "app/utils/storage/local";
import STORAGE_CONSTANTS from "app/constants/storage";
import { _isEmpty } from "app/utils/helpers";
import "./index.scss";

/**
 * TODO Add animation when past/upcoming toggle appears
 */

const Races = (): ReactElement => {
    const dispatch = useAppDispatch();
    const { races } = useAppSelector((state) => state.races);
    const [raceType, setRaceType] = useState<"past" | "upcoming">("upcoming");
    const importRaceErrorMessage = Storage.get(STORAGE_CONSTANTS.importRaceErrorMessage);

    // Display Import Race Modal depending on the local storage value
    useEffect(() => {
        const importModalVisible = Storage.get(STORAGE_CONSTANTS.importRaceModalVisible);
        // const importRaceErrorMessage = Storage.get(STORAGE_CONSTANTS.importRaceErrorMessage);
        if (importModalVisible) {
            dispatch(toggleImportRaceModal());
            Storage.remove(STORAGE_CONSTANTS.importRaceModalVisible);
        }
    }, [dispatch]);

    // Display error toast in case of import race error
    useToastMessage({
        message: importRaceErrorMessage,
        type: "error",
        storage: STORAGE_CONSTANTS.importRaceErrorMessage,
        isVisible: !_isEmpty(Storage.get(STORAGE_CONSTANTS.importRaceErrorMessage)),
    });

    const raceTypeHandler = (type: "past" | "upcoming"): void => setRaceType(type);
    const buttonVariant = (type: "past" | "upcoming"): "solid" | "outline" =>
        raceType === type ? "solid" : "outline";

    const renderRaceContent = (): JSX.Element =>
        raceType === "upcoming" ? <UpcomingRaces /> : <PastRaces />;

    return (
        <div className="races">
            <Heading as="h1">My Races</Heading>
            <div className="races__top">
                <div className="races__top-item race-selection">
                    {races.upcoming.isLoading ? (
                        <div style={{ width: "250px" }}>
                            <SkeletonText
                                startColor="grey.300"
                                endColor="grey.200"
                                mt="2"
                                noOfLines={1}
                                skeletonHeight="3"
                                fadeDuration={1000}
                            />
                        </div>
                    ) : (
                        <>
                            <Button
                                onClick={() => raceTypeHandler("upcoming")}
                                variant={buttonVariant("upcoming")}
                                size="sm"
                            >
                                Upcoming
                            </Button>
                            <Button
                                onClick={() => raceTypeHandler("past")}
                                variant={buttonVariant("past")}
                                size="sm"
                            >
                                Past
                            </Button>
                        </>
                    )}
                </div>
                <div className="races__top-item">
                    <Button onClick={() => dispatch(toggleImportRaceModal())}>
                        <AddIcon />
                        Add Race
                    </Button>
                </div>
            </div>
            <div className="races__content">{renderRaceContent()}</div>
        </div>
    );
};

export default Races;
