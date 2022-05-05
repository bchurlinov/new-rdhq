import { IUser } from "app/store/types/user.types";
import { RaceDetailsType } from "app/types/races/race.types";
import { _isEmpty } from "app/utils/helpers";
import { MutableRefObject } from "react";

export const defaultRaceData = (
    race: any,
    raceMode: MutableRefObject<string>,
    user: IUser
): RaceDetailsType => {
    let raceLogo: object | undefined;
    let raceType:
        | { pk?: number; name?: string; discipline?: string; display_name?: string }
        | undefined;

    // This will be true in case of edit or import-add, for add 'race' is empty
    if (!_isEmpty(race)) {
        // Race Type should be in format {name:'urlString', discipline:'urlString'}
        // Logo should be in format {url:'urlString'} or {base64:'data:string'}
        if (raceMode.current === "add") {
            const { name, discipline_name, discipline__name } = race.type;
            raceType = {
                name,
                discipline: discipline_name || discipline__name,
            };

            raceLogo = race?.logo;
        } else if (raceMode.current === "edit") {
            raceType = race?.type;
            raceLogo = { url: race.logo || "" };
        }
    }
    const { pk, username, email, location } = user;
    // On import mode there is no pk, so we generate random id for each event
    const events = race.events?.length
        ? race.events.map((ev: any) => (ev.pk ? ev : { ...ev, id: Math.random() }))
        : [
              {
                  // id is added only for array key purposes
                  id: Math.random(),
                  name: "",
                  distance: "",
                  distance_units: "",
                  start_time: "",
                  entry_fee: "",
                  participants: "",
              },
          ];

    return {
        owner: { pk, username, email },
        country: location,
        pk: race.pk,
        name: race.name || "",
        description: race.description || "",
        address: race.address || "",
        city: race.city || "",
        // This id is generated as a substitute to event.pk
        events,
        logo: raceLogo,
        postal_code: race.postal_code || "",
        region: race.region,
        registration_page: race.registration_page || "",
        start_date: race.start_date || "",
        timezone: race.timezone,
        type: raceType as any,
        venue: race.venue || "",
        website: race.website || "",
    };
};
