import React from "react";
import { ISubquestion } from "../../../types/lesson";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

const ContentText: React.FC<ISubquestion> = (questionData) => {

    return <div>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{questionData?.question}</p>
        <p className={`${styles.basicText}`}>{questionData?.description}</p>
    </div>
}

export default ContentText;