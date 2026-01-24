import React, { useEffect, lazy } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { selectGameStage } from "../../redux/game/game.selectors";
import { constantsUrls } from "../../helpers/constants";

const ChoosePlayerRole = lazy(() => import("./choose-player-role/choose-player-role"));
const Join = lazy(() => import("./join/join"));
const LobbyScreen = lazy(() => import("./lobby/lobby"));
const SelectLesson = lazy(() => import("./select-lesson/select-lesson"));
const Wait = lazy(() => import("./wait/wait"));

const Lobby: React.FC = () => {
    const navigate = useNavigate();
    const gameStage = useSelector(selectGameStage);

    useEffect(() => {
        if (!gameStage) navigate(constantsUrls.Main.startLessons);
    }, [navigate, gameStage]);

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