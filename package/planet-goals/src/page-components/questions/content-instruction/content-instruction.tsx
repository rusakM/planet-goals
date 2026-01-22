import React from "react";
import { ISubquestion } from "../../../types/lesson";
import { useTranslate } from "@tolgee/react";
import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

const ContentInstruction: React.FC<ISubquestion> = (questionData) => {
    const { t } = useTranslate();
    return <div className={styles.questionContainer}>
        <div>
            <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{t(questionData?.question)}</p>
            <p className={`${styles.basicText}`}>{t(questionData?.description)}</p>
        </div>
    </div>
}

export default ContentInstruction;