export type Option = {
    value: string;
    name: string;
    icon?: string;
    groupLabel?: string;
    optionalName?: string;
};

export interface ISelectProps {
    placeholder?: string;
    options: Option[] | any;
    grouped?: boolean;
    name?: string;
    optionalName?: string;
    searchable?: boolean;
    iconVisible?: boolean;
    disabled?: boolean;
    value?: any;
    onChange: (...arg: any) => void;
}
