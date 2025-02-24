import React, { ChangeEvent } from "react";
import styles from "./select-input.module.scss";
import errorStyles from "../../styles/errors.module.scss";

export interface ISelectInputOption {
    label: string,
    value: string,
}

interface ISelectInputProps {
    disabled?: boolean;
    error?: boolean;
    name?: string;
    onChange?: (event?: ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    options: ISelectInputOption[];
    value?: string;
}

const SelectInput: React.FC<ISelectInputProps> = ({
    disabled = false,
    error,
    name,
    onChange,
    placeholder,
    options,
    value,
}) => (
    <select
        onChange={onChange}
        name={name}
        disabled={disabled}
        value={value}
        className={`${styles.selectInput} ${error ? errorStyles.errorInput : ""}`}
    >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

export default SelectInput;