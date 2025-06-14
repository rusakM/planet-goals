import React, { useState, useEffect } from "react";
import { useTranslate } from "@tolgee/react";
import { ISubquestion } from "../../../types/lesson";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import GameButton from "../../../components/game-button/game-button";

const TrueFalse: React.FC<ISubquestion> = (questionData) => {
    const { t } = useTranslate();
    //const [ answer, setAnswer ] = useState(false);
    const [ answered, setAnswered ] = useState(false);
    const [ answerCorrect, setAnswerCorrect ] = useState(false);

    useEffect(() => {
        if (!questionData) return;
        //setAnswer(false);
        setAnswered(false);
        setAnswerCorrect(false);
    }, [questionData]);

    const mark = (state: boolean) => {
        if (answered) return;
        //setAnswer(state);
        setAnswered(true);
        setAnswerCorrect(state === Boolean(questionData.correctAnswerIndex));
    }

    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{questionData?.question}</p>
        <div className={`${styles.buttonsContainer}`}>
            <div className={styles.buttonContainer}>
                <GameButton color="green" onClick={() => mark(true)} disabled={answered && answerCorrect}> 
                    {t("main.buttons.booleans.true")}
                </GameButton>
            </div>
            <div className={styles.buttonContainer}>
                <GameButton color="red" onClick={() => mark(false)} disabled={answered && answerCorrect}> 
                    {t("main.buttons.booleans.false")}
                </GameButton>
            </div>
        </div>
    </div>
}

export default TrueFalse;