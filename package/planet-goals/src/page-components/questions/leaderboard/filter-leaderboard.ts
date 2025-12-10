import { ILeaderboardPlayer } from "../../../types/game";

export default function filterLeaderboard(leaderboard: ILeaderboardPlayer[]): ILeaderboardPlayer[] {
    return leaderboard?.filter(position => position.playerRole === "player")?.sort((a, b) => b.playerPoints - a.playerPoints)?.map((position, index) => ({
        ...position,
        playerPosition: index + 1
    })) ?? [];
} 