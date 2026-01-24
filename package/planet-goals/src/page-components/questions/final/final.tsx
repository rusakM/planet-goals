import React, { lazy } from "react";
import { useSelector } from "react-redux";

import { selectCurrentLeaderboard, selectGameMode, selectPlayerRole } from "../../../redux/game/game.selectors";
import filterLeaderboard from "../leaderboard/filter-leaderboard";

const FinalMulti = lazy(() => import("./final-multi"));
const FinalSingle = lazy(() => import("./final-single"));

const Final: React.FC = () => {
    const gameMode = useSelector(selectGameMode);
    const currentLeaderboard = useSelector(selectCurrentLeaderboard);
    const playerRole = useSelector(selectPlayerRole);
    const filteredLeaderboard = filterLeaderboard(currentLeaderboard);

    if (gameMode === "multi" || filteredLeaderboard?.length > 1 || (!filteredLeaderboard?.length && playerRole === 'spectator')) return <FinalMulti />
    return <FinalSingle />
}

export default Final;