import { ReactNode } from "react";

export type ModalActionsType = {
    primary: {
        title: string;
        isLoading?: boolean;
        isDisabled?: boolean;
        action: () => void;
    };
    secondary: {
        title: string;
        isLoading?: boolean;
        isDisabled?: boolean;
        action: () => void;
    };
};

export type IModalType = {
    children: ReactNode;
    visible: boolean;
    footerVisible?: boolean;
    title: string;
    actions?: Partial<ModalActionsType>;
    closeModal: () => void;
};
