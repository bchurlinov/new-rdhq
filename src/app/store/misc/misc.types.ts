export type IModalContent = {
    externalLink: string;
    title: string;
    text1: string;
    text2: string;
    linkTo: string;
    linkName: string;
    isVisible: boolean;
};

export type ModalTypes =
    | "membersProgram"
    | "noListingCredits"
    | "importRaceModal"
    | "raceDetailsModal";

export type InitialMiscStateType = {
    modals: {
        [Key in ModalTypes]: {
            isVisible: boolean;
        };
    };
};
