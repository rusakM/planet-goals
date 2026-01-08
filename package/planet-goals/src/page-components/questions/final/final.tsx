import React from "react";
import { useSelector } from "react-redux";

import FinalSingle from "./final-single";
import FinalMulti from "./final-multi";
import { selectCurrentLeaderboard, selectGameMode, selectPlayerRole } from "../../../redux/game/game.selectors";
import filterLeaderboard from "../leaderboard/filter-leaderboard";

const Final: React.FC = () => {
    const gameMode = useSelector(selectGameMode);
    const currentLeaderboard = useSelector(selectCurrentLeaderboard);
    const playerRole = useSelector(selectPlayerRole);
    const filteredLeaderboard = filterLeaderboard(currentLeaderboard);

    if (gameMode === "multi" || filteredLeaderboard?.length > 1 || (!filteredLeaderboard?.length && playerRole === 'spectator')) return <FinalMulti />
    return <FinalSingle />
}

export default Final;