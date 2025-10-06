import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "@tolgee/react";
import { useDispatch, useSelector } from "react-redux";

import Popup from "../../components/popup/popup";
import PrimaryButton from "../../components/primary-button.tsx/primary-button";
import { resetGame, setCurrentQuestion } from "../../redux/game/game.actions";
import { secondsToMinutes } from "../../helpers/shared.functions";
import { constantsUrls } from "../../helpers/constants";
import { useDeviceType } from "../../helpers/responsiveContainers";

import styles from "./game.module.scss";
import commonStyles from "../../styles/common.module.scss";
import exitIcon from "../../assets/icons/exit_icon.svg";
import { TCurrentQuestion } from "../../types/lesson";
import { selectCurrentLesson, selectCurrentQuestionSetAt, selectGameMode, selectPlayerRole } from "../../redux/game/game.selectors";
import { GAME_PLAY_STAGE_ENUM } from "../../types/game";

import bgIntroductionMobile from "../../assets/game/topic_1_mobile.svg";
import bgIntroduction from "../../assets/game/topic_1_pc.svg";
import bgKnowledgeMobile from "../../assets/game/topic_2_mobile.svg";
import bgKnowledge from "../../assets/game/topic_2_pc.svg";
import bgQuickContentMobile from "../../assets/game/topic_3_mobile.svg";
import bgQuickContent from "../../assets/game/topic_3_pc.svg";
import bgCompetitionMobile from "../../assets/game/topic_4_mobile.svg";
import bgCompetition from "../../assets/game/topic_4_pc.svg";
import bgFinalMobile from "../../assets/game/topic_5_mobile.svg";
import bgFinal from "../../assets/game/topic_5_pc.svg";
import PrimaryContainer from "../../components/primary-container/primary-container";

const getBackgroundImg = (stage: GAME_PLAY_STAGE_ENUM, isMobile: boolean) => {
    if (isMobile) {
        switch (stage) {
            case GAME_PLAY_STAGE_ENUM.INTRODUCTION:
                return bgIntroductionMobile;
            case GAME_PLAY_STAGE_ENUM.KNOWLEDGE:
                return bgKnowledgeMobile;
            case GAME_PLAY_STAGE_ENUM.QUICK_CONTENT:
                return bgQuickContentMobile;
            case GAME_PLAY_STAGE_ENUM.COMPETITION:
                return bgCompetitionMobile;
            case GAME_PLAY_STAGE_ENUM.FINAL:
                return bgFinalMobile;
            default:
                return bgIntroductionMobile;
        }
    }

    switch (stage) {
        case GAME_PLAY_STAGE_ENUM.INTRODUCTION:
            return bgIntroduction;
        case GAME_PLAY_STAGE_ENUM.KNOWLEDGE:
            return bgKnowledge;
        case GAME_PLAY_STAGE_ENUM.QUICK_CONTENT:
            return bgQuickContent;
        case GAME_PLAY_STAGE_ENUM.COMPETITION:
            return bgCompetition;
        case GAME_PLAY_STAGE_ENUM.FINAL:
            return bgFinal;
        default:
            return bgIntroduction;
    }
}

interface IGameContainer {
    children: React.ReactNode;
    currentQuestionIndex: TCurrentQuestion;
    isUserActionRequired: boolean;
    nextQuestionIndex: TCurrentQuestion;
    timeInSek: number;
}

const GameContainer: React.FC<IGameContainer> = ({ children, currentQuestionIndex, nextQuestionIndex, timeInSek }) => {
    const dispatch = useDispatch();
    const { t } = useTranslate();
    const { isMobile } = useDeviceType();
    const navigate = useNavigate();
    const currentLesson = useSelector(selectCurrentLesson);
    const playerRole = useSelector(selectPlayerRole);
    const gameMode = useSelector(selectGameMode);
    const currentQuestionSetAt = useSelector(selectCurrentQuestionSetAt);
    const [exitVisible, setExitVisible] = useState(false);  
    const backgroundImage = getBackgroundImg(currentLesson?.questions?.[currentQuestionIndex[0]]?.gameStage, isMobile);

    const nextSLide = useCallback(() => {
        if (currentQuestionIndex.join("") !== nextQuestionIndex.join("")) {
            dispatch(setCurrentQuestion(nextQuestionIndex));
        }
    }, [nextQuestionIndex, currentQuestionIndex, dispatch]);
    
    useEffect(() => {
        if (playerRole === 'player' || gameMode === 'single') return;
        const currentQuestion = currentLesson.questions[currentQuestionIndex[0]];
        if (currentQuestion?.gameStage !== GAME_PLAY_STAGE_ENUM.COMPETITION || currentQuestion?.subquestions?.length <= 1) return;
        const secondsElapsed = Math.ceil((Date.now() - currentQuestionSetAt) / 1000);
        console.log('spectator seconds elapsed:', secondsElapsed, 'expected:', currentQuestion?.subquestions?.[currentQuestionIndex[1]]?.timeInSek);
        if (currentQuestion?.subquestions?.[currentQuestionIndex[1]]?.timeInSek > 0 && secondsElapsed > currentQuestion?.subquestions?.[currentQuestionIndex[1]]?.timeInSek) nextSLide();
    }, [playerRole, gameMode, currentLesson, currentQuestionIndex, currentQuestionSetAt, nextSLide]);

    const closePopups = () => {
        setExitVisible(false);
    }

    return <div className={styles.gameContainer}>
        <div className={styles.header}>
            <p className={styles.timer} onClick={nextSLide}>{secondsToMinutes(timeInSek)}</p>
        </div>
        <div className={`${styles.questionContainer} ${commonStyles.centerFlex}`}
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {children}
        </div>
        <div className={styles.footer}>
            <img src={exitIcon} alt="exitIcon" className={styles.settingsBtn} onClick={() => setExitVisible(true)}/>
        </div>
        <Popup visible={ exitVisible}>
            <div>
                <p className={`${commonStyles.basicHeader5} ${commonStyles.centeredText}`}>{t("game.leave.exit.button")}</p>
                <p className={`${commonStyles.centeredText} ${commonStyles.smallHorizontalPadding}`}>{t("game.leave.exit.question")}</p>
                <PrimaryContainer additionalClassess={`${commonStyles.inheritBackground} ${commonStyles.basicGap} ${commonStyles.padding1em}`}>
                    <PrimaryButton color="red" size="small" onClick={() => {
                        dispatch(resetGame());
                        navigate(constantsUrls.Main.startLessons);
                    }}>
                        {t("lesson.confirm.button")}
                    </PrimaryButton>
                    <PrimaryButton color="white" size="small" onClick={closePopups}>
                        {t("lesson.lobby.leave.widget.cancel.button")}
                    </PrimaryButton>
                </PrimaryContainer>
            </div>
        </Popup>
    </div>;
}

export default GameContainer;
