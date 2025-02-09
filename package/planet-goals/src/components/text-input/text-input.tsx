import React, { ChangeEvent } from "react";
import styles from "./text-input.module.scss";

interface ITextInputProps {
    disabled?: boolean;
    errorMessage?: string;
    name?: string;
    onChange?: (event?: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: "email" | "password" | "text";
    value?: string;
}

const TextInput: React.FC<ITextInputProps> = ({
    disabled = false,
    errorMessage,
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
        className={`${styles.textInput} ${errorMessage ? styles.error : ""}`}
    />
);

export default TextInput;
