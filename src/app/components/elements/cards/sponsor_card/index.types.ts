import { SponsorType } from "app/types/sponsors/sponsor.types";

type SponsorCardUtils = {
    reportLink: (pk: number) => void;
    brokenLinks: number[];
};

export type SponsorCardProps = SponsorType & SponsorCardUtils;
