import React, { useCallback, useEffect, useState } from "react";
import { useTranslate } from "@tolgee/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { startGameStart } from "../../../redux/game/game.actions";
import { constantsUrls } from "../../../helpers/constants";

import PageContainer from "../../../page-components/page-container/page-container";
import PrimaryContainer from "../../../components/primary-container/primary-container";
import { selectCurrentGame, selectIsGameCreatedByCurrentUser, selectPlayerRole, selectWaitingTimeUntil } from "../../../redux/game/game.selectors";

import styles from "./wait.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import smileImg from "../../../assets/login-page/smiling_earth.svg";
import { convertTimeUntilToRemainedSeconds, secondsToMinutes } from "../../../helpers/shared.functions";

const Wait: React.FC = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const waitingTimeUntil = useSelector(selectWaitingTimeUntil);
    const remainedSecondsAtStart = waitingTimeUntil ? convertTimeUntilToRemainedSeconds(waitingTimeUntil) || 10: 10;
    console.log('remained seconds:', remainedSecondsAtStart)
    const [ remainedSeconds, setRemainedSeconds ] = useState<number>(remainedSecondsAtStart);
    const isGameCreatedByCurrentUser = useSelector(selectIsGameCreatedByCurrentUser);
    const currentGame = useSelector(selectCurrentGame);
    const playerRole = useSelector(selectPlayerRole);
    
    const startGame = useCallback(() => {
        console.log(isGameCreatedByCurrentUser && playerRole === "player" && currentGame.singlePlayerMode);
        if (isGameCreatedByCurrentUser && playerRole === "player" && currentGame.singlePlayerMode) {
            dispatch(startGameStart(currentGame._id));
        }
        navigate(constantsUrls.Main.game);
    }, [dispatch, isGameCreatedByCurrentUser, playerRole, currentGame, navigate]);

    // const back = useCallback(() => {
    //     dispatch(resetGame());
    //     navigate(constantsUrls.Main.startLessons);
    // }, [dispatch, navigate]);

    useEffect(() => {
        if (remainedSeconds > 0) {
            setTimeout(() => setRemainedSeconds(remainedSeconds - 1), 1000);
        } else {
            startGame();
        }
    }, [remainedSeconds, setRemainedSeconds, startGame])
    return (
        <PageContainer>
            <PrimaryContainer direction="column" additionalClassess={`${styles.waitContainer} ${commonStyles.centerFlex}`} height="allScreenHeight">
                <img src={smileImg} className={`${styles.img}`} />
                <p className={`${styles.time}${remainedSeconds <= 5 ? ` ${styles.orangeText}`: ''}`}>{secondsToMinutes(remainedSeconds)}</p>
                <p className={styles.paragraph}>{t("start.lesson.info")}</p>
            </PrimaryContainer>
        </PageContainer>
    );
}

export default Wait;
