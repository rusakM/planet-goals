import React, { MouseEvent } from "react";
import styles from "./primary-button.module.scss";

export type TButtonColor = "orange" | "white" | "blue";
export type TButtonSize = "regular" | "small" | "desktopSmall";
export type TButtonType = "default" | "action";

interface PrimaryButtonProps {
    additionalClasses?: string;
    children: React.ReactNode;
    color?: TButtonColor;
    onClick?: (event?: MouseEvent<HTMLButtonElement>) => void;
    selected?: boolean;
    size?: TButtonSize;
    type?: TButtonType;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    additionalClasses,
    children,
    color = "white",
    onClick,
    selected,
    size = "regular",
    type = "default"
}) => {
    return (
        <button
            className={`${styles.button} ${styles[color]} ${size !== 'regular' ? styles[size] : ''}${selected ? ` ${styles[`selected${color}`]}` : ''}${additionalClasses ? ` ${additionalClasses}` : ''}${type !== "default" ? ` ${styles[type]}` : ''}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
