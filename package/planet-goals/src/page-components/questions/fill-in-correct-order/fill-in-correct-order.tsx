import React, { useEffect, useState } from "react";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import { getFeedback } from "../../../helpers/game";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";
import { ISubquestionComponent } from "../questions.types";

const colors: TButtonColor[] = ["red", "orange", "blue", "green"];
const FillCorrectOrder: React.FC<ISubquestionComponent> = ({questionData, showAnswers, sendAnswerAction}) => {
    const [answers, setAnswers] = useState(new Array(questionData.answers.length).fill(0));
    const [currentAnswer, setCurrentAnswer] = useState(0);
    const [description, setDescription] = useState(questionData.description);
    const [finalAnswer, setFinalAnswer] = useState("");
    
    useEffect(() => {
        if (!questionData) return;
        setAnswers(new Array(questionData.answers.length).fill(0));
        setCurrentAnswer(0);
        setDescription(questionData.description);
        setFinalAnswer("");
    }, [questionData]);
    
    const check = (index: number) => answers[index].toString() === questionData.correctAnswer[index];
    
    const markTile = (index: number) => {
        if (finalAnswer.length >= answers.length) return;
        const tempAnswers = [...answers];
        let tempCurrentAnswers = currentAnswer;
        let tempFinalAnswer = finalAnswer;
        if (!answers[index]) {
            tempCurrentAnswers++;
            tempAnswers[index] = tempCurrentAnswers;
            tempFinalAnswer = `${tempFinalAnswer}${index}`;
            setDescription(description.replace("...", questionData.answers[index]));
        }
        
        setFinalAnswer(tempFinalAnswer);
        setAnswers(tempAnswers);
        setCurrentAnswer(tempCurrentAnswers);

        if (tempFinalAnswer.length >= answers.length) sendAnswerAction(tempFinalAnswer);
    }

    const getCurrentColor = (index: number) => {
        if (!currentAnswer || showAnswers || (currentAnswer > 0 && answers[index] > 0 && !showAnswers)) return colors[index % 4];
        return "white"; 
    }

    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{description}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                questionData.answers?.map((ans, index) => {
                    let tileIndex = answers[index] ? `${answers[index]}. ` : "";
                    if (showAnswers) tileIndex = `${Number(questionData.correctAnswer[index])}. `;
                    return (
                        <div className={styles.buttonContainer} key={index}>
                            <GameButton color={getCurrentColor(index)} size="thin" onClick={() => markTile(index)} feedback={getFeedback(showAnswers, !!answers[index], index, check)}> 
                                {`${tileIndex}${ans}`}
                            </GameButton>
                        </div>
                    )
                })
            }
        </div>
    </div>
}

export default FillCorrectOrder;