import React, { useEffect, useState } from "react";
import { useTranslate } from "@tolgee/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { resetGame, setIsGameCreatedByCurrentUser, removePlayerStart, startGameStart, fetchLessonStart } from "../../../redux/game/game.actions";
import { useDeviceType } from "../../../helpers/responsiveContainers";
import { selectCurrentUser } from "../../../redux/user/user.selectors";
import { selectCurrentGame, selectCurrentLesson, selectIsGameCreatedByCurrentUser } from "../../../redux/game/game.selectors";
import { constantsUrls } from "../../../helpers/constants";

import LobbyListItem from "./lobby-list-item";
import PageContainer from "../../../page-components/page-container/page-container";
import Popup from "../../../components/popup/popup";
import PrimaryButton, { TButtonSize, TButtonType } from "../../../components/primary-button.tsx/primary-button";
import PrimaryContainer from "../../../components/primary-container/primary-container";

import styles from "./lobby.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import containersStyles from "../../../styles/containers.module.scss";
import signInStyles from "../../sign-in/sign-in.module.scss";
//import selectLessonStyles from "../select-lesson/select-lesson.module.scss";

const LobbyComponent: React.FC = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const currentGame = useSelector(selectCurrentGame);
    const currentLesson = useSelector(selectCurrentLesson);
    const isGameCreatedByCurrentUser = useSelector(selectIsGameCreatedByCurrentUser);
    const { isMobile } = useDeviceType();
    const buttonsSize: TButtonSize = isMobile ? "desktopSmall" : "regular";
    const buttonsType: TButtonType = isMobile ? "default" : "action";

    const [isLeaving, setIsLeaving] = useState<boolean>(false);

    useEffect(() => {
        if (!isGameCreatedByCurrentUser && currentGame.owner === currentUser._id) {
            dispatch(setIsGameCreatedByCurrentUser(true));
        }
    }, [isGameCreatedByCurrentUser, dispatch, currentGame, currentUser]);

    useEffect(() => {
        if (currentLesson?._id || !currentGame?.lesson) return;
        dispatch(fetchLessonStart(currentGame.lesson));
    }, [dispatch, currentGame, currentLesson]);

    const handleDelete = (playerId: string) => {
        dispatch(removePlayerStart({ playerId, gameId: currentGame._id }));
    }

    const leaveLobby = () => setIsLeaving(true);
    const leaveLobbyCancel = () => setIsLeaving(false);

    const leaveLobbyConfirm = () => {
        setTimeout(() => dispatch(resetGame()), 500);
        navigate(constantsUrls.Main.startLessons);
    }  
    
    const startGame = () => {
        if (!isGameCreatedByCurrentUser) return;
        dispatch(startGameStart(currentGame._id));
        //dispatch(setGameStage("wait"));
    }

    return (
        <PageContainer>
            <PrimaryContainer direction="column" additionalClassess={containersStyles.pagePadding2}>
                <PrimaryContainer direction="column">
                    <p className={commonStyles.basicHeader}>
                        { t("lesson.lobby.CodeHeader") }
                    </p>
                    <p className={styles.invitationCode}>
                        {currentGame?.invitationCode}
                    </p>
                </PrimaryContainer>
                <PrimaryContainer direction="column">
                    <p className={`${commonStyles.basicHeader} ${styles.playersCount}`}>{t("lesson.lobby.PlayerList")} {currentGame?.players?.length || 0}/99</p>
                    <div className={styles.lobbyItemsContainer}>
                        {
                            currentGame?.players?.map((player, index) => (
                                <LobbyListItem key={index} index={index + 1} isDeleteEnabled={isGameCreatedByCurrentUser && currentUser._id !== player._id} handleDelete={() => handleDelete(player._id)} nickname={`${player.firstName} ${player.lastName}`}/>
                            ))
                        }
                    </div>
                </PrimaryContainer>
                <PrimaryContainer
                    direction={"row"}
                    additionalClassess={isMobile 
                        ? `${containersStyles.buttonsContainer} ${commonStyles.bottom} ${signInStyles.bottomButtons} ${styles.navButtons}`
                        : signInStyles.bottomButtons
                    }
                >
                    {
                        isGameCreatedByCurrentUser && 
                            <PrimaryButton color="orange" onClick={startGame} type={buttonsType} size={buttonsSize}>
                                {t("lesson.lobby.start.button")}
                            </PrimaryButton>
                    }
                    <PrimaryButton color="white" onClick={leaveLobby} type={buttonsType} size={buttonsSize}>
                        {t("lesson.lobby.exit.button")}
                    </PrimaryButton>
                </PrimaryContainer>
            </PrimaryContainer>
            <Popup visible={isLeaving}>
                <PrimaryContainer direction="column">
                    <p className={commonStyles.basicHeader3}>{t("lesson.lobby.leave.widget.header")}</p>
                    <p className={`${commonStyles.basicText} ${styles.popupDescription}`}>{t("lesson.lobby.leave.widget.info")}</p>
                    <PrimaryContainer direction="row" additionalClassess={styles.popupButtons}>
                        <PrimaryButton color="red" size="desktopSmall" onClick={leaveLobbyConfirm}>
                            {t("lesson.lobby.leave.widget.confirm.button")}
                        </PrimaryButton>
                        <PrimaryButton color="white" size="desktopSmall" onClick={leaveLobbyCancel}>
                            {t("lesson.lobby.leave.widget.cancel.button")}
                        </PrimaryButton>
                    </PrimaryContainer>
                </PrimaryContainer>
            </Popup>
        </PageContainer>
    )
}

export default LobbyComponent;