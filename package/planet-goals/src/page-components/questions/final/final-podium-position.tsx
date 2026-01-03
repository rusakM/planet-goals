import React from "react";
import PrimaryContainer from "../../../components/primary-container/primary-container";

import styles from "./final.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import avatarsList from "./final-avatars-list";

interface IFinalPodiumPosition {
    avatar: number;
    nickname: string;
    points: number;
    position: 1 | 2 | 3 | number;
}

const getPositionName = (position: IFinalPodiumPosition['position']): string => {
    switch (position) {
        case 3: return "3rd";
        case 2: return "2nd";
        case 1:
        default: return "1st";
    }
}

const FinalPodiumPosition: React.FC<IFinalPodiumPosition> = ({ avatar, nickname, points, position }) => (
    <PrimaryContainer direction="column" additionalClassess={`${styles.podiumPosition} ${commonStyles.inheritBackground}`}>
        <PrimaryContainer direction="column" additionalClassess={`${commonStyles.inheritBackground}`}>
            <div className={`${styles.circle} ${styles.circleMulti}`}>
                <img src={avatarsList[avatar]}/>
            </div>
            <p className={`${styles.nicknamePodiumHeader} ${commonStyles.basicHeader4}`}>
                {nickname || ""}
            </p>
        </PrimaryContainer>
        <div className={`${styles.cube} ${styles['cube' + position]}`}>
            <div className={`${styles.rank} ${commonStyles.captionText}`}>
                { getPositionName(position) }
            </div>
            <div className={`${styles.score} ${commonStyles.captionText}`}>
                { points || 0 }
            </div>
        </div>
    </PrimaryContainer>
);

export default FinalPodiumPosition;