import React from "react";
import { useTranslate } from "@tolgee/react";
import { ISubquestion } from "../../../types/lesson";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

const ContentQuestion: React.FC<ISubquestion> = (questionData) => {
    const { t } = useTranslate();
    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{t(questionData.question)}</p>
    </div>
}

export default ContentQuestion;