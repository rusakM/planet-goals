import React from "react";
import { ISubquestion } from "../../../types/lesson";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";

const SelectCorrectAnswer: React.FC<ISubquestion> = (questionData) => {
    const colors: TButtonColor[] = ["red", "orange", "blue", "green"];

    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{questionData?.question}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                questionData.answers?.map((ans, index) => 
                    <div className={styles.buttonContainer} key={index}>
                        <GameButton color={colors?.[index] || colors[1]} size="thin" additionalClasses={commonStyles.leftSideText}> 
                            {ans}
                        </GameButton>
                    </div>
                )
            }
        </div>
    </div>
}

export default SelectCorrectAnswer;