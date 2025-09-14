import React from "react";

import styles from "./lobby.module.scss";
import buttonStyles from "../../../components/primary-button.tsx/primary-button.module.scss";

import trashIcon from "../../../assets/icons/trash_icon.svg";

interface ILobbyListItem {
    additionalClasses?: string;
    handleDelete?: () => void,
    index: number,
    isDeleteEnabled: boolean,
    nickname: string,
    score?: number,
}

const LobbyListItem: React.FC<ILobbyListItem> = ({ additionalClasses, handleDelete, index, isDeleteEnabled, nickname, score }) => (
    <div className={`${buttonStyles.button} ${styles.lobbyListItem}${additionalClasses ? ` ${additionalClasses}` : ""}`}>
        <p className={styles.listItemIndex}>{index}</p>
        <div className={styles.nicknameContainer}>
            <p className={styles.nickname}>{nickname}</p>
        </div>
        {
            isDeleteEnabled && 
            <img src={trashIcon} onClick={handleDelete} className={styles.trashIcon}/>
        }
        {
            (score || score === 0) && <p className={styles.nickname}>{score}</p>
        }
    </div>
);

export default LobbyListItem;