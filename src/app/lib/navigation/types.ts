import { IUserSideNavItems } from "app/store/types/user.types";

export type SideNavChild = {
    id: number;
    title: string;
    img: string;
    imgAlt: string;
    type: any;
    href: string;
    current: boolean;
    label: string;
};

export type SideNavParent = {
    id: number;
    title: string;
    type: keyof IUserSideNavItems;
    children: SideNavChild[];
};
