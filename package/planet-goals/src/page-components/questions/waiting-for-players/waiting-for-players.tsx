import React from "react";
import { useTranslate } from "@tolgee/react";
import PrimaryContainer from "../../../components/primary-container/primary-container";
import Spinner from "../../../components/spinner/spinner.component";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";

const WaitingForPlayers: React.FC = () => {
    const { t } = useTranslate();

    return <PrimaryContainer additionalClassess={`${commonStyles.inheritBackground}`} direction="column">
        <PrimaryContainer direction="column" additionalClassess={`${commonStyles.inheritBackground}`}>
            <p className={`${styles.headerText} ${commonStyles.centeredText}`}>
                {t("game.waiting-for-players.header")}
            </p>
        </PrimaryContainer> 
        <PrimaryContainer direction="column" additionalClassess={`${commonStyles.inheritBackground}`}>
            <Spinner color="orange" />
        </PrimaryContainer>
    </PrimaryContainer>
}

export default WaitingForPlayers;