import React from "react";
import "./index.scss";

const SelectOption = () => {
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
        inputRef.current.value = [name] as any;
    }}
    onKeyUp={(event) => {
        if (event.key === "Tab") {
            onChange(...[name]);
            inputRef.current.value = [name] as unknown as string;
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
        <span className="option__name">{name}</span>
    </button>
</div>
}

export default SelectOption;