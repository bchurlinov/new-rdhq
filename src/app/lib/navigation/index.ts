import URL from "app/constants/route_urls";
import racesIcon from "assets/icons/races-menu-icon.svg";
import calendarIcon from "assets/icons/race-calendar-menu-icon.svg";
import vendorsIcon from "assets/icons/vendor-offers-menu-icon.svg";
import documentsIcon from "assets/icons/documents-menu-icon.svg";
import sponsorFinderIcon from "assets/icons/sponsor-finder-menu-icon.svg";
import budgetBuilderIcon from "assets/icons/budget_builder.svg";
import eisWizardIcon from "assets/icons/eis_wizard.svg";

import { SideNavParent } from "./types";

export type SideNavDataType = SideNavParent[];

export const sideNavData: SideNavDataType = [
    {
        id: 1,
        title: "",
        type: "races",
        children: [
            // {
            //     id: 1 - 1,
            //     title: "Home",
            //     img: documentsIcon,
            //     imgAlt: "dashboard",
            //     type: "home",
            //     href: URL.DASHBOARD,
            //     label: "Home",
            //     current: true,
            // },
            {
                id: 1 - 2,
                title: "My races",
                img: racesIcon,
                imgAlt: "rdhq_races",
                type: "races",
                href: URL.RACES,
                label: "My races",
                current: true,
            },
        ],
    },
    {
        id: 2,
        title: "Plan",
        type: "offers",
        children: [
            {
                id: 2 - 1,
                title: "Vendor Offers",
                img: vendorsIcon,
                imgAlt: "rdhq_offers",
                type: "offers",
                href: URL.OFFERS,
                label: "Vendor Offers",
                current: true,
            },
            {
                id: 2 - 2,
                title: "Budget Builder",
                img: budgetBuilderIcon,
                imgAlt: "rdhq_budget_builder",
                type: "budget_builder",
                href: "",
                label: "Coming soon",
                current: false,
            },
            {
                id: 2 - 3,
                title: "Sponsor Finder",
                img: sponsorFinderIcon,
                imgAlt: "rdhq_sponsor_finder",
                type: "sponsor-finder",
                href: URL.SPONSORS,
                label: "Sponsor Finder",
                current: true,
            },
            {
                id: 2 - 4,
                title: "Docs & Templates",
                img: documentsIcon,
                imgAlt: "rdhq_documents_templates",
                type: "documents",
                href: URL.DOCUMENTS,
                label: "Docs & Templates",
                current: true,
            },
        ],
    },
    {
        id: 3,
        title: "Promote",
        type: "cal_submit",
        children: [
            {
                id: 3 - 1,
                title: "Race Calendar Marketer",
                img: calendarIcon,
                imgAlt: "rdhq_calendars",
                type: "listing-reports",
                href: URL.REPORTS,
                label: "Race Calendar Marketer",
                current: true,
            },
            {
                id: 3 - 2,
                title: "EIS Wizard",
                img: eisWizardIcon,
                imgAlt: "eis_wizard",
                type: "eis_wizard",
                href: "",
                label: "Coming Soon",
                current: false,
            },
        ],
    },
];
