import React, {
    ReactElement,
    useEffect,
    useState,
    useRef,
    KeyboardEvent,
    useLayoutEffect,
} from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { _isEmpty } from "app/utils/helpers";
import { ISelectProps, Option } from "./select.types";
import "./index.scss";

function Select({
    options,
    placeholder,
    name,
    iconVisible = true,
    disabled = false,
    optionalName,
    grouped,
    searchable = false,
    value,
    onChange,
}: ISelectProps): ReactElement {
    const ref = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>();
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string | undefined>(placeholder);

    useEffect(() => {
        setInputValue(placeholder);
    }, [placeholder]);

    const [values, setValues] = useState<string[]>([]);
    const [focusedValue, setFocusedValue] = useState<number>(-1);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectFilteredOptions, setSelectFilteredOptions] = useState<Option[]>(options);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [optionsHeight, setOptionsHeight] = useState<string>("0");
    const [parentWidth, setParentWidth] = useState<number>(0);

    const handleClickOutside = (e: any): void => {
        const children: HTMLCollectionOf<Element> | undefined =
            parentRef?.current?.getElementsByTagName("*");

        if (children) {
            // eslint-disable-next-line no-restricted-syntax
            for (const item of children) {
                if (item === e.target) return;
            }
        }

        setIsOpen(false);
    };

    useEffect(() => {
        if (!_isEmpty(searchTerm)) setIsOpen(true);
    }, [searchTerm]);

    useEffect(() => {
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    useLayoutEffect(() => {
        const calcOptionsHeight: number = options.length * 2.175 * 2;
        const calculatedOptionsHeight: number = calcOptionsHeight <= 16 ? calcOptionsHeight : 16;
        const parentWidth = parentRef.current?.offsetWidth;

        setOptionsHeight(calculatedOptionsHeight.toString());
        if (parentWidth) setParentWidth(parentWidth);
    }, [options]);

    const keyDownHandler = (event: KeyboardEvent<any> | any): void => {
        switch (event.key) {
            case "Enter":
                setIsOpen(true);
                event.target.focus();
                break;
            case "Delete":
                setIsOpen(false);
                setValues([]);
                break;
            case "Escape":
                setIsOpen(false);
                setValues([]);
                break;
            case "Tab":
                if (!isOpen) setIsOpen(true);
                break;
            default:
        }

        if (ref.current) {
            const items = ref.current.querySelectorAll("button");
            const id = event.shiftKey ? 1 : items.length - 1;

            if (event.target === items[id]) setIsOpen(false);
        }
    };

    const selectOption = ({
        value,
        name,
        icon,
        selected,
        index,
        optionalName,
    }: {
        value: string;
        name: string;
        icon: string | undefined;
        selected: boolean;
        index: number;
        optionalName: string | undefined;
    }) => (
        <div
            key={value}
            data-value={value}
            ref={ref}
            className={`option ${selected ? "selected" : ""} ${
                index === focusedValue ? "focused" : ""
            }`}
            onClick={(event) => {
                if (event.screenX === 0 && event.screenY === 0) setIsOpen(!isOpen);
                else setIsOpen(!isOpen);

                onChange(value);
                setFocusedValue(-1);
                if (inputRef && inputRef.current) {
                    inputRef.current.value = [name] as unknown as string;
                }
            }}
            onKeyUp={(event) => {
                if (event.key === "Tab") {
                    onChange(...[name]);
                    if (inputRef && inputRef.current) {
                        inputRef.current.value = [name] as unknown as string;
                    }
                }
            }}
            role="presentation"
        >
            <button className="option__btn" type="button">
                {icon && (
                    <img className="option__img" src={icon && `/assets/${icon}.png`} alt={icon} />
                )}
                <span
                    className="option__name"
                    style={{ width: `${(parentWidth - 80).toString()}px` }}
                >
                    {name} {optionalName && `- ${optionalName}`}
                </span>
            </button>
        </div>
    );

    const renderSelectOptions = () => {
        const isSearchable = searchTerm.length > 1 ? selectFilteredOptions : options;
        if (grouped) {
            const reducedGroupedOptions = isSearchable.reduce((acc: any, item: Option) => {
                if (item?.groupLabel) {
                    acc[item.groupLabel] = acc[item.groupLabel] || [];
                    acc[item.groupLabel].push(item);
                    return acc;
                }

                return acc;
            }, {});

            return Object.keys(reducedGroupedOptions)
                .reverse()
                .map((item: string) => (
                    <div key={item} className="group-wrap">
                        <p className="group-label">
                            <span>{item}</span>{" "}
                            <span className="group-label-count">
                                {reducedGroupedOptions[item].length}
                            </span>
                        </p>
                        <div>
                            {reducedGroupedOptions[item].map((option: Option, index: number) => {
                                const { value, name, icon, optionalName } = option;
                                const selected = values.includes(value);

                                return selectOption({
                                    value,
                                    name,
                                    icon,
                                    selected,
                                    optionalName,
                                    index,
                                });
                            })}
                        </div>
                    </div>
                ));
        }
        return isSearchable.map((option: Option, index: number) => {
            const { value, name, icon } = option;
            const selected = values.includes(value);

            return (
                <div
                    key={value}
                    data-value={value}
                    ref={ref}
                    className={`option ${selected ? "selected" : ""} ${
                        index === focusedValue ? "focused" : ""
                    }`}
                    onClick={() => {
                        setIsOpen(!isOpen);
                        onChange(value);
                        setFocusedValue(-1);
                        if (inputRef && inputRef.current) {
                            inputRef.current.value = [name] as unknown as string;
                        }
                    }}
                    onKeyUp={(event) => {
                        if (event.key === "Tab") {
                            onChange(...[name]);
                            if (inputRef && inputRef.current) {
                                inputRef.current.value = [name] as unknown as string;
                            }
                        }
                    }}
                    role="presentation"
                >
                    <button className="option__btn" type="button">
                        {icon && (
                            <img
                                className="option__img"
                                src={icon && `/assets/${icon}.png`}
                                alt={icon}
                            />
                        )}
                        <span
                            className="option__name"
                            style={{ width: `${(parentWidth - 80).toString()}px` }}
                        >
                            {name}
                        </span>
                    </button>
                </div>
            );
        });
    };

    const filterOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);

        if (searchTerm !== "") {
            const searchRegex = new RegExp(event.target.value, "gi");

            const filteredOptions = options.reduce((acc: any, item: any) => {
                if (item.name && item.name.match(searchRegex)) {
                    acc.push(item);
                }

                return acc;
            }, []);

            setSelectFilteredOptions(filteredOptions);
        } else setSelectFilteredOptions(options);
    };

    return (
        <div
            className="rdhq-select"
            onKeyDown={keyDownHandler}
            ref={parentRef as any}
            role="presentation"
        >
            <div
                className={`rdhq-select__wrap ${isOpen ? "isOpen" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                role="presentation"
            >
                {iconVisible && <ChevronDownIcon />}
                <input
                    type="text"
                    name={name ?? ""}
                    ref={inputRef}
                    placeholder={values.length === 0 ? inputValue : values[0]}
                    className="value"
                    readOnly={!searchable}
                    autoComplete="off"
                    disabled={disabled}
                    onChange={filterOptions}
                    value={inputValue}
                />
                {!disabled && (
                    <div
                        className={`options ${isOpen ? "isOpen" : ""}`}
                        style={{ height: `${optionsHeight}rem` }}
                    >
                        {!_isEmpty(options) && renderSelectOptions()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Select;
