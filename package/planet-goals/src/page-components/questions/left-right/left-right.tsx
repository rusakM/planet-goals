import React, { useRef, useState } from "react";
import { ISubquestion } from "../../../types/lesson";
import { useDeviceType } from "../../../helpers/responsiveContainers";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import GameButton from "../../../components/game-button/game-button";

const LeftRight: React.FC<ISubquestion> = (questionData) => {
    const startCoordRef = useRef<number | null>(null);
    const isMouseDownRef = useRef(false);
    const [ answer, setAnswer ] = useState(-1);
    const { isMobile } = useDeviceType();

    const onAnswer = (index: number) => {
        if (answer >= 0 || index < 0 || index > 1) return;
        setAnswer(index);
    }

    const handleStart = (coord: number) => {
        startCoordRef.current = coord;
    };

    const handleEnd = (coord: number) => {
        if (startCoordRef.current === null) return;

        const delta = coord - startCoordRef.current;
        const threshold = 50;

        if (delta < -threshold) onAnswer(0); // Swipe up or left
        else if (delta > threshold) onAnswer(2); // Swipe down or right

        startCoordRef.current = null;
    };

    const getClientCoord = (e: React.TouchEvent | React.MouseEvent) =>
        'touches' in e || 'changedTouches' in e
        ? isMobile
            ? (e as React.TouchEvent).changedTouches?.[0]?.clientX ?? 0
            : (e as React.TouchEvent).changedTouches?.[0]?.clientY ?? 0
        : isMobile
            ? (e as React.MouseEvent).clientX
            : (e as React.MouseEvent).clientY;

    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{questionData?.question}</p>
        <div className={`${styles.buttonsContainer}`}
            onTouchStart={(e) => handleStart(getClientCoord(e))}
            onTouchEnd={(e) => handleEnd(getClientCoord(e))}
            onMouseDown={(e) => {
                isMouseDownRef.current = true;
                handleStart(getClientCoord(e));
            }}
            onMouseUp={(e) => {
                if (isMouseDownRef.current) {
                handleEnd(getClientCoord(e));
                isMouseDownRef.current = false;
                }
            }}
        >
            <div className={styles.buttonContainer}>
                <GameButton color={"orange"} size="thin" additionalClasses={commonStyles.leftSideText}> 
                    {questionData.answers[0]}
                </GameButton>
            </div>
            <div className={styles.buttonContainer}>
                <GameButton color={"white"} size="thin" additionalClasses={commonStyles.leftSideText}> 
                    {questionData.description}
                </GameButton>
            </div>
            <div className={styles.buttonContainer}>
                <GameButton color={"blue"} size="thin" additionalClasses={commonStyles.leftSideText}> 
                    {questionData.answers[0]}
                </GameButton>
            </div>
        </div>
    </div>
}

export default LeftRight;