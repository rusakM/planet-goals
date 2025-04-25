import React from "react";
import { useSelector, /* useDispatch */} from "react-redux";
//import { useNavigate } from "react-router-dom";

import Join from "./join/join";
import ChoosePlayerRole from "./choose-player-role/choose-player-role";
import LobbyScreen from "./lobby/lobby";
import SelectLesson from "./select-lesson/select-lesson";
import Wait from "./wait/wait";

import { selectGameStage } from "../../redux/game/game.selectors";

const Lobby: React.FC = () => {
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    const gameStage = useSelector(selectGameStage);

    switch(gameStage) {
        case "join":
            return <Join />;
        case "lobby":
            return <LobbyScreen />;
        case "selectGameMode":
            return <ChoosePlayerRole />;
        case "selectLesson":
            return <SelectLesson />;
        case "wait":
            return <Wait />;
        default: 
            return <>default screen</>;
    }
}

export default Lobby;