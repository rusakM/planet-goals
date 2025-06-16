import React, { useRef, useState, useEffect } from "react";
import { ISubquestion } from "../../../types/lesson";
import { useDeviceType } from "../../../helpers/responsiveContainers";
import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import GameButton from "../../../components/game-button/game-button";

const LeftRight: React.FC<ISubquestion> = (questionData) => {
  const startCoordRef = useRef<number | null>(null);
  const isMouseDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
    if (answer >= -1) return;
    setAnswer(index);
  };

  const handleStart = (coord: number) => {
    startCoordRef.current = coord;
    isDraggingRef.current = true;
    setDragOffset(0);
  };

  const handleMove = (coord: number) => {
    if (!isDraggingRef.current || startCoordRef.current === null) return;
    
    const delta = coord - startCoordRef.current;
    const maxOffset = isMobile ? 90 : 100; // Maksymalne przesunięcie w px
    const clampedDelta = Math.max(-maxOffset, Math.min(maxOffset, delta));
    
    setDragOffset(clampedDelta);
  };

  const handleEnd = (coord: number) => {
    if (startCoordRef.current === null || !isDraggingRef.current) return;
    
    const delta = coord - startCoordRef.current;
    const threshold = 50;
    
    let newPosition = currentPosition;
    
    if (delta < -threshold && currentPosition > 0) {
      newPosition = currentPosition - 1;
    } else if (delta > threshold && currentPosition < 2) {
      newPosition = currentPosition + 1;
    }
    
    
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

  const getCurrentColor = () => {
    switch (currentPosition) {
      case 0:
        return "orange";
      case 1:
        return "white";
      case 2:
        return "blue";
      default:
        return "white";
    }
  };

  return (
    <div className={styles.leftRightContainer}>
      <p className={`${styles.headerText} ${commonStyles.centeredText}`}>
        {questionData?.question}
      </p>
      
      <div 
        ref={containerRef}
        className={`${styles.buttonsContainer} ${isMobile ? styles.mobileLayout : styles.desktopLayout}`}
      >
        {/* Statyczne tło przyciski */}
        <div className={`${styles.buttonContainer} ${styles.staticButton} ${styles.firstOption}`}>
          <GameButton 
            color={"orange"} 
            size="thin" 
            additionalClasses={`${commonStyles.leftSideText} ${styles.backgroundButton}`}
          >
            {questionData.answers[0]}
          </GameButton>
        </div>

        {/* Ruchomy środkowy przycisk */}
        <div 
          className={`${styles.buttonContainer} ${styles.movableButton}`}
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
          onTouchEnd={(e) => {
            e.preventDefault();
            handleEnd(getClientCoord(e));
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            isMouseDownRef.current = true;
            handleStart(getClientCoord(e));
          }}
          onMouseMove={(e) => {
            if (isMouseDownRef.current) {
              handleMove(getClientCoord(e));
            }
          }}
          onMouseUp={(e) => {
            if (isMouseDownRef.current) {
              handleEnd(getClientCoord(e));
              isMouseDownRef.current = false;
            }
          }}
          onMouseLeave={(e) => {
            if (isMouseDownRef.current) {
              handleEnd(getClientCoord(e));
              isMouseDownRef.current = false;
            }
          }}
        >
          <GameButton 
            color={getCurrentColor()}
            size="thin" 
            additionalClasses={`${commonStyles.leftSideText} ${styles.draggableButton}`}
          >
            {getCurrentContent()}
          </GameButton>
        </div>
                <div className={`${styles.buttonContainer} ${styles.staticButton} ${styles.secondOption}`}>
          <GameButton 
            color={"blue"} 
            size="thin" 
            additionalClasses={`${commonStyles.leftSideText} ${styles.backgroundButton}`}
          >
            {questionData.answers[1]}
          </GameButton>
          </div>
      </div>
    </div>
  );
};

export default LeftRight;