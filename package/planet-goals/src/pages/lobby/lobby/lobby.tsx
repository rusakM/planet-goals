import React, { useState } from "react";
import { useTranslate } from "@tolgee/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setGameStage, resetGame } from "../../../redux/game/game.actions";
import { useDeviceType } from "../../../helpers/responsiveContainers";
import { selectCurrentUser } from "../../../redux/user/user.selectors";
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
    const { isMobile } = useDeviceType();
    const invitationCode = "ABC12";
    const buttonsSize: TButtonSize = isMobile ? "desktopSmall" : "regular";
    const buttonsType: TButtonType = isMobile ? "default" : "action";

    const [playersList, setPlayersList] = useState<string[]>(["Asterix Obelix", "Sebastian Winek", "Mateusz Rusak"]);
    const [isLeaving, setIsLeaving] = useState<boolean>(false);

    const handleDelete = (index: number) => {
        setPlayersList(playersList.splice(index, 1))
    }

    const leaveLobby = () => setIsLeaving(true);
    const leaveLobbyCancel = () => setIsLeaving(false);

    const leaveLobbyConfirm = () => {
        dispatch(resetGame());
        navigate(constantsUrls.Main.startLessons);
    }  
    
    const startGame = () => dispatch(setGameStage("wait"));

    return (
        <PageContainer>
            <PrimaryContainer direction="column" additionalClassess={containersStyles.pagePadding2}>
                <PrimaryContainer direction="column">
                    <p className={commonStyles.basicHeader}>
                        { t("lesson.lobby.CodeHeader") }
                    </p>
                    <p className={styles.invitationCode}>
                        {invitationCode}
                    </p>
                </PrimaryContainer>
                <PrimaryContainer direction="column">
                    <p className={`${commonStyles.basicHeader} ${styles.playersCount}`}>{t("lesson.lobby.PlayerList")} {playersList.length}/99</p>
                    <div className={styles.lobbyItemsContainer}>
                        {
                            playersList.map((item, index) => (
                                <LobbyListItem key={index} index={index + 1} isDeleteEnabled={currentUser.role === "TEACHER"} handleDelete={() => handleDelete(index)} nickname={item}/>
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
                    <PrimaryButton color="orange" onClick={startGame} type={buttonsType} size={buttonsSize}>
                        {t("lesson.lobby.start.button")}
                    </PrimaryButton>
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