import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import GameContainer from "./game-container";
import ContentInstruction from "../../page-components/questions/content-instruction/content-instruction";
import { convertTimeUntilToRemainedSeconds } from "../../helpers/shared.functions";

import { QUESTION_TYPES_ENUM } from "../../types/lesson";
import { selectCurrentGame, selectCurrentLesson, selectCurrentQuestion, selectWaitingTimeUntil, selectPlayerRole, selectGameMode } from "../../redux/game/game.selectors";
import { constantsGame, constantsUrls } from "../../helpers/constants";
import { fetchLessonStart, resetGame, sendAnswerStart, setCurrentQuestion } from "../../redux/game/game.actions";
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
import Final from "../../page-components/questions/final/final";
import LeftRight from "../../page-components/questions/left-right/left-right";
import Leaderboard from "../../page-components/questions/leaderboard/leaderboard";
import { gameTypes } from "../../types";
import ContentIntroduction from "../../page-components/questions/content-introduction/content-introduction";

const calculateTimeUntil = (stateTimeUntil: number, questionTimeSek: number): number  => {
    if (!stateTimeUntil || Date.now() >= stateTimeUntil) {
        return Date.now() + ((questionTimeSek || 10) * 1000);
    }
    return stateTimeUntil;
}

const Game: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const questionLockRef = useRef(false);
    useGame();
    const currentGame = useSelector(selectCurrentGame);
    const currentLesson = useSelector(selectCurrentLesson);
    const currentQuestionIndex = useSelector(selectCurrentQuestion);
    const playerRole = useSelector(selectPlayerRole);
    const gameMode = useSelector(selectGameMode);
    const nextQuestionIndex = getNextSubquestionIndex(currentLesson?.questions, currentQuestionIndex);
    const timeUntil = useSelector(selectWaitingTimeUntil);
    const currentQuestion = currentLesson?.questions?.[currentQuestionIndex[0]];
    const currentSubquestion = currentQuestion?.subquestions?.[currentQuestionIndex[1]];
    let questionScreen: React.ReactNode;
    const [remainedTime, setRemainedTime] = useState(
        convertTimeUntilToRemainedSeconds(
            calculateTimeUntil(timeUntil, currentSubquestion?.timeInSek)
        )
    );
    const [questionIndexTemp, setQuestionIndexTemp] = useState(currentQuestionIndex.toString());
    
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

    useEffect(() => {
        if (remainedTime > 0) {
            const timeout = setTimeout(() => {
                setRemainedTime(remainedTime - 1);
            }, 1000);
            questionLockRef.current &&= false;
            return () => clearTimeout(timeout);
        }
    }, [remainedTime, currentSubquestion]);

    useEffect(() => {
        if (currentQuestionIndex.toString() !== questionIndexTemp ) {
            setQuestionIndexTemp(currentQuestionIndex.toString());
        }
    }, [currentQuestionIndex, questionIndexTemp, currentSubquestion])

    useEffect(() => {
        setRemainedTime(
            convertTimeUntilToRemainedSeconds(
                calculateTimeUntil(timeUntil, currentSubquestion?.timeInSek)
            )
        )
    }, [timeUntil, currentSubquestion]);

    const sendAnswerAction = (answer: string) => {
        dispatch(sendAnswerStart({
            gameId: currentGame._id,
            questionNumber: currentQuestionIndex[0],
            subquestionNumber: currentQuestionIndex[1],
            answer
        }));

        if (currentQuestion.gameStage === gameTypes.GAME_PLAY_STAGE_ENUM.COMPETITION) {
            if (currentQuestionIndex[1] < currentQuestion.subquestions.length - 1) {
                const remainedTime = Math.abs(timeUntil - Date.now());
                const timeout = remainedTime <= constantsGame.FEEDBACK_TIME ? remainedTime : constantsGame.FEEDBACK_TIME;
                setTimeout(() => 
                    dispatch(setCurrentQuestion([currentQuestionIndex[0], currentQuestionIndex[1] + 1])),
                    timeout
                );
                return;
            }
        }
    }

    const shouldAnswersBeVisible = () => {
        if (playerRole === 'spectator' && gameMode === 'multi') return true;
        return remainedTime === 0;
    }
    
    switch(currentQuestion?.type) {
        case QUESTION_TYPES_ENUM.CONTENT_INSTRUCTION:
            questionScreen = <ContentInstruction {...currentSubquestion}/>;
            break;
        case QUESTION_TYPES_ENUM.CONTENT_INTRODUCTION:
            questionScreen = <ContentIntroduction {...{ questionData: currentSubquestion, subquestionNumber: currentQuestionIndex[1] || 0 }} />
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
            questionScreen = <FillCorrectOrder {...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction }} />;
            break;
        case QUESTION_TYPES_ENUM.FIT_TILES:
            questionScreen = <FitTiles {...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction }} />;
            break;
        case QUESTION_TYPES_ENUM.FINAL:
            questionScreen = <Final />
            break;
        case QUESTION_TYPES_ENUM.LEADERBOARD:
            questionScreen = <Leaderboard />;
            break;
        case QUESTION_TYPES_ENUM.LEFT_RIGHT:
            questionScreen = <LeftRight { ...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction }} />;
            break;
        case QUESTION_TYPES_ENUM.MULTI_CHOOSE:
            questionScreen = <MultiChoose { ...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction }} />;
            break;
        case QUESTION_TYPES_ENUM.SELECT_CORRECT_ANSWER:
            questionScreen = <SelectCorrectAnswer { ...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction }} />;
            break;
        case QUESTION_TYPES_ENUM.SELECT_CORRECT_ORDER:
            questionScreen = <SelectCorrectOrder { ...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction }} />;
            break;
        case QUESTION_TYPES_ENUM.SINGLE_CHOOSE:
            questionScreen = <SingleChoose { ...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction }} />;
            break;
        case QUESTION_TYPES_ENUM.TRUE_FALSE:
            questionScreen = <TrueFalse { ...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction }} />;
            break;
        default: 
            questionScreen = <>default screen</>;
            break;
    }

    return <GameContainer 
        currentQuestionIndex={currentQuestionIndex} 
        isUserActionRequired={!!currentSubquestion?.answers?.length} 
        nextQuestionIndex={nextQuestionIndex} 
        timeInSek={remainedTime}
    >
        {questionScreen}
    </GameContainer>
}

export default Game;