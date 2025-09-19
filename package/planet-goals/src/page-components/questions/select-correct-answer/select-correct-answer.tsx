import React, { useEffect, useState } from "react";
import { ISubquestionComponent } from "../questions.types";
import { getFeedback } from "../../../helpers/game";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";

const colors: TButtonColor[] = ["orange", "blue"];

const SelectCorrectAnswer: React.FC<ISubquestionComponent> = ({ questionData, sendAnswerAction, showAnswers, spectatorMode }) => {

    const [answer, setAnswer] = useState(-1);
    const [answered, setAnswered] = useState(false);
    const [answerCorrect, setAnswerCorrect] = useState(false);

    useEffect(() => {
        if (!questionData) return;
        setAnswer(-1);
        setAnswerCorrect(false);
        setAnswered(false);
    }, [questionData]);

    const check = (index: number) => index === questionData.correctAnswerIndex;

    const mark = (index: number) => {
        if (answered || spectatorMode) return;
        setAnswer(index);
        setAnswerCorrect(check(index));
        setAnswered(true);
        sendAnswerAction(questionData.answers[index]);
    }

    const checkDisabledByIndex = (index: number) => {
        if (spectatorMode) return true;
        return answered && (answer !== index || !answerCorrect);
    }

    const getCurrentColor = (index: number) => {
        let color: TButtonColor = colors[index % 2];
        if (!answered || (answered && answer === index && !showAnswers)) return color;
        else color = "white";
        if (showAnswers) color = check(index) ? colors[index % 2] : "white"; 

        return color;
    }

    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{questionData?.question}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                questionData.answers?.map((ans, index) => 
                    <div className={styles.buttonContainer} key={index}>
                        <GameButton color={getCurrentColor(index)} size="thin" additionalClasses={commonStyles.leftSideText} onClick={() => mark(index)} disabled={checkDisabledByIndex(index)} feedback={getFeedback(showAnswers, answer === index, index, check)}> 
                            {ans}
                        </GameButton>
                    </div>
                )
            }
        </div>
    </div>
}

export default SelectCorrectAnswer;