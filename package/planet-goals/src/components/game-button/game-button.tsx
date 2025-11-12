import React, { MouseEvent, useEffect, useRef, useState } from "react";
import styles from "./game-button.module.scss";
import { useDeviceType } from "../../helpers/responsiveContainers";

export type TButtonColor = "orange" | "blue" | "green" | "red" | "white";
export type TButtonSize = "default" | "thin";
export type TFeedbackMode = "none" | "correct" | "incorrect";

const fontSizes = {
    desktop: {
        min: 26,
        max: 34,
    },
    mobile: {
        min: 18,
        max: 24
    }
};

const heightsStd = {
    desktop: 130,
    desktopThin: 130,
    mobile: 109,
    mobileThin: 59,
};

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
    const { isMobile } = useDeviceType();
    const [multiLines, setMultiLines] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const checkHeight = () => {
        const btnHeight = buttonRef.current.scrollHeight;
        if (size === "default") {
            if (isMobile) return btnHeight === heightsStd.mobile;
            return btnHeight === heightsStd.desktop;
        }

        if (isMobile) return btnHeight === heightsStd.mobileThin;
        return btnHeight === heightsStd.desktopThin;
    }

    useEffect(() => {
		const checkLines = () => {
			if (!buttonRef.current) return;
			setMultiLines(!checkHeight());
		};
		checkLines();
		window.addEventListener('resize', checkLines);
    });

    const getFontSize = () => {
        if (!multiLines) return isMobile ? fontSizes.mobile.max : fontSizes.desktop.max;
        return isMobile ? fontSizes.mobile.min : fontSizes.desktop.min;
    }

    return (
        <button
            className={`${styles.button} ${styles[color]}${selected ? ` ${styles[`selected${color}`]}` : ''}${size !== "default" ? ` ${styles.thin}` : ''}${noBoxShadow ? ` ${styles.noBoxShadow}` : ''}${unchangable ? ` ${styles.unchangable}` : ''}${feedback !== "none" ? ` ${styles[`feedback${feedback}`]}` : ''}${additionalClasses ? ` ${additionalClasses}` : ''}`}
            onClick={onClick}
            disabled={disabled}
            lang={locale}
            ref={buttonRef}
            style={{
                fontSize: `${getFontSize()}px`
            }}
        >
            {children}
        </button>
    );
};

export default GameButton;
