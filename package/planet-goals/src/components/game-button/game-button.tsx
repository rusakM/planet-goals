import React, { MouseEvent } from "react";
import styles from "./game-button.module.scss";

export type TButtonColor = "orange" | "blue" | "green" | "red" | "white";
export type TButtonSize = "default" | "thin";

interface GameButtonProps {
    additionalClasses?: string;
    children: React.ReactNode;
    color?: TButtonColor;
    disabled?: boolean;
    onClick?: (event?: MouseEvent<HTMLButtonElement>) => void;
    size?: TButtonSize;
    selected?: boolean;
}

const GameButton: React.FC<GameButtonProps> = ({
    additionalClasses,
    children,
    color = "white",
    disabled = false,
    onClick,
    size = "default",
    selected,
}) => {
    const locale = localStorage.getItem("locale");
    return (
        <button
            className={`${styles.button} ${styles[color]}${selected ? ` ${styles[`selected${color}`]}` : ''}${size !== "default" ? ` ${styles.thin}` : ''}${additionalClasses ? ` ${additionalClasses}` : ''}`}
            onClick={onClick}
            disabled={disabled}
            lang={locale}
        >
            {children}
        </button>
    );
};

export default GameButton;
