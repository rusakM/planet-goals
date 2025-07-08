import React, { MouseEvent } from "react";
import styles from "./game-button.module.scss";

export type TButtonColor = "orange" | "blue" | "green" | "red" | "white";
export type TButtonSize = "default" | "thin";
export type TFeedbackMode = "none" | "correct" | "incorrect";

interface GameButtonProps {
    additionalClasses?: string;
    children: React.ReactNode;
    color?: TButtonColor;
    disabled?: boolean;
    feedback?: TFeedbackMode;
    onClick?: (event?: MouseEvent<HTMLButtonElement>) => void;
    noBoxShadow?: boolean;
    size?: TButtonSize;
    selected?: boolean;
    unchangable?: boolean;
}

const GameButton: React.FC<GameButtonProps> = ({
    additionalClasses,
    children,
    color = "white",
    disabled = false,
    feedback = "none",
    noBoxShadow = false,
    onClick,
    size = "default",
    selected,
    unchangable = false,
}) => {
    const locale = localStorage.getItem("locale");
    return (
        <button
            className={`${styles.button} ${styles[color]}${selected ? ` ${styles[`selected${color}`]}` : ''}${size !== "default" ? ` ${styles.thin}` : ''}${noBoxShadow ? ` ${styles.noBoxShadow}` : ''}${unchangable ? ` ${styles.unchangable}` : ''}${feedback !== "none" ? ` ${styles[`feedback${feedback}`]}` : ''}${additionalClasses ? ` ${additionalClasses}` : ''}`}
            onClick={onClick}
            disabled={disabled}
            lang={locale}
        >
            {children}
        </button>
    );
};

export default GameButton;
