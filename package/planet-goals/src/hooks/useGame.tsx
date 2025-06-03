import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { joinGameStart } from "../redux/game/game.actions";

const useGame = (): boolean => {
    const invitationCode = sessionStorage.getItem("invitationCode");
    const dispatch = useDispatch();
    const usedGame = useMemo(() => {
        if (!invitationCode) return false;
        dispatch(joinGameStart({ invitationCode }))
        return true;
    }, [invitationCode, dispatch]);

    return usedGame;
}

export default useGame;