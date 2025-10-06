import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslate } from "@tolgee/react";
import LobbyListItem from "../../../pages/lobby/lobby/lobby-list-item";
import Separator from "../../../components/separator/separator";
import PrimaryButton from "../../../components/primary-button.tsx/primary-button";
import { useDeviceType } from "../../../helpers/responsiveContainers";

import styles from "../questions.module.scss";
import lobbyStyles from "../../../pages/lobby/lobby/lobby.module.scss";
import finalStyles from "./final.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import { selectCurrentLeaderboard } from "../../../redux/game/game.selectors";
import { selectCurrentUser } from "../../../redux/user/user.selectors";
import PrimaryContainer from "../../../components/primary-container/primary-container";
import FinalPodiumPosition from "./final-podium-position";



const get3Randoms = () => {
    const indices: number[] = [];
    const usedIndices = new Set<number>();
    
    while (indices.length < 3) {
        const randomIndex = Math.floor(Math.random() * 7);
        
        if (!usedIndices.has(randomIndex)) {
            indices.push(randomIndex);
            usedIndices.add(randomIndex);
        }
    }
    
    return indices;
}

const FinalMulti: React.FC = () => {
    const currentLeaderboard = useSelector(selectCurrentLeaderboard);
    const currentUser = useSelector(selectCurrentUser);
    const playerLeaderboard = currentLeaderboard?.find((position) => position.playerId === currentUser._id);
    const [avatarsIndices] = useState(get3Randoms());
    const { isMobile } = useDeviceType();
    const { t } = useTranslate();
    return <div className={`${finalStyles.finalContainer} ${styles.leaderboardContainer}`}>
        <PrimaryContainer direction="row" additionalClassess={`${finalStyles.podium} ${commonStyles.inheritBackground}`}>
            {
                currentLeaderboard?.sort((a, b) => a.playerPosition - b.playerPosition)?.map((elem, index) => {
                    if (index > 2) return null;
                    return <FinalPodiumPosition 
                        nickname={`${elem?.playerName} ${elem?.playerLastName}`}
                        points={Number(elem?.playerPoints?.toFixed(2))}
                        position={index + 1}
                        avatar={avatarsIndices?.[index] || avatarsIndices[0]}
                    />
                }).filter(elem => elem != null)
            }
        </PrimaryContainer>
        <PrimaryContainer additionalClassess={`${commonStyles.inheritBackground}`} direction="column">
            <p className={`${commonStyles.basicHeader5} ${finalStyles.listHeader}`}>{t("lesson.lobby.PlayerList")} {currentLeaderboard?.length || 0}/99</p>
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
                <Separator noPadding={true} noMargin={true} width={isMobile ? 250 : 350}/>
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
            <PrimaryContainer additionalClassess={`${finalStyles.exitButtonContainer} ${commonStyles.inheritBackground} ${commonStyles.bottom}`}>
                <PrimaryButton color="white" >
                    {t("game.leave.exit.button")}
                </PrimaryButton>
            </PrimaryContainer>
        </PrimaryContainer>
    </div>
}

export default FinalMulti;