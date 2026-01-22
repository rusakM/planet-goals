import React, { useEffect, useState } from "react";
import { useTranslate } from "@tolgee/react";
import { ISubquestionComponent } from "../questions.types";
import { getFeedback } from "../../../helpers/game";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";
import { constantsGame } from "../../../helpers/constants";
import { useTranslatedAnswers } from "../../../hooks/useTranslatedAnswers";

const colors: TButtonColor[] = ["orange", "blue"];

const SelectCorrectAnswer: React.FC<ISubquestionComponent> = ({ questionData, sendAnswerAction, showAnswers, spectatorMode }) => {
    const { t } = useTranslate();
    const translatedAnswers = useTranslatedAnswers(questionData?.answers);
    const [answer, setAnswer] = useState(-1);
    const [answered, setAnswered] = useState(false);
    const [showFeedbackCorrect, setShowFeedbackCorrect] = useState(false);
    const [smallFontInButtons, setSmallFontInButtons] = useState(false);

    useEffect(() => {
        if (!questionData) return;
        setAnswer(-1);
        setAnswered(false);
        setShowFeedbackCorrect(false);
        setSmallFontInButtons(false);
    }, [questionData]);

    useEffect(() => {
        if (!showAnswers) {
            setShowFeedbackCorrect(false); 
            return;
        }
        if (showFeedbackCorrect && !spectatorMode) return;
        const timer = setTimeout(() => {
            setShowFeedbackCorrect(true);
        }, constantsGame.FEEDBACK_INCORRECT_TIME);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAnswers, questionData]);

    const check = (index: number) => index === questionData.correctAnswerIndex;

    const mark = (index: number) => {
        if (answered || spectatorMode) return;
        setAnswer(index);
        setAnswered(true);
        sendAnswerAction(questionData.answers[index]);
    }

    const getCurrentColor = (index: number) => {
        let color: TButtonColor = colors[index % 2];
        if (!answered || (answered && answer === index && !showAnswers)) return color;
        else color = "white";
        if (showAnswers) color = check(index) ? colors[index % 2] : "white"; 

        return color;
    }

    return <div className={styles.questionContainer}>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{t(questionData?.question)}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                translatedAnswers?.map((ans, index) => 
                    <div className={styles.buttonContainer} key={index}>
                        <GameButton 
                            color={getCurrentColor(index)} 
                            size="thin"
                            additionalClasses={commonStyles.leftSideText}
                            onClick={() => mark(index)}
                            feedback={getFeedback(showFeedbackCorrect, showAnswers, index, check)}
                            font={{
                                isSmallFont: smallFontInButtons,
                                setIsSmallFont: setSmallFontInButtons
                            }}
                        > 
                            {ans}
                        </GameButton>
                    </div>
                )
            }
        </div>
    </div>
}

export default SelectCorrectAnswer;