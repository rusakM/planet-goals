import React, { MouseEvent } from "react";
import styles from "./primary-button.module.scss";

interface PrimaryButtonProps {
    additionalClasses?: string;
    children: React.ReactNode;
    color?: "orange" | "white" | "blue";
    onClick?: (event?: MouseEvent<HTMLButtonElement>) => void;
    selected?: boolean;
    size?: "regular" | "small";
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    additionalClasses,
    children,
    color = "white",
    onClick,
    selected,
    size = "regular",
}) => {
    return (
        <button
            className={`${styles.button} ${styles[color]} ${
                size === "small" && styles.smallSize
            }${selected ? ` ${styles[`selected${color}`]}` : ''}${additionalClasses ? ` ${additionalClasses}` : ''}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
