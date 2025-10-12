import React, { useState, useEffect } from "react";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import { ISubquestionComponent } from "../questions.types";
import { getFeedback2 } from "../../../helpers/game";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";

const MultiChoose: React.FC<ISubquestionComponent> = ({ questionData, sendAnswerAction, showAnswers, spectatorMode }) => {
    const colors: TButtonColor[] = ["red", "orange", "blue", "green"];
    const answersLength = questionData.answers.length;
    const correctAnswersParsed: number[] = JSON.parse(questionData.correctAnswer);
    const [ answers, setAnswers ] = useState(new Array<number>(answersLength).fill(-1));
    const [ answersResults, setAnswersResults ] = useState(new Array<number>(questionData.answers.length).fill(-1));
    const [answerNo, setAnswerNo] = useState(0);
    const [showFeedbackCorrect, setShowFeedbackCorrect] = useState(false);

    useEffect(() => {
        if (!questionData) return;
        const correctAnswersCount = questionData.correctAnswer.split(",").length;
        setAnswers(new Array<number>(correctAnswersCount).fill(-1));
        setAnswersResults(new Array<number>(questionData.answers.length).fill(-1));
        setAnswerNo(0);
        setShowFeedbackCorrect(false);
    }, [questionData]);

    useEffect(() => {
        if (!showAnswers) {
            setShowFeedbackCorrect(false);
            return;
        }
        if (showFeedbackCorrect) return;
        const timer = setTimeout(() => {
            setShowFeedbackCorrect(true);
        }, 1000);

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAnswers]);
    
    const check = (index: number) => {
        return correctAnswersParsed.includes(index);
    }

    const mark = (index: number) => {
        if (spectatorMode || answers.includes(index)) return;
        if (answerNo >= correctAnswersParsed.length) return;

        const tempAnswers = [...answers];
        const tempAnswersResults = [...answersResults];
        tempAnswers[answerNo] = index;
        tempAnswersResults[index] = Number(check(index));
        const tempAnswerNo = answerNo + 1;
        setAnswers(tempAnswers);
        setAnswerNo(tempAnswerNo);
        setAnswersResults(tempAnswersResults);

        if (tempAnswerNo >= correctAnswersParsed.length) sendAnswerAction(JSON.stringify(tempAnswers.filter(ans => ans != -1)));
    }    

    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{questionData?.question}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                questionData.answers?.map((ans, index) => {
                    let color: TButtonColor = (answerNo > 0 && !answers.includes(index)) ? "white" : colors[index % 4];
                    const feedback = getFeedback2(showFeedbackCorrect, showAnswers, index, check);
                    if (showAnswers) color = check(index) ? colors[index % 4] : "white";
                    return <div className={styles.buttonContainer} key={index}>
                        <GameButton color={color} size="thin" additionalClasses={commonStyles.leftSideText} onClick={() => mark(index)} feedback={feedback}> 
                            {`${String.fromCharCode(65 + index)}. ${ans}`}
                        </GameButton>
                    </div>
                })
            }
        </div>
    </div>
}

export default MultiChoose;