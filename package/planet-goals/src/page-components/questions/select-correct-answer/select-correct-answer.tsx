import React, { useEffect, useState } from "react";
import { ISubquestion } from "../../../types/lesson";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";

const SelectCorrectAnswer: React.FC<ISubquestion> = (questionData) => {
    const colors: TButtonColor[] = ["orange", "blue"];

    const [answer, setAnswer] = useState(-1);
    const [answered, setAnswered] = useState(false);
    const [answerCorrect, setAnswerCorrect] = useState(false);

    useEffect(() => {
        if (!questionData) return;
        setAnswer(-1);
        setAnswerCorrect(false);
        setAnswered(false);
    }, [questionData]);

    const mark = (index: number) => {
        if (answered) return;
        setAnswer(index);
        setAnswerCorrect(index === questionData.correctAnswerIndex);
        setAnswered(true);
    }

    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{questionData?.question}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                questionData.answers?.map((ans, index) => 
                    <div className={styles.buttonContainer} key={index}>
                        <GameButton color={colors?.[index] || colors[0]} size="thin" additionalClasses={commonStyles.leftSideText} onClick={() => mark(index)} disabled={answered && (answer !== index || !answerCorrect)}> 
                            {ans}
                        </GameButton>
                    </div>
                )
            }
        </div>
    </div>
}

export default SelectCorrectAnswer;