import API from "app/utils/api/axios";

export const reportBrokenLinkClass = (id: string, brokenLinks: number[]): string => {
    if (brokenLinks.includes(+id)) return "isDisabled";
    return "";
};

export const asyncSponsorsTracking = async (pk: number): Promise<void> => {
    await API.get(`/api/sponsors/${pk}/open/`);
};
