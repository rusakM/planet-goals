import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "@tolgee/react";
import { useDispatch } from "react-redux";

import Popup from "../../components/popup/popup";
import PrimaryButton from "../../components/primary-button.tsx/primary-button";
import { resetGame, setCurrentQuestion } from "../../redux/game/game.actions";
import { secondsToMinutes } from "../../helpers/shared.functions";
import { constantsUrls } from "../../helpers/constants";

import styles from "./game.module.scss";
import commonStyles from "../../styles/common.module.scss";

import settingsIcon from "../../assets/icons/settings_icon.svg";
import { TCurrentQuestion } from "../../types/lesson";

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
    const navigate = useNavigate();
    // const [remainedSeconds, setRemainedSeconds] = useState(timeInSek);
    // const [currentQuestionTemp, setCurrentQuestionTemp] = useState(currentQuestionIndex);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [exitVisible, setExitVisible] = useState(false);

    // useEffect(() => {
    //     if (currentQuestionIndex !== currentQuestionTemp) {
    //         setCurrentQuestionTemp(currentQuestionIndex);
    //         setRemainedSeconds(timeInSek);
    //     }
    //     if (remainedSeconds > 0) {
    //         setTimeout(() => setRemainedSeconds(remainedSeconds - 1), 1000);
    //     }
    // }, [remainedSeconds, currentQuestionIndex, timeInSek, currentQuestionTemp]);  

    const nextSLide = () => {
        if (currentQuestionIndex.join("") !== nextQuestionIndex.join("")) {
            dispatch(setCurrentQuestion(nextQuestionIndex));
        }
    }
    
    const closePopups = () => {
        setSettingsVisible(false);
        setExitVisible(false);
    }

    return <div className={styles.gameContainer}>
        <div className={styles.header}>
            <p className={styles.timer} onClick={nextSLide}>{secondsToMinutes(timeInSek)}</p>
        </div>
        <div className={`${styles.questionContainer} ${commonStyles.centerFlex}`}>
            {children}
        </div>
        <div className={styles.footer}>
            <img src={settingsIcon} alt="settingsIcon" className={styles.settingsBtn} onClick={() => setSettingsVisible(true)}/>
        </div>
        <Popup visible={settingsVisible && !exitVisible}>
            <p>settings</p>
            <PrimaryButton color="white" size="small" onClick={() => { 
                setSettingsVisible(false);
                setExitVisible(false);
            }}>
                exit
            </PrimaryButton>
            <PrimaryButton color="white" size="small" onClick={closePopups}>
                {t("lesson.lobby.leave.widget.cancel.button")}
            </PrimaryButton>

        </Popup>
        <Popup visible={!settingsVisible && exitVisible}>
            <PrimaryButton color="red" size="small" onClick={() => {
                dispatch(resetGame());
                navigate(constantsUrls.Main.startLessons);
            }}>
                {t("lesson.confirm.button")}
            </PrimaryButton>
            <PrimaryButton color="white" size="small" onClick={closePopups}>
                {t("lesson.lobby.leave.widget.cancel.button")}
            </PrimaryButton>
        </Popup>
    </div>;
}

export default GameContainer;
