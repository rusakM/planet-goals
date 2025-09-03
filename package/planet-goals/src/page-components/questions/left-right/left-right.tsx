import React, { useRef, useState, useEffect } from "react";
import { ISubquestionComponent } from "../questions.types";
import { useDeviceType } from "../../../helpers/responsiveContainers";
import styles from "../questions.module.scss";
import stylesLeftRight from "./left-right.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import GameButton, { TButtonColor } from "../../../components/game-button/game-button";
import { getFeedback } from "../../../helpers/game";

const colors: TButtonColor[] = ["orange", "blue"];

const LeftRight: React.FC<ISubquestionComponent> = ({ questionData, sendAnswerAction, showAnswers }) => {
    const startCoordRef = useRef<number | null>(null);
    const isMouseDownRef = useRef(false);
    const isDraggingRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const currentDeltaRef = useRef<number>(0); // Dodajemy referencję do aktualnej różnicy
    
    const [answer, setAnswer] = useState(-1);
    const [dragOffset, setDragOffset] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(1); // 0 = left/top, 1 = center, 2 = right/bottom
    const { isMobile } = useDeviceType();

    useEffect(() => {
        if (!questionData) return;
        setAnswer(-1);
        setDragOffset(0);
        setCurrentPosition(1);
    }, [questionData]);

    const onAnswer = (index: number) => {
        if (answer > -1) return;
        setAnswer(index);
        sendAnswerAction(index.toString());
    };

    const handleStart = (coord: number) => {
        startCoordRef.current = coord;
        isDraggingRef.current = true;
        setDragOffset(0);
        currentDeltaRef.current = 0;
    };

    const check = (index: number) => index === questionData.correctAnswerIndex;

    const handleMove = (coord: number, buttonSize?: number) => {
        if (!isDraggingRef.current || startCoordRef.current === null) return;
        
        const delta = coord - startCoordRef.current;
        const maxOffset = isMobile ? 75 : buttonSize ? buttonSize : 100;
        const clampedDelta = Math.max(-maxOffset, Math.min(maxOffset, delta));
        
        currentDeltaRef.current = delta; // Zapisujemy aktualną różnicę
        setDragOffset(clampedDelta);
    };

    const handleEnd = () => { // Usuwamy parametr coord
        if (startCoordRef.current === null || !isDraggingRef.current) return;
        
        const delta = currentDeltaRef.current; // Używamy zapisanej różnicy
        const threshold = 40;
        
        let newPosition = currentPosition;
        console.log('new position', newPosition, 'delta', delta);
        
        if (delta < -threshold && currentPosition > 0) {
            newPosition = currentPosition - 1;
        } else if (delta > threshold && currentPosition < 2) {
            newPosition = currentPosition + 1;
        }

        console.log(newPosition);
        
        // Sprawdź czy to jest odpowiedź (pozycja 0 lub 2)
        if (newPosition === 0) {
            onAnswer(0); // Pierwsza odpowiedź
        } else if (newPosition === 2) {
            onAnswer(1); // Druga odpowiedź
        }
        
        setCurrentPosition(1);
        setDragOffset(0);
        startCoordRef.current = null;
        isDraggingRef.current = false;
        currentDeltaRef.current = 0;
    };

    const getClientCoord = (e: React.TouchEvent | React.MouseEvent) =>
        'touches' in e
            ? isMobile
                ? (e as React.TouchEvent).touches?.[0]?.clientY ?? 0
                : (e as React.TouchEvent).touches?.[0]?.clientX ?? 0
            : isMobile
                ? (e as React.MouseEvent).clientY
                : (e as React.MouseEvent).clientX;

    const getTransform = () => {
        const baseOffset = isMobile ? 
            (currentPosition - 1) * 120 : // Vertical offset dla mobile
            (currentPosition - 1) * 150;  // Horizontal offset dla desktop
        
        const totalOffset = baseOffset + dragOffset;
        
        return isMobile 
            ? `translateY(${totalOffset}px)`
            : `translateX(${totalOffset}px)`;
    };

    const getCurrentContent = () => {
        switch (currentPosition) {
            case 0:
                return questionData.answers[0];
            case 1:
                return questionData.description;
            case 2:
                return questionData.answers[1];
            default:
                return questionData.description;
        }
    };

    const getCurrentColor = (index: number) => {
        if (!showAnswers || check(index)) return colors[index % 2];
        return "white"; 
        
    };

    return (
        <div className={styles.leftRightContainer}>
            <p className={`${styles.headerText} ${commonStyles.centeredText}`}>
                {questionData?.question}
            </p>
            
            <div 
                ref={containerRef}
                className={`${styles.buttonsContainer}`}
            >
                <div className={`${stylesLeftRight.buttonContainer}`}>
                    <GameButton 
                        color={getCurrentColor(0)} 
                        noBoxShadow={true}
                        size="thin" 
                        additionalClasses={`${commonStyles.leftSideText}`}
                        unchangable={true}
                        feedback={getFeedback(showAnswers, answer === 0, 0, check)}
                    >
                        {questionData.answers[0]}
                    </GameButton>
                </div>

                <div 
                    className={`${stylesLeftRight.buttonContainer} ${stylesLeftRight.middleButton}`}
                    style={{ 
                        transform: getTransform(),
                        transition: isDraggingRef.current ? 'none' : 'transform 0.3s ease-out'
                    }}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        handleStart(getClientCoord(e));
                    }}
                    onTouchMove={(e) => {
                        e.preventDefault();
                        handleMove(getClientCoord(e));
                    }}
                    onTouchEnd={() => {
                        handleEnd(); // Bez parametru
                    }}
                    onMouseDown={(e) => {
                        isMouseDownRef.current = true;
                        handleStart(getClientCoord(e));
                    }}
                    onMouseMove={(e) => {
                        if (isMouseDownRef.current) {
                            const width = isMobile ? 0 : Math.floor(e.currentTarget.getBoundingClientRect().width);
                            handleMove(getClientCoord(e), width || 0);
                        }
                    }}
                    onMouseUp={() => {
                        if (isMouseDownRef.current) {
                            handleEnd(); // Bez parametru
                            isMouseDownRef.current = false;
                        }
                    }}
                    onMouseLeave={() => {
                        if (isMouseDownRef.current) {
                            handleEnd(); // Bez parametru
                            isMouseDownRef.current = false;
                        }
                    }}
                >
                    <GameButton 
                        color={"white"}
                        size="thin" 
                        additionalClasses={`${commonStyles.leftSideText}`}
                        noBoxShadow={true}
                        unchangable={true}
                    >
                        {getCurrentContent()}
                    </GameButton>
                </div>
                
                <div className={`${stylesLeftRight.buttonContainer}`}>
                    <GameButton 
                        color={getCurrentColor(1)} 
                        size="thin" 
                        noBoxShadow={true}
                        additionalClasses={`${commonStyles.leftSideText}`}
                        unchangable={true}
                        feedback={getFeedback(showAnswers, answer === 1, 1, check)}
                    >
                        {questionData.answers[1]}
                    </GameButton>
                </div>
            </div>
        </div>
    );
};

export default LeftRight;