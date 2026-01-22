import React, { useState, useEffect } from "react";
import { useTranslate } from "@tolgee/react";
import { ISubquestionComponent } from "../questions.types";
import { getFeedback } from "../../../helpers/game";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";
import { constantsGame } from "../../../helpers/constants";

const colors: TButtonColor[] = ["red", "green"];

const TrueFalse: React.FC<ISubquestionComponent> = ({questionData, sendAnswerAction, showAnswers, spectatorMode}) => {
    const { t } = useTranslate();
    const [ answer, setAnswer ] = useState(false);
    const [ answered, setAnswered ] = useState(false);
    const [ showFeedbackCorrect, setShowFeedbackCorrect ] = useState(false);

    useEffect(() => {
        if (!questionData) return;
        setAnswer(false);
        setAnswered(false);
        setShowFeedbackCorrect(false);
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

    const check = (state: boolean) => state === Boolean(questionData.correctAnswerIndex);

    const mark = (state: boolean) => {
        if (answered || spectatorMode) return;
        setAnswer(state);
        setAnswered(true);
        sendAnswerAction(Number(state).toString());
    }

    const getCurrentColor = (ans: boolean): TButtonColor => {
        let color: TButtonColor = colors[Number(ans)];
        if (!answered || (answered && answer === ans && !showAnswers)) return color;
        else color = "white";
        if (showAnswers) color = check(ans) ? colors[Number(ans)] : "white"; 

        return color;
    }

    return <div className={styles.questionContainer}>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{t(questionData?.question)}</p>
        <div className={`${styles.buttonsContainer}`}>
            <div className={styles.buttonContainer}>
                <GameButton color={getCurrentColor(true)} onClick={() => mark(true)} feedback={getFeedback(showFeedbackCorrect, showAnswers,  true, check)}> 
                    {t("main.buttons.booleans.true")}
                </GameButton>
            </div>
            <div className={styles.buttonContainer}>
                <GameButton color={getCurrentColor(false)} onClick={() => mark(false)} feedback={getFeedback(showFeedbackCorrect, showAnswers, false, check)}> 
                    {t("main.buttons.booleans.false")}
                </GameButton>
            </div>
        </div>
    </div>
}

export default TrueFalse;