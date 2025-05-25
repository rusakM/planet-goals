import React from 'react';
import { useTranslate } from '@tolgee/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import PageContainer from '../../page-components/page-container/page-container';
import PrimaryButton from '../../components/primary-button.tsx/primary-button';
import PrimaryContainer from '../../components/primary-container/primary-container';

import styles from "./choose-game-mode.module.scss";
import commonStyles from "../../styles/common.module.scss";
import containersStyles from "../../styles/containers.module.scss";


import { constantsUrls } from '../../helpers/constants';
import { useDeviceType } from '../../helpers/responsiveContainers';

import { setGameMode, setGameStage, setIsGameCreatedByCurrentUser, setPlayerRole } from '../../redux/game/game.actions';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import joinTheLessonImg from "../../assets/lessons-creator/i_compete_with_others.svg";
import createANewLobbyImg from "../../assets/lessons-creator/create_a_new_room.svg";
import startTheLessonImg from "../../assets/lessons-creator/start_lesson.svg";

const ChooseGameMode: React.FC = () => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);

    const handleBack = () => {
        navigate(constantsUrls.LandingPage.main);
    }

    const join = () => {
        if (currentUser.role === "TEACHER") {
            dispatch(setGameStage("selectGameMode"));
        } else {
            dispatch(setGameStage("join"));
        }
        navigate(constantsUrls.Main.lobby);
    }

    const createLesson = () => {
        if (currentUser.role === "TEACHER") {
            dispatch(setGameStage("selectGameMode"));
        } else {
            dispatch(setPlayerRole("player"));
            dispatch(setGameStage("selectLesson"));
        }
        dispatch(setIsGameCreatedByCurrentUser(true));
        dispatch(setGameMode("multi"));
        navigate(constantsUrls.Main.lobby);
    }

    const startLesson = () => {
        dispatch(setGameStage("selectLesson"));
        dispatch(setIsGameCreatedByCurrentUser(true));
        dispatch(setGameMode('single'));
        dispatch(setPlayerRole("player"));
        navigate(constantsUrls.Main.lobby);
    }

    return (
        <PageContainer>
            <PrimaryContainer direction="column" additionalClassess={containersStyles.pagePadding2}>
                <PrimaryContainer direction={isMobile ? "column" : "row"} additionalClassess={`${styles.cardsContainer}`}>
                    <div className={styles.cardContainer}>
                        <div className={styles.card}>
                            <div>
                                <img src={joinTheLessonImg} alt="Join the lesson" className={styles.cardImg} />
                            </div>
                            <div className={styles.cardData}>
                                <div>
                                    <p className={`${commonStyles.basicHeader5} ${commonStyles.darkText}`}>
                                        {t("lesson.mode.JoinLesson.header")}
                                    </p>
                                    <p>
                                        {t("lesson.mode.JoinLesson.info")}
                                    </p>
                                </div>
                                <div>
                                    <PrimaryButton color="orange" size="desktopSmall" onClick={join}>
                                        {t("lesson.StartLesson.button")}
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.cardContainer}>
                        <div className={styles.card}>
                            <img src={createANewLobbyImg} alt="Create a new lobby" className={styles.cardImg} />
                            <div className={styles.cardData}>
                                <div>
                                    <p className={`${commonStyles.basicHeader5} ${commonStyles.darkText}`}>
                                        {t("lesson.mode.CreateLobby.header")}
                                    </p>
                                    <p>
                                        {t("lesson.mode.CreateLobby.info")}
                                    </p>
                                </div>
                                <div>
                                    <PrimaryButton color="orange" size="desktopSmall" onClick={createLesson}>
                                        {t("lesson.StartLesson.button")}
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.cardContainer}>
                        <div className={styles.card}>
                            <img src={startTheLessonImg} alt="Start the lesson" className={styles.cardImg} />
                            <div className={styles.cardData}>
                                <div>
                                    <p className={`${commonStyles.basicHeader5} ${commonStyles.darkText}`}>
                                        {t("lesson.mode.IndividualLesson.header")}
                                    </p>
                                    <p>
                                        {t("lesson.mode.IndividualLesson.info")}
                                    </p>
                                </div>
                                <div>
                                    <PrimaryButton color="orange" size="desktopSmall" onClick={startLesson}>
                                        {t("lesson.StartLesson.button")}
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </PrimaryContainer>
                <PrimaryContainer additionalClassess={styles.backButtonContainer}>
                    <PrimaryButton color="white" size="regular" onClick={handleBack}>
                        {t("main.back")}
                    </PrimaryButton>
                </PrimaryContainer>
            </PrimaryContainer>
        </PageContainer>
    );
}

export default ChooseGameMode;