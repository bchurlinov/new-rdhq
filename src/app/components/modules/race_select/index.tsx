import React, { ReactElement, useEffect, useRef, useState } from "react";
import { SkeletonText, Tooltip } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useAppDispatch, useAppSelector } from "app/store/hooks/use_store";
import { getAsyncWidgetRaces } from "app/store/races/races.actions";
import { CurrentRaceType } from "app/store/races/races.types";
import { setCurrentRace } from "app/store/races/races.slice";
import { _isEmpty } from "app/utils/helpers";
import { toggleImportRaceModal } from "app/store/misc/misc.slice";
import Select from "app/components/elements/form/select";
import STORAGE_CONSTANTS from "app/constants/storage";
import Storage from "app/utils/storage/local";
import "./index.scss";

const RaceSelect = (): ReactElement => {
    const [defaultValue, setDefaultValue] = useState<string>("");
    const dispatch = useAppDispatch();
    const races = useAppSelector((state) => state.races);
    const runOnceRef = useRef<boolean>(false);

    // Utility function for parsing the current race value
    const parsedCurrentRaceObject = (value: string): CurrentRaceType => {
        const parsed = JSON.parse(value);
        return { pk: parsed.pk, name: parsed.name, type: parsed.display_group };
    };

    // Change handler
    const currentRaceHandler = (value: string): void => {
        const objData = parsedCurrentRaceObject(value);
        Storage.set(STORAGE_CONSTANTS.currentRace, value);
        dispatch(setCurrentRace(objData));
    };

    // Fetch the races needed for the widget
    useEffect(() => {
        if (races?.racesWidget?.races.length === 0 && !runOnceRef.current) {
            runOnceRef.current = true;
            dispatch(getAsyncWidgetRaces({ display: "menu" }));
        }
    }, [dispatch, races.racesWidget.races]);

    // If a current race is stored in local storage set it to the currentRace store as well
    useEffect(() => {
        const currentRaceFromStorage = Storage.get(STORAGE_CONSTANTS.currentRace);
        if (!_isEmpty(currentRaceFromStorage))
            dispatch(setCurrentRace(parsedCurrentRaceObject(currentRaceFromStorage as string)));
    }, [dispatch]);

    useEffect(() => {
        if (_isEmpty(races.currentRace)) setDefaultValue("");
        if (races.currentRace.name) {
            setDefaultValue(races.currentRace.name);
        }
    }, [races.currentRace]);

    // Render Select content
    const renderRaceSelectContent = (): JSX.Element => {
        if (races.racesWidget.isLoading)
            return (
                <SkeletonText
                    startColor="grey.300"
                    endColor="grey.200"
                    mt="2"
                    noOfLines={1}
                    skeletonHeight="3"
                    fadeDuration={1000}
                />
            );

        return (
            <>
                <div className="top-navbar__race-select-item">
                    <Select
                        name="user_locations"
                        options={races.racesWidget.races}
                        iconVisible={!_isEmpty(races.currentRace.name)}
                        value={defaultValue}
                        disabled={_isEmpty(races.racesWidget.races)}
                        placeholder={races.currentRace.name}
                        onChange={(value: string) => currentRaceHandler(value)}
                        grouped
                        searchable
                    />
                </div>
                <div className="top-navbar__race-select-item">
                    <Tooltip label="Add race" placement="right" variant="primary">
                        <SmallAddIcon onClick={() => dispatch(toggleImportRaceModal())} />
                    </Tooltip>
                </div>
            </>
        );
    };

    return (
        <div
            className={`top-navbar__race-select-wrap ${
                races.racesWidget.isLoading ? "isLoading" : ""
            }`}
        >
            {renderRaceSelectContent()}
        </div>
    );
};

export default RaceSelect;
