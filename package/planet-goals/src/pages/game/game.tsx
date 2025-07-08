import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import GameContainer from "./game-container";
import ContentInstruction from "../../page-components/questions/content-instruction/content-instruction";

import { QUESTION_TYPES_ENUM } from "../../types/lesson";
import { selectCurrentGame, selectCurrentLesson, selectCurrentQuestion } from "../../redux/game/game.selectors";
import { constantsUrls } from "../../helpers/constants";
import { fetchLessonStart, resetGame } from "../../redux/game/game.actions";
import useGame from "../../hooks/useGame";
import { getNextSubquestionIndex } from "../../hooks/useLesson";
import ContentTitle from "../../page-components/questions/content-title/content-title";
import ContentText from "../../page-components/questions/content-text/content-text";
import SingleChoose from "../../page-components/questions/single-choose/single-choose";
import MultiChoose from "../../page-components/questions/multi-choose/multi-choose";
import TrueFalse from "../../page-components/questions/true-false/true-false";
import SelectCorrectAnswer from "../../page-components/questions/select-correct-answer/select-correct-answer";
import SelectCorrectOrder from "../../page-components/questions/select-correct-order/select-correct-order";
import ContentQuestion from "../../page-components/questions/content-question/content-question";
import FillCorrectOrder from "../../page-components/questions/fill-in-correct-order/fill-in-correct-order";
import FitTiles from "../../page-components/questions/fit-tiles/fit-tiles";
import LeftRight from "../../page-components/questions/left-right/left-right";
import { ISubquestionComponent } from "../../page-components/questions/questions.types";

const Game: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useGame();
    const currentGame = useSelector(selectCurrentGame);
    const currentLesson = useSelector(selectCurrentLesson);
    const currentQuestionIndex = useSelector(selectCurrentQuestion);
    const nextQuestionIndex = getNextSubquestionIndex(currentLesson?.questions, currentQuestionIndex);

    const currentQuestion = currentLesson?.questions?.[currentQuestionIndex[0]];
    const currentSubquestion = currentQuestion?.subquestions?.[currentQuestionIndex[1]];
    const currentSubquestionProps: ISubquestionComponent = { questionData: currentSubquestion, showAnswers: false };
    let questionScreen: React.ReactNode;

    useEffect(() => {
        if (!currentGame) {
            return;
        } else if (!currentGame?.lesson) {
            dispatch(resetGame());
            navigate(constantsUrls.Main.startLessons);
        }

        if (!currentLesson) {
            dispatch(fetchLessonStart(currentGame?.lesson));
        }
    }, [currentGame, currentLesson, dispatch, navigate ])

    switch(currentQuestion?.type) {
        case QUESTION_TYPES_ENUM.CONTENT_INSTRUCTION:
            questionScreen = <ContentInstruction {...currentSubquestion}/>;
            break;
        case QUESTION_TYPES_ENUM.CONTENT_QUESTION:
            questionScreen = <ContentQuestion { ...currentSubquestion } />;
            break;
        case QUESTION_TYPES_ENUM.CONTENT_TEXT:
            questionScreen = <ContentText { ...currentSubquestion } />;
            break;
        case QUESTION_TYPES_ENUM.CONTENT_TITLE:
            questionScreen = <ContentTitle { ...currentSubquestion } />;
            break;
        case QUESTION_TYPES_ENUM.FILL_IN_CORRECT_ORDER:
            questionScreen = <FillCorrectOrder {...currentSubquestion} />;
            break;
        case QUESTION_TYPES_ENUM.FIT_TILES:
            questionScreen = <FitTiles {...currentSubquestionProps } />;
            break;
        case QUESTION_TYPES_ENUM.LEFT_RIGHT:
            questionScreen = <LeftRight { ...currentSubquestionProps } />;
            break;
        case QUESTION_TYPES_ENUM.MULTI_CHOOSE:
            questionScreen = <MultiChoose { ...currentSubquestionProps} />;
            break;
        case QUESTION_TYPES_ENUM.SELECT_CORRECT_ANSWER:
            questionScreen = <SelectCorrectAnswer { ...currentSubquestionProps } />;
            break;
        case QUESTION_TYPES_ENUM.SELECT_CORRECT_ORDER:
            questionScreen = <SelectCorrectOrder { ...currentSubquestionProps } />;
            break;
        case QUESTION_TYPES_ENUM.SINGLE_CHOOSE:
            questionScreen = <SingleChoose { ...currentSubquestionProps } />;
            break;
        case QUESTION_TYPES_ENUM.TRUE_FALSE:
            questionScreen = <TrueFalse { ...currentSubquestionProps } />;
            break;
        default: 
            questionScreen = <>default screen</>;
            break;
    }

    return <GameContainer 
        currentQuestionIndex={currentQuestionIndex} 
        isUserActionRequired={!!currentSubquestion?.answers?.length} 
        nextQuestionIndex={nextQuestionIndex} 
        timeInSek={currentSubquestion?.timeInSek}
    >
        {questionScreen}
    </GameContainer>
}

export default Game;