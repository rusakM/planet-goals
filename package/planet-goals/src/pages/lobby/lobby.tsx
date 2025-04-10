import React from "react";
import { useSelector, /* useDispatch */} from "react-redux";
//import { useNavigate } from "react-router-dom";

import Join from "./join/join";

import { selectGameStage } from "../../redux/game/game.selectors";

const Lobby: React.FC = () => {
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    const gameStage = useSelector(selectGameStage);

    switch(gameStage) {
        case "join":
            return <Join />;
        default: 
            return <>default screen</>
    }
}

export default Lobby;