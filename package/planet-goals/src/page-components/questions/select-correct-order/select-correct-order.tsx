import React, { useEffect, useState } from "react";
import { ISubquestion } from "../../../types/lesson";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";

const SelectCorrectOrder: React.FC<ISubquestion> = (questionData) => {
    const colors: TButtonColor[] = ["red", "orange", "blue", "green"];
    const [answers, setAnswers] = useState(new Array(questionData.answers.length).fill(0));
    const [currentAnswer, setCurrentAnswer] = useState(0);
    const [finalAnswer, setFinalAnswer] = useState("");
    
    useEffect(() => {
        if (!questionData) return;
        setAnswers(new Array(questionData.answers.length).fill(0));
        setCurrentAnswer(0);
        setFinalAnswer("");
    }, [questionData]);

    const markTile = (index) => {
        if (finalAnswer.length >= questionData.answers.length) return;
        const tempAnswers = [...answers];
        let tempFinalAnswer = finalAnswer;
        let tempCurrentAnswers = currentAnswer;
        if (!answers[index]) {
            tempCurrentAnswers++;
            tempAnswers[index] = tempCurrentAnswers;
            tempFinalAnswer = `${tempFinalAnswer}${index}`;
        }
        
        setAnswers(tempAnswers);
        setCurrentAnswer(tempCurrentAnswers);
        setFinalAnswer(tempFinalAnswer);
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