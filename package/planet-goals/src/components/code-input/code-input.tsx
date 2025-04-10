import { ChangeEvent, KeyboardEvent, MouseEvent, ForwardedRef, forwardRef } from "react";
import styles from "./code-input.module.scss";
  
interface ICodeInputProps {
    error: boolean;
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleClick: (event: MouseEvent<HTMLInputElement>) => void;
    handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
    isActive: boolean;
    name: string;
    value: string;
}

const CodeInput = forwardRef<HTMLInputElement, ICodeInputProps>(
    ({ error, isActive, handleChange, handleClick, handleKeyDown, value }, ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <input
            type="text"
            value={value}
            onChange={handleChange}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={`${styles.codeInput}${isActive ? ` ${styles.active}` : ""}${
                error ? ` ${styles.error}` : ""
            }`}
            ref={ref}
        />
    );
    }
);

export default CodeInput;