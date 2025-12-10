import React from "react";
import { useTranslate } from "@tolgee/react";
import PrimaryContainer from "../primary-container/primary-container";
import { useDeviceType } from "../../helpers/responsiveContainers";
import PrimaryButton from "../primary-button.tsx/primary-button";
import styles from "./progress-card.module.scss";
import stylesCircle from "../../pages/lobby/select-lesson/select-lesson.module.scss";
import commonStyles from "../../styles/common.module.scss";

export type TCardColor = "blue" | "orange" | "red";
export type TCircleColor = TCardColor | "darkBlue";

interface IProgressCard {
    color: TCardColor;
    colorCircle?: TCircleColor;
    id: string;
    lessonNumber: number;
    maxPoints: number;
    open: (id: string, index: number) => void;
    points?: number;
    title: string;
}

const ProgressCard: React.FC<IProgressCard> = ({color = "orange", colorCircle, id, lessonNumber, maxPoints, open, points = 0, title}) => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    return (
        <PrimaryContainer additionalClassess={`${styles.cardContainer}`}>
            <div className={`${styles.card} ${styles[color]}`}>
                <div className={`${stylesCircle.circle} ${stylesCircle[colorCircle ?? color]}`}>{lessonNumber}</div>
                <p className={`${commonStyles.whiteText} ${commonStyles.basicHeader4}`}>{title.toUpperCase()}</p>
                <p className={`${commonStyles.whiteText} ${commonStyles.basicHeader}`}>{points}/{maxPoints}</p>
            </div>
            <PrimaryButton color="orange" size={isMobile ? "small" : "desktopSmall"} onClick={() => open(id, lessonNumber)}>
                {t("lesson.StartLesson.button")}
            </PrimaryButton>
        </PrimaryContainer>
    );
}

export default ProgressCard;