import React from "react";
import { useSelector } from "react-redux";

import FinalSingle from "./final-single";
import FinalMulti from "./final-multi";
import { selectCurrentLeaderboard, selectGameMode } from "../../../redux/game/game.selectors";

const Final: React.FC = () => {
    const gameMode = useSelector(selectGameMode);
    const currentLeaderboard = useSelector(selectCurrentLeaderboard);

    if (gameMode === "multi" || currentLeaderboard?.length > 1) return <FinalMulti />
    return <FinalSingle />
}

export default Final;