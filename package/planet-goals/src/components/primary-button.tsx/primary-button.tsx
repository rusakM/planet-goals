import React, { MouseEvent } from "react";
import styles from "./primary-button.module.scss";

interface PrimaryButtonProps {
    children: React.ReactNode;
    color?: "orange" | "white" | "blue";
    size?: "regular" | "small";
    onClick?: (event?: MouseEvent<HTMLButtonElement>) => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children,
    onClick,
    color = "white",
    size = "regular",
}) => {
    return (
        <button
            className={`${styles.button} ${styles[color]} ${
                size === "small" && styles.smallSize
            }`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
