import React, { useState, useEffect } from "react";
import { ISubquestion } from "../../../types/lesson";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";

const SingleChoose: React.FC<ISubquestion> = (questionData) => {
    const colors: TButtonColor[] = ["red", "orange", "blue", "green"];
    const [answer, setAnswer] = useState(-1);
    const [buttonsDisabled, setButtonsDisabled] = useState(new Array<boolean>(questionData.answers.length).fill(false));

    useEffect(() => {
        if (!questionData) return;
        setAnswer(-1);
        setButtonsDisabled(new Array<boolean>(questionData.answers.length).fill(false));
    }, [questionData]);

    const onSelect = (index: number) => {
        if (answer !== -1) return;
        const tempButtons = [...buttonsDisabled];
        setAnswer(index);
        for (let i = 0; i < tempButtons.length; i++) tempButtons[i] = !(questionData.correctAnswerIndex === index && i === index);
        setButtonsDisabled(tempButtons);
        
    }

    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{questionData?.question}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                questionData.answers?.map((ans, index) => 
                    <div className={styles.buttonContainer} key={index}>
                        <GameButton color={colors?.[index] || colors[1]} size="thin" additionalClasses={commonStyles.leftSideText} disabled={buttonsDisabled[index]} onClick={() => onSelect(index)}> 
                            {`${String.fromCharCode(65 + index)}. ${ans}`}
                        </GameButton>
                    </div>
                )
            }
        </div>
    </div>
}

export default SingleChoose;