import React, { useEffect, useState } from "react";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import { getFeedback2 } from "../../../helpers/game";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";
import { ISubquestionComponent } from "../questions.types";
import { constantsGame } from "../../../helpers/constants";

const colors: TButtonColor[] = ["red", "orange", "blue", "green"];
const FillCorrectOrder: React.FC<ISubquestionComponent> = ({questionData, showAnswers, sendAnswerAction, spectatorMode}) => {
    const [answers, setAnswers] = useState(new Array(questionData.answers.length).fill(0));
    const [currentAnswer, setCurrentAnswer] = useState(0);
    const [description, setDescription] = useState(questionData.question);
    const [finalAnswer, setFinalAnswer] = useState("");
    const [showFeedbackCorrect, setShowFeedbackCorrect] = useState(false);
    
    useEffect(() => {
        if (!questionData) return;
        setAnswers(new Array(questionData.answers.length).fill(0));
        setCurrentAnswer(0);
        setDescription(questionData.question);
        setFinalAnswer("");
    }, [questionData]);

    useEffect(() => {
        if (!showAnswers) {
            setShowFeedbackCorrect(false); 
            return;
        }
        if (showFeedbackCorrect) return;
        const timer = setTimeout(() => {
            setShowFeedbackCorrect(true);
        }, constantsGame.FEEDBACK_INCORRECT_TIME);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAnswers]);
    
    const check = (index: number) => (answers[index] - 1).toString() === questionData.correctAnswer[index];
    
    const markTile = (index: number) => {
        if (finalAnswer.length >= answers.length || spectatorMode) return;
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
        if (finalAnswer.includes(index.toString())) return colors[index % 4];
        return "white"; 
    }

    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{description}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                questionData.answers?.map((ans, index) => {
                    let tileIndex = answers[index] ? `${answers[index]}. ` : "";
                    if (showAnswers) tileIndex = `${Number(questionData.correctAnswer[index]) + 1}. `;
                    return (
                        <div className={styles.buttonContainer} key={index}>
                            <GameButton color={getCurrentColor(index)} size="thin" onClick={() => markTile(index)} feedback={getFeedback2(showFeedbackCorrect, showAnswers, index, check)}> 
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