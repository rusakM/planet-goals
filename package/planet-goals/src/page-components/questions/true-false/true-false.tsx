import React from "react";
import { useTranslate } from "@tolgee/react";
import { ISubquestion } from "../../../types/lesson";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import GameButton from "../../../components/game-button/game-button";

const TrueFalse: React.FC<ISubquestion> = (questionData) => {
    const { t } = useTranslate();

    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{questionData?.question}</p>
        <div className={`${styles.buttonsContainer}`}>
            <div className={styles.buttonContainer}>
                <GameButton color="green"> 
                    {t("main.buttons.booleans.true")}
                </GameButton>
            </div>
            <div className={styles.buttonContainer}>
                <GameButton color="red"> 
                    {t("main.buttons.booleans.false")}
                </GameButton>
            </div>
        </div>
    </div>
}

export default TrueFalse;