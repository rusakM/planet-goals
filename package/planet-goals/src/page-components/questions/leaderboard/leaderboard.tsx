import React from "react";
import { useSelector } from "react-redux";
import LobbyListItem from "../../../pages/lobby/lobby/lobby-list-item";
import Separator from "../../../components/separator/separator";

import styles from "../questions.module.scss";
import gameButtonStyles from "../../../components/game-button/game-button.module.scss";
//import commonStyles from "../../../styles/common.module.scss";

import { selectCurrentLeaderboard } from "../../../redux/game/game.selectors";
import { selectCurrentUser } from "../../../redux/user/user.selectors";

const Leaderboard: React.FC = () => {
    const currentLeaderboard = useSelector(selectCurrentLeaderboard);
    const currentUser = useSelector(selectCurrentUser);
    const playerLeaderboard = currentLeaderboard?.find((position) => position.playerId === currentUser._id);

    return <div className={styles.leaderboardContainer}>
        {
            playerLeaderboard && 
            <LobbyListItem  
                index={playerLeaderboard.playerPosition} 
                isDeleteEnabled={false}
                nickname={`${playerLeaderboard.playerName} ${playerLeaderboard.playerLastName}`}
                score={playerLeaderboard.playerPoints}
                additionalClasses={gameButtonStyles.orange}
            />
        }
        <Separator />
        {
            currentLeaderboard?.length && 
            <div className={styles.leaderboardList}>
                {
                    currentLeaderboard?.map(({ playerName, playerLastName, playerPoints, playerPosition }) => (
                        <LobbyListItem
                            index={playerPosition}
                            nickname={`${playerName} ${playerLastName}`}
                            score={playerPoints}
                            isDeleteEnabled={false}
                            key={playerPosition}
                        />
                    ))
                }
            </div>
        }
    </div>
}

export default Leaderboard;