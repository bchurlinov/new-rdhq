import URL from "app/constants/route_urls";
import { setCurrentRace } from "app/store/races/races.slice";

/**
 * ! Instead of returning an entire race object ask Panos to return the pk only
 * TODO Set Current race if the user clicks on "View listing report"
 */
export const listingReportActionNavigate = (
    pk: number,
    name: string,
    type: "upcoming" | "past",
    navigate: any,
    dispatch: any
) => {
    const currentRace = { pk, name, type };
    dispatch(setCurrentRace(currentRace));
    navigate(URL.REPORTS);
};
