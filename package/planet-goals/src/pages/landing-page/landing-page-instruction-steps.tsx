import React from "react";
import { useTranslate } from "@tolgee/react";

import { useDeviceType } from "../../helpers/responsiveContainers";
import { formatNewLines } from "../../translations/utils";

//components
import PrimaryButton from "../../components/primary-button.tsx/primary-button";
import PrimaryContainer from "../../components/primary-container/primary-container";

//styles
import commonStyles from "../../styles/common.module.scss";
import containersStyles from "../../styles/containers.module.scss";
import styles from "./landing-page.module.scss";

//svg
import ChooseLessonTopicImg from "../../assets/landing-page/choose_a_lesson_topic.svg";
import ChooseWayToPlayImg from "../../assets/landing-page/choose_your_way_to_play.svg";
import LearnInGroupImg from "../../assets/landing-page/learn_in_group.svg";
import StartGameImg from "../../assets/landing-page/start_the_game.svg";
import SummarizeResultsImg from "../../assets/landing-page/summarize_your_results.svg";
import TakeYourFirstStepImg from "../../assets/landing-page/its_time_to_take_your_first_step.svg";

export const Screen1: React.FC = () => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const containersDirection = isMobile ? "column" : "row";
    return (
        <PrimaryContainer
            direction={containersDirection}
            additionalClassess={`${commonStyles.lightGreyBackground} ${commonStyles.largeHorizontalPadding}`}
        >
            <img
                src={LearnInGroupImg}
                alt="Learn in group"
                className={commonStyles.sectionImg}
            />
            <PrimaryContainer
                direction={containersDirection}
                additionalClassess={`${styles.sectionDescription} ${commonStyles.lightGreyBackground}${!isMobile ? ` ${containersStyles.halfScreenContainer}` : ''}`}
            >
                <p className={`${commonStyles.darkText} ${commonStyles.basicHeader}`}>
                    {formatNewLines(t("landing-page.headers.learn-in-group"))}
                </p>
                <p className={styles.primaryText}>
                    {t("landing-page.descriptions.learn-in-group")}
                </p>
            </PrimaryContainer>
        </PrimaryContainer>
    )
}

export const Screen2: React.FC = () => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const containersDirection = isMobile ? "column" : "row";
    return (
        <PrimaryContainer
            direction={containersDirection}
            additionalClassess={`${commonStyles.lightGreyBackground} ${commonStyles.largeHorizontalPadding}`}
        >
            <img
                src={ChooseWayToPlayImg}
                alt="Choose your way to play"
                className={commonStyles.sectionImg}
            />
            <PrimaryContainer
                direction={containersDirection}
                additionalClassess={`${styles.sectionDescription} ${commonStyles.lightGreyBackground}${!isMobile ? ` ${containersStyles.halfScreenContainer}` : ''}`}
            >
                <p className={`${commonStyles.darkText} ${commonStyles.basicHeader}`}>
                    {formatNewLines(t("landing-page.headers.choose-your-way"))}
                </p>
                <p className={styles.primaryText}>
                    {t("landing-page.descriptions.choose-your-way")}
                </p>
            </PrimaryContainer>
        </PrimaryContainer>
    )
}

export const Screen3: React.FC = () => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const containersDirection = isMobile ? "column" : "row";
    return (
        <PrimaryContainer
            direction={containersDirection}
            additionalClassess={`${commonStyles.lightGreyBackground} ${commonStyles.largeHorizontalPadding}`}
        >
            <img
                src={ChooseLessonTopicImg}
                alt="Choose a lesson topic"
                className={commonStyles.sectionImg}
            />
            <PrimaryContainer
                direction={containersDirection}
                additionalClassess={`${styles.sectionDescription} ${commonStyles.lightGreyBackground}${!isMobile ? ` ${containersStyles.halfScreenContainer}` : ''}`}
            >
                <p className={`${commonStyles.darkText} ${commonStyles.basicHeader}`}>
                    {formatNewLines(t("landing-page.headers.choose-lesson-topic"))}
                </p>
                <p className={styles.primaryText}>
                    {t("landing-page.descriptions.choose-lesson-topic")}
                </p>
            </PrimaryContainer>
        </PrimaryContainer>
    )
}

export const Screen4: React.FC = () => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const containersDirection = isMobile ? "column" : "row";
    return (
        <PrimaryContainer
            direction={containersDirection}
            additionalClassess={`${commonStyles.lightGreyBackground} ${commonStyles.largeHorizontalPadding}`}
        >
            <img
                src={StartGameImg}
                alt="Start the game"
                className={commonStyles.sectionImg}
            />
            <PrimaryContainer
                direction={containersDirection}
                additionalClassess={`${styles.sectionDescription} ${commonStyles.lightGreyBackground}${!isMobile ? ` ${containersStyles.halfScreenContainer}` : ''}`}
            >
                <p className={`${commonStyles.darkText} ${commonStyles.basicHeader}`}>
                    {formatNewLines(t("landing-page.headers.start-the-game"))}
                </p>
                <p className={styles.primaryText}>
                    {t("landing-page.descriptions.start-the-game")}
                </p>
            </PrimaryContainer>
        </PrimaryContainer>
    )
}

export const Screen5: React.FC = () => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const containersDirection = isMobile ? "column" : "row";
    return (
        <PrimaryContainer
            direction={containersDirection}
            additionalClassess={`${commonStyles.lightGreyBackground} ${commonStyles.largeHorizontalPadding}`}
        >
            <img
                src={SummarizeResultsImg}
                alt="Summarize your results"
                className={commonStyles.sectionImg}
            />
            <PrimaryContainer
                direction={containersDirection}
                additionalClassess={`${styles.sectionDescription} ${commonStyles.lightGreyBackground}${!isMobile ? ` ${containersStyles.halfScreenContainer}` : ''}`}
            >
                <p className={`${commonStyles.darkText} ${commonStyles.basicHeader}`}>
                    {formatNewLines(t("landing-page.headers.summarize-results"))}
                </p>
                <p className={styles.primaryText}>
                    {t("landing-page.descriptions.summarize-results")}
                </p>
            </PrimaryContainer>
        </PrimaryContainer>
    )
}

export const Screen6: React.FC = () => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const containersDirection = isMobile ? "column" : "row";
    return (
        <PrimaryContainer
            direction={containersDirection}
            additionalClassess={`${commonStyles.lightGreyBackground} ${commonStyles.largeHorizontalPadding}`}
        >
            <img
                src={TakeYourFirstStepImg}
                alt="It's time to take your first step"
                className={commonStyles.sectionImg}
            />
            <PrimaryContainer
                direction={containersDirection}
                additionalClassess={`${styles.sectionDescription} ${commonStyles.lightGreyBackground}${!isMobile ? ` ${containersStyles.halfScreenContainer}` : ''}`}
            >
                <p className={`${commonStyles.darkText} ${commonStyles.basicHeader}`}>
                    {formatNewLines(t("landing-page.headers.time-for-first-step"))}
                </p>
                <p className={`${styles.primaryText} ${styles.startLessonsDescription}`}>
                    {t("landing-page.descriptions.time-for-first-step")}
                </p>
                <PrimaryButton color="orange">
                    {t("landing-page.buttons.start-lessons")}
                </PrimaryButton>
            </PrimaryContainer>
        </PrimaryContainer>
    )
}