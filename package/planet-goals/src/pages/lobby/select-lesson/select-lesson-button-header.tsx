import React from "react";

import { TButtonColor } from "../../../components/primary-button.tsx/primary-button";
import styles from "./select-lesson.module.scss";

interface ISelectLessonButtonHeader {
    color: TButtonColor,
    index: number,
    text: string,
}

const SelectLessonButtonHeader: React.FC<ISelectLessonButtonHeader> = ({ color, index, text }) => (
    <span className={styles.selectLessonButtonHeader}>
        <div className={`${styles.circle} ${styles[color]}`}>{index}</div>
        <span className={`${styles.buttonText}`}>{text}</span>
    </span>
);

export default SelectLessonButtonHeader;