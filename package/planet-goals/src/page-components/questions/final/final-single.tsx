import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router-dom";

import PrimaryButton from "../../../components/primary-button.tsx/primary-button";

import finalStyles from "./final.module.scss";
import commonStyles from "../../../styles/common.module.scss";

import { selectCurrentLeaderboard } from "../../../redux/game/game.selectors";
import { selectCurrentUser } from "../../../redux/user/user.selectors";
import PrimaryContainer from "../../../components/primary-container/primary-container";
import avatarsList from "./final-avatars-list";
import { resetGame } from "../../../redux/game/game.actions";
import { constantsUrls } from "../../../helpers/constants";

const FinalSingle: React.FC = () => {
    const currentLeaderboard = useSelector(selectCurrentLeaderboard);
    const currentUser = useSelector(selectCurrentUser);
    const playerLeaderboard = currentLeaderboard?.find((position) => position.playerId === currentUser._id);
    const [avatarIndex] = useState(Math.floor(Math.random() * avatarsList.length));
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const exit = () => {
        dispatch(resetGame());
        navigate(constantsUrls.Main.startLessons);
    }

    return <PrimaryContainer additionalClassess={`${commonStyles.inheritBackground} ${finalStyles.finalSingleContainer}`} direction="column">
        <PrimaryContainer direction="column" additionalClassess={`${commonStyles.inheritBackground}`}>
            <div className={`${finalStyles.circle} ${finalStyles.circleSingle}`}>
                <img src={avatarsList[avatarIndex]}/>
            </div>
            <p className={`${commonStyles.basicHeader}`}>{`${currentUser?.firstName} ${currentUser?.lastName}`}</p>
            <p className={`${commonStyles.basicHeader6} ${commonStyles.orangeText}`}>{playerLeaderboard?.playerPoints || 0}</p>
        </PrimaryContainer> 
        <PrimaryContainer direction="column" additionalClassess={`${finalStyles.exitButtonContainer} ${commonStyles.bottom} ${commonStyles.inheritBackground}`}>
            <PrimaryButton color="white" onClick={exit}>
                {t("game.leave.exit.button")}
            </PrimaryButton>
        </PrimaryContainer>
    </PrimaryContainer>
}

export default FinalSingle;