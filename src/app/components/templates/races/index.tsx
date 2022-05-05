import React from "react";
import { RaceType } from "app/types/races/race.types";
import { Text } from "@chakra-ui/react";
import { _isEmpty } from "app/utils/helpers";
import RaceCard from "app/components/elements/cards/race_card";

export const renderRaceCards = (races: RaceType[], type: "past" | "upcoming"): JSX.Element[] =>
    races.map((race: RaceType) => (
        <RaceCard
            key={race.pk}
            pk={race.pk}
            name={race.name}
            logo={race.logo}
            city_state={race.city_state}
            display_date={race.display_date}
            listed={race.listed}
            type={type}
        />
    ));

export const renderNoRacesContent = (type: "past" | "upcoming"): JSX.Element => (
    <div className="races__empty-message">
        <Text>You have no {type} races.</Text>
        {type === "upcoming" && <Text> Add a race to start using your dashboard tools.</Text>}
    </div>
);

export const renderRacesContent = (
    isLoading: boolean,
    races: RaceType[]
): JSX.Element[] | JSX.Element | null => {
    if (!isLoading) {
        if (!_isEmpty(races)) return renderRaceCards(races, "upcoming");
        return renderNoRacesContent("upcoming");
    }

    return null;
};
