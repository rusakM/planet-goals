import React from "react";

import styles from "./lobby.module.scss";
import buttonStyles from "../../../components/primary-button.tsx/primary-button.module.scss";

import trashIcon from "../../../assets/icons/trash_icon.svg";

interface ILobbyListItem {
    handleDelete?: () => void,
    index: number,
    isDeleteEnabled: boolean,
    nickname: string,
}

const LobbyListItem: React.FC<ILobbyListItem> = ({ handleDelete, index, isDeleteEnabled, nickname }) => (
    <div className={`${buttonStyles.button} ${styles.lobbyListItem}`}>
        <p className={styles.listItemIndex}>{index}</p>
        <div className={styles.nicknameContainer}>
            <p className={styles.nickname}>{nickname}</p>
        </div>
        {
            isDeleteEnabled && 
            <img src={trashIcon} onClick={handleDelete} className={styles.trashIcon}/>
        }
    </div>
);

export default LobbyListItem;