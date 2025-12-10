import { ChangeEvent, FocusEvent, ForwardedRef, forwardRef, useState } from "react";
import styles from "./code-input.module.scss";
  
interface ICodeInputProps {
    error: boolean;
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    name: string;
    value: string;
}

const CodeInput = forwardRef<HTMLInputElement, ICodeInputProps>(
    ({ error, handleChange, value }, ref: ForwardedRef<HTMLInputElement>) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        if (event.currentTarget === document.activeElement) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }

    return (
        <input
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleFocus}
            className={`${styles.codeInput}${isActive ? ` ${styles.active}` : ""}${
                error ? ` ${styles.error}` : ""
            }`}
            ref={ref}
        />
    );
    }
);

export default CodeInput;