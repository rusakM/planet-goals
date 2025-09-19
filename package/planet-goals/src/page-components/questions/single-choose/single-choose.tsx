import React, { useState, useEffect } from "react";
import { ISubquestionComponent } from "../questions.types";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import { getFeedback } from "../../../helpers/game";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";

const SingleChoose: React.FC<ISubquestionComponent> = ({questionData, sendAnswerAction, showAnswers, spectatorMode}) => {
    const colors: TButtonColor[] = ["blue", "green", "orange", "red"];
    const [answer, setAnswer] = useState(-1);
    const [buttonsDisabled, setButtonsDisabled] = useState(new Array<boolean>(questionData.answers.length).fill(false));

    useEffect(() => {
        if (!questionData) return;
        setAnswer(-1);
        setButtonsDisabled(new Array<boolean>(questionData.answers.length).fill(false));
    }, [questionData]);

    const check = (index: number) => index === questionData.correctAnswerIndex;

    const onSelect = (index: number) => {
        if (answer !== -1 || spectatorMode) return;
        const tempButtons = [...buttonsDisabled];
        setAnswer(index);
        for (let i = 0; i < tempButtons.length; i++) tempButtons[i] = !(questionData.correctAnswerIndex === index && i === index);
        setButtonsDisabled(tempButtons);
        sendAnswerAction(questionData.answers[index]);
    }

    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{questionData?.question}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                questionData.answers?.map((ans, index) => {
                    let color: TButtonColor = (answer === -1 || answer === index) ? colors[index % 4] : "white";
                    const feedback = getFeedback(showAnswers, answer === index, index, check);
                    if (showAnswers) color = check(index) ? colors[index % 4] : "white";
                    return <div className={styles.buttonContainer} key={index}>
                        <GameButton color={color} size="thin" additionalClasses={commonStyles.leftSideText} disabled={spectatorMode || buttonsDisabled[index]} onClick={() => onSelect(index)} feedback={feedback}> 
                            {`${String.fromCharCode(65 + index)}. ${ans}`}
                        </GameButton>
                    </div>
                }
                    
                )
            }
        </div>
    </div>
}

export default SingleChoose;