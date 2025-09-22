import React from "react";
import { useSelector } from "react-redux";
import { useTranslate } from "@tolgee/react";
import LobbyListItem from "../../../pages/lobby/lobby/lobby-list-item";
import Separator from "../../../components/separator/separator";
import { useDeviceType } from "../../../helpers/responsiveContainers";

import styles from "../questions.module.scss";
import lobbyStyles from "../../../pages/lobby/lobby/lobby.module.scss";
//import gameButtonStyles from "../../../components/game-button/game-button.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import { selectCurrentLeaderboard } from "../../../redux/game/game.selectors";
import { selectCurrentUser } from "../../../redux/user/user.selectors";
import PrimaryContainer from "../../../components/primary-container/primary-container";

const Leaderboard: React.FC = () => {
    const currentLeaderboard = useSelector(selectCurrentLeaderboard);
    const currentUser = useSelector(selectCurrentUser);
    const playerLeaderboard = currentLeaderboard?.find((position) => position.playerId === currentUser._id);
    const { isMobile } = useDeviceType();
    const { t } = useTranslate();
    return <div className={styles.leaderboardContainer}>
        <PrimaryContainer additionalClassess={`${commonStyles.inheritBackground}`} direction="column">
            {
                playerLeaderboard && 
                <div className={lobbyStyles.lobbyItemsContainer}>
                    <LobbyListItem  
                        index={playerLeaderboard.playerPosition} 
                        isDeleteEnabled={false}
                        nickname={t("game.leaderboard.you")}
                        score={Number(playerLeaderboard.playerPoints.toFixed(2))}
                        additionalClasses={styles.leaderboardFirstPosition}
                    />
                </div>
            }
            <Separator noPadding={true} width={isMobile ? 250 : 350}/>
            {
                currentLeaderboard?.length && 
                <div className={lobbyStyles.lobbyItemsContainer}>
                    {
                        currentLeaderboard?.map(({ playerName, playerLastName, playerPoints, playerPosition }) => (
                            <LobbyListItem
                                index={playerPosition}
                                nickname={`${playerName} ${playerLastName}`}
                                score={Number(playerPoints.toFixed(2))}
                                isDeleteEnabled={false}
                                key={playerPosition}
                                />
                            ))
                        }
                </div>
            }
        </PrimaryContainer>
    </div>
}

export default Leaderboard;