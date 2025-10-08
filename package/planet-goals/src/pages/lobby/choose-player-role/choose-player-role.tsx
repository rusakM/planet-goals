import React, { useEffect } from "react";
import { useTranslate } from "@tolgee/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useDeviceType } from "../../../helpers/responsiveContainers";

import { resetGame, setGameStage, setPlayerRole } from "../../../redux/game/game.actions";
import { selectCurrentUser } from "../../../redux/user/user.selectors";
import { selectIsGameCreatedByCurrentUser } from "../../../redux/game/game.selectors";

import PageContainer from "../../../page-components/page-container/page-container";
import PrimaryButton from "../../../components/primary-button.tsx/primary-button";
import PrimaryContainer from "../../../components/primary-container/primary-container";
import { TPlayerRole } from "../../../types/game";

import cardsStyles from "../../choose-game-mode/choose-game-mode.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import containersStyles from "../../../styles/containers.module.scss";
import styles from "./choose-player-role.module.scss";

import justObservingImg from "../../../assets/lessons-creator/im_just_observing.svg";
import competeImg from "../../../assets/lessons-creator/join_the_lesson.svg";
import { constantsUrls } from "../../../helpers/constants";

const ChoosePlayerRole: React.FC = () => {
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const isGameCreatedByCurrentUser = useSelector(selectIsGameCreatedByCurrentUser);

    const handleBack = () => {
        setTimeout(() => dispatch(resetGame()), 500);
        navigate(constantsUrls.Main.startLessons);
    }

    useEffect(() => {
        if (currentUser.role !== "TEACHER") {
            dispatch(resetGame());
            navigate(constantsUrls.Main.startLessons);
        } 
    }, [currentUser, dispatch, navigate])
    
    const join = (role: TPlayerRole) => {
        dispatch(setPlayerRole(role));
        if (isGameCreatedByCurrentUser) dispatch(setGameStage("selectLesson"));
        else dispatch(setGameStage("join"));
    }
        
    return (
        <PageContainer>
            <PrimaryContainer direction="column" additionalClassess={containersStyles.pagePadding2}>
                <PrimaryContainer direction="column">
                    <p className={`${commonStyles.basicHeader6}`}>
                        {t("lesson.mode.teacher.header")}
                    </p>
                </PrimaryContainer>
                <PrimaryContainer direction={isMobile ? "column" : "row"} additionalClassess={`${cardsStyles.cardsContainer}`}>
                    <div className={cardsStyles.cardContainer}>
                        <div className={`${cardsStyles.card} ${styles.justWatchingCard}`}>
                            <div>
                                <img src={justObservingImg} alt="Just watch" className={cardsStyles.cardImg} />
                            </div>
                            <div className={cardsStyles.cardData}>
                                <div>
                                    <p className={`${commonStyles.basicHeader5} ${commonStyles.darkText}`}>
                                        {t("lesson.mode.teacher.JustObserving.header")}
                                    </p>
                                    <p>
                                        {t("lesson.mode.teacher.JustObserving.info")}
                                    </p>
                                </div>
                                <div>
                                    <PrimaryButton color="orange" size="desktopSmall" onClick={() => join("spectator")}>
                                        {t("lesson.StartLesson.button")}
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cardsStyles.cardContainer}>
                        <div className={`${cardsStyles.card} ${styles.competeCard}`}>
                            <div>
                                <img src={competeImg} alt="Compete with others" className={cardsStyles.cardImg} />
                            </div>
                            <div className={cardsStyles.cardData}>
                                <div>
                                    <p className={`${commonStyles.basicHeader5} ${commonStyles.darkText}`}>
                                        {t("lesson.mode.teacher.CompeteWithOthers.header")}
                                    </p>
                                    <p>
                                        {t("lesson.mode.teacher.CompeteWithOthers.info")}
                                    </p>
                                </div>
                                <div>
                                    <PrimaryButton color="orange" size="desktopSmall" onClick={() => join("player")}>
                                        {t("lesson.StartLesson.button")}
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </PrimaryContainer>
                <PrimaryContainer additionalClassess={cardsStyles.backButtonContainer}>
                    <PrimaryButton color="white" size="regular" onClick={handleBack}>
                        {t("main.back")}
                    </PrimaryButton>
                </PrimaryContainer>
            </PrimaryContainer>
        </PageContainer>
    );
}

export default ChoosePlayerRole;