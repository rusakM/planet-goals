import React from "react";
import { useSelector, /* useDispatch */} from "react-redux";
//import { useNavigate } from "react-router-dom";

import Join from "./join/join";
import ChoosePlayerRole from "./choose-player-role/choose-player-role";

import { selectGameStage } from "../../redux/game/game.selectors";

const Lobby: React.FC = () => {
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    const gameStage = useSelector(selectGameStage);

    switch(gameStage) {
        case "join":
            return <Join />;
        case "selectGameMode":
            return <ChoosePlayerRole />
        default: 
            return <>default screen</>
    }
}

export default Lobby;