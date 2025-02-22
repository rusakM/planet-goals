import React, { ChangeEvent } from "react";
import styles from "./text-input.module.scss";
import errorStyles from "../../styles/errors.module.scss";

interface ITextInputProps {
    disabled?: boolean;
    error?: boolean;
    name?: string;
    onChange?: (event?: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: "email" | "password" | "text";
    value?: string;
}

const TextInput: React.FC<ITextInputProps> = ({
    disabled = false,
    error,
    name,
    onChange,
    placeholder,
    type = "text",
    value,
}) => (
    <input
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        value={value}
        className={`${styles.textInput} ${error ? errorStyles.errorInput : ""}`}
    />
);

export default TextInput;
