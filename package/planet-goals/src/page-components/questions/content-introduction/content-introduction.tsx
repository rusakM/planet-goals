import React from "react";
import { useTranslate } from "@tolgee/react";
import { ISubquestion } from "../../../types/lesson";

import emojisMap from "./introductions.map";
import { parseBoldTags } from "../../../translations/utils";
import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

interface IContentIntroduction {
    questionData: ISubquestion;
    subquestionNumber: number;
}

const ContentIntroduction: React.FC<IContentIntroduction> = ({ questionData, subquestionNumber }) => {
    const { t } = useTranslate();
    const emojis = (subquestionNumber >= 0 && subquestionNumber < 4) ? emojisMap[subquestionNumber] : null; 
    const descriptionsList = questionData.description.split("|");
    return <div className={styles.questionContainer}>
        {
            questionData?.question && <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{t(questionData?.question)}</p>
        }
        {
            descriptionsList?.length && descriptionsList.map((descLine, index) => (
                <p className={`${styles.basicText} ${commonStyles.centeredText} ${commonStyles.smallHorizontalPadding}`} key={index}>{emojis?.length > index ? `${emojis[index]} ` : ""}{parseBoldTags(t(descLine), `${styles.basicTextBold}`)}</p>
            ))
        }
        
    </div>
}

export default ContentIntroduction;