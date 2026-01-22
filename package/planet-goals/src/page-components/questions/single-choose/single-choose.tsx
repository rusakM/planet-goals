import React, { useState, useEffect } from "react";
import { useTranslate } from "@tolgee/react";
import { ISubquestionComponent } from "../questions.types";
import { useTranslatedAnswers } from "../../../hooks/useTranslatedAnswers";
import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import { getFeedback } from "../../../helpers/game";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";
import { constantsGame } from "../../../helpers/constants";

const colors: TButtonColor[] = ["blue", "green", "orange", "red"];
const SingleChoose: React.FC<ISubquestionComponent> = ({questionData, sendAnswerAction, showAnswers, spectatorMode}) => {
    const { t } = useTranslate();
    const translatedAnswers = useTranslatedAnswers(questionData?.answers);
    
    const [answer, setAnswer] = useState(-1);
    const [buttonsDisabled, setButtonsDisabled] = useState(new Array<boolean>(questionData.answers.length).fill(false));
    const [showFeedbackCorrect, setShowFeedbackCorrect] = useState(false);
    const [smallFontInButtons, setSmallFontInButtons] = useState(false);

    useEffect(() => {
        if (!questionData) return;
        setAnswer(-1);
        setButtonsDisabled(new Array<boolean>(questionData.answers.length).fill(false));
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

    const onSelect = (index: number) => {
        if (answer !== -1 || spectatorMode) return;
        const tempButtons = [...buttonsDisabled];
        setAnswer(index);
        for (let i = 0; i < tempButtons.length; i++) tempButtons[i] = !(questionData.correctAnswerIndex === index && i === index);
        setButtonsDisabled(tempButtons);
        sendAnswerAction(questionData.answers[index]);
    }

    return <div className={styles.questionContainer}>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{t(questionData?.question)}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                translatedAnswers?.map((ans, index) => {
                    let color: TButtonColor = (answer === -1 || answer === index) ? colors[index % 4] : "white";
                    const feedback = getFeedback(showFeedbackCorrect ,showAnswers, index, check);
                    if (showAnswers) color = check(index) ? colors[index % 4] : "white";
                    return <div className={styles.buttonContainer} key={index}>
                        <GameButton 
                            color={color}
                            size="thin" 
                            additionalClasses={commonStyles.leftSideText}
                            onClick={() => onSelect(index)} feedback={feedback}
                            font={{
                                isSmallFont: smallFontInButtons,
                                setIsSmallFont: setSmallFontInButtons
                            }}    
                        > 
                            {`${String.fromCharCode(65 + index)}. ${ans}`}
                        </GameButton>
                    </div>
                })
            }
        </div>
    </div>
}

export default SingleChoose;