import React, { useState } from "react";
import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PageContainer from "../../../page-components/page-container/page-container";
import PrimaryContainer from "../../../components/primary-container/primary-container";
import PrimaryButton, { TButtonColor } from "../../../components/primary-button.tsx/primary-button";
import DropdownButton from "../../../components/dropdown-button/dropdown-button";
import SelectLessonButtonHeader from "./select-lesson-button-header";

import { TCreateGame, TGameStage } from "../../../types/game";
import { useDeviceType } from "../../../helpers/responsiveContainers";
import { constantsUrls } from "../../../helpers/constants";
import { createGameStart, resetGame, setGameStage, setSelectedLesson } from "../../../redux/game/game.actions";
import { selectCurrentUser } from "../../../redux/user/user.selectors";
import { selectGameMode, selectPlayerRole } from "../../../redux/game/game.selectors";

import styles from "./select-lesson.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import containersStyles from "../../../styles/containers.module.scss";
import lobbyStyles from "../lobby/lobby.module.scss";

const SelectLesson: React.FC = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isMobile } = useDeviceType();
    const [openedCards, setOpenedCards] = useState<boolean[]>(Array(7).fill(false));
    const gameMode = useSelector(selectGameMode);
    const playerRole = useSelector(selectPlayerRole);
    const currentUser = useSelector(selectCurrentUser);

    const lessonsIds = [
        '6828addbd6da31b9e245207b',
        '507f1f77bcf86cd799439011',
        '68cc2a36f2516e1b47b74a8a',
        '6828addbd6da31b9e245207b',
        '6828addbd6da31b9e245207b',
        '6828addbd6da31b9e245207b',
        '6828addbd6da31b9e245207b',
    ];

    const toggleCard = (index: number) => {
        const newOpenedCards = Array(7).fill(false);
        newOpenedCards[index] = !openedCards[index];
        setOpenedCards(newOpenedCards);
    }

    const back = () => {
        if (currentUser?.role === "TEACHER") {
            dispatch(setGameStage("selectGameMode"));
        } else {
            dispatch(resetGame());
            navigate(constantsUrls.Main.startLessons);
        }
    }

    const openLesson = (index: number) => {
        const createGame: TCreateGame = {
            hostRole: playerRole || "player",
            lesson: lessonsIds[index],
            singlePlayerMode: false
        };
        let gameStage: TGameStage = "lobby";
        dispatch(setSelectedLesson(index + 1));
        if (gameMode === "single") {
            createGame.hostRole = "player";
            createGame.singlePlayerMode = true;
            gameStage = "wait";
        }
        dispatch(createGameStart(createGame));
        dispatch(setGameStage(gameStage));
    }
    
    const getColor = (index: number): TButtonColor => {
        if (index % 3 === 0) return "orange";
        if (index % 3 === 1) return "blue";
        return "red"; 
    }

    return (
        <PageContainer>
            <PrimaryContainer direction="column" additionalClassess={`${containersStyles.pagePadding2}`}>
                <p className={`${commonStyles.basicHeader6}`}>{t("lesson.choice.header")}</p>
                <PrimaryContainer direction="column">
                    {
                        openedCards.map((card, idx) => (
                            <DropdownButton
                                color={getColor(idx)}
                                description={t(`lesson.choice.0${idx + 1}.info`)}
                                handleClick={() => openLesson(idx)}
                                handleOpen={() => toggleCard(idx)}
                                header={<SelectLessonButtonHeader 
                                    text={t(`lesson.choice.0${idx + 1}.header`)}
                                    index={idx + 1}
                                    color={getColor(idx)}
                                />}
                                isOpen={card}
                                key={idx}
                            />
                        ))
                    }
                </PrimaryContainer>
                <PrimaryContainer
                    direction={"row"}
                    additionalClassess={`${styles.bottomButtons} ${lobbyStyles.navButtons}`}
                >
                    <PrimaryButton color="white" onClick={back} type={isMobile ? "default" : "action"} size={isMobile ? "desktopSmall" : "regular"} >
                        {t("main.back")}
                    </PrimaryButton>
                </PrimaryContainer>
            </PrimaryContainer>
        </PageContainer>
    )
}

export default SelectLesson;