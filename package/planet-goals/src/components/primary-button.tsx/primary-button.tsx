import React, { MouseEvent } from "react";
import styles from "./primary-button.module.scss";

export type TButtonColor = "orange" | "white" | "blue" | "red";
export type TButtonSize = "regular" | "small" | "desktopSmall";
export type TButtonType = "default" | "action";

interface PrimaryButtonProps {
    additionalClasses?: string;
    children: React.ReactNode;
    color?: TButtonColor;
    disabled?: boolean;
    onClick?: (event?: MouseEvent<HTMLButtonElement>) => void;
    selected?: boolean;
    size?: TButtonSize;
    type?: TButtonType;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    additionalClasses,
    children,
    color = "white",
    disabled = false,
    onClick,
    selected,
    size = "regular",
    type = "default"
}) => {
    const locale = localStorage.getItem("locale");
    return (
        <button
            className={`${styles.button} ${styles[color]} ${size !== 'regular' ? styles[size] : ''}${selected ? ` ${styles[`selected${color}`]}` : ''}${additionalClasses ? ` ${additionalClasses}` : ''}${type !== "default" ? ` ${styles[type]}` : ''}`}
            onClick={onClick}
            disabled={disabled}
            lang={locale}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
