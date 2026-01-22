import React from "react";
import { useTranslate } from "@tolgee/react";
import parse from 'html-react-parser';
import { ISubquestion } from "../../../types/lesson";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

const ContentText: React.FC<ISubquestion> = (questionData) => {
    const { t } = useTranslate();
    return <div className={styles.questionContainer}>
        <div>
            {
                questionData?.question && <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{t(questionData?.question)}</p>
            }
            <p className={`${styles.basicText}`}>{parse(t(questionData?.description))}</p>
        </div>
    </div>
}

export default ContentText;