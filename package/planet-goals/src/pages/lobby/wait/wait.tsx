import React, { useCallback, useEffect, useState } from "react";
import { useTranslate } from "@tolgee/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { resetGame } from "../../../redux/game/game.actions";
import { constantsUrls } from "../../../helpers/constants";

import PageContainer from "../../../page-components/page-container/page-container";
import PrimaryContainer from "../../../components/primary-container/primary-container";

import styles from "./wait.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import smileImg from "../../../assets/login-page/smiling_earth.svg";
import { secondsToMinutes } from "../../../helpers/shared.functions";

interface IWait {
    waitingTimeUntil?: Date | string | number;
} 

const Wait: React.FC<IWait> = ({ waitingTimeUntil }) => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const remainedSecondsAtStart = waitingTimeUntil ? Math.floor(Math.abs(Date.now() - new Date(waitingTimeUntil).getTime()) / 1000): 10;
    const [ remainedSeconds, setRemainedSeconds ] = useState<number>(remainedSecondsAtStart);

    const back = useCallback(() => {
        dispatch(resetGame());
        navigate(constantsUrls.Main.startLessons);
    }, [dispatch, navigate]);

    useEffect(() => {
        if (remainedSeconds > 0) {
            setTimeout(() => setRemainedSeconds(remainedSeconds - 1), 1000);
        }
        //  else {
            // back();
        // }
    }, [remainedSeconds, setRemainedSeconds, back])
    return (
        <PageContainer>
            <PrimaryContainer direction="column" additionalClassess={`${styles.waitContainer} ${commonStyles.centerFlex}`} height="allScreenHeight">
                <img src={smileImg} className={`${styles.img}`} />
                <p className={`${styles.time}${remainedSeconds <= 5 ? ` ${commonStyles.orangeText}`: ''}`}>{secondsToMinutes(remainedSeconds)}</p>
                <p className={styles.paragraph}>{t("start.lesson.info")}</p>
            </PrimaryContainer>
        </PageContainer>
    );
}

export default Wait;
