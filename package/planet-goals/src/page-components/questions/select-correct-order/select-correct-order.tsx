import React, { useState } from "react";
import { ISubquestion } from "../../../types/lesson";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";

const SelectCorrectOrder: React.FC<ISubquestion> = (questionData) => {
    const colors: TButtonColor[] = ["red", "orange", "blue", "green"];
    const [answers, setAnswers] = useState(new Array(questionData.answers.length).fill(0));
    const [currentAnswer, setCurrentAnswer] = useState(0);

    const markTile = (index) => {
        const tempAnswers = [...answers];
        let tempCurrentAnswers = currentAnswer;
        if (!answers[index]) {
            tempCurrentAnswers++;
            tempAnswers[index] = tempCurrentAnswers;
        } else {
            tempCurrentAnswers--;
            tempAnswers[index] = 0;
            for (let i = 0; i < tempAnswers.length; i++) {
                if (tempAnswers[i] > tempCurrentAnswers) {
                    tempAnswers[i]--;
                }
            }
        }
        
        setAnswers(tempAnswers);
        setCurrentAnswer(tempCurrentAnswers);
    }

    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{questionData?.question}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                questionData.answers?.map((ans, index) => 
                    <div className={styles.buttonContainer} key={index}>
                        <GameButton color={colors?.[index % 4] || colors[1]} size="thin" onClick={() => markTile(index)}> 
                            {`${answers[index] > 0 ? `${answers[index]}. ` : ""}${ans}`}
                        </GameButton>
                    </div>
                )
            }
        </div>
    </div>
}

export default SelectCorrectOrder;