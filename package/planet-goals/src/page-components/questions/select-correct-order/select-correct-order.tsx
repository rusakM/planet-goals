import React, { useEffect, useState } from "react";
import { ISubquestionComponent } from "../questions.types";
import { getFeedback } from "../../../helpers/game";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";
import { constantsGame } from "../../../helpers/constants";

const SelectCorrectOrder: React.FC<ISubquestionComponent> = ({questionData, sendAnswerAction, showAnswers, spectatorMode }) => {
    const colors: TButtonColor[] = ["red", "orange", "blue", "green"];
    const [answers, setAnswers] = useState(new Array(questionData.answers.length).fill(0));
    const [currentAnswer, setCurrentAnswer] = useState(0);
    const [finalAnswer, setFinalAnswer] = useState("");
    const [showFeedbackCorrect, setShowFeedbackCorrect] = useState(false);
    
    useEffect(() => {
        if (!questionData) return;
        setAnswers(new Array(questionData.answers.length).fill(0));
        setCurrentAnswer(0);
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
        if (spectatorMode || finalAnswer.length >= questionData.answers.length) return;
        if (finalAnswer.includes(index.toString())) return;
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
        if (tempFinalAnswer.length >= questionData.answers.length) sendAnswerAction(tempFinalAnswer);
    }

    const getCurrentColor = (index: number) => {
        if (finalAnswer.includes(index.toString())) return colors[index % 4];
        return "white"; 
    }

    return <div className={styles.questionContainer}>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{questionData?.question}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                questionData.answers?.map((ans, index) => {
                    let tileIndex = answers[index] ? `${answers[index]}. ` : "";
                    if (showAnswers) tileIndex = `${Number(questionData.correctAnswer[index]) + 1}. `;

                    return <div className={styles.buttonContainer} key={index}>
                        <GameButton color={getCurrentColor(index)} size="thin" onClick={() => markTile(index)} feedback={getFeedback(showFeedbackCorrect, showAnswers, index, check)}> 
                            {`${tileIndex}${ans}`}
                        </GameButton>
                    </div>
                    }
                )
            }
        </div>
    </div>
}

export default SelectCorrectOrder;