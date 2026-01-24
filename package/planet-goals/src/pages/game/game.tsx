import React, { lazy, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import GameContainer from "./game-container";
import { convertTimeUntilToRemainedSeconds } from "../../helpers/shared.functions";
import useRefreshPrevention from "../../hooks/useRefreshPrevention";

import { QUESTION_TYPES_ENUM } from "../../types/lesson";
import { selectCurrentGame, selectCurrentLesson, selectCurrentQuestion, selectWaitingTimeUntil, selectPlayerRole, selectGameMode, selectWaitingForPlayers, selectCurrentQuestionSetAt } from "../../redux/game/game.selectors";
import { constantsGame, constantsUrls } from "../../helpers/constants";
import { fetchLessonStart, resetGame, sendAnswerStart, setCurrentQuestion, setWaitingForPlayers } from "../../redux/game/game.actions";
import useGame from "../../hooks/useGame";
import { getNextSubquestionIndex } from "../../hooks/useLesson";
import { gameTypes } from "../../types";

const ContentInstruction = lazy(() => import("../../page-components/questions/content-instruction/content-instruction"));
const ContentIntroduction = lazy(() => import("../../page-components/questions/content-introduction/content-introduction"));
const ContentQuestion = lazy(() => import("../../page-components/questions/content-question/content-question"));
const ContentText = lazy(() => import("../../page-components/questions/content-text/content-text"));
const ContentTitle = lazy(() => import("../../page-components/questions/content-title/content-title"));
const FillCorrectOrder = lazy(() => import("../../page-components/questions/fill-in-correct-order/fill-in-correct-order"));
const Final = lazy(() => import("../../page-components/questions/final/final"));
const FitTiles = lazy(() => import("../../page-components/questions/fit-tiles/fit-tiles"));
const Leaderboard = lazy(() => import("../../page-components/questions/leaderboard/leaderboard"));
const LeftRight = lazy(() => import("../../page-components/questions/left-right/left-right"));
const MultiChoose = lazy(() => import("../../page-components/questions/multi-choose/multi-choose"));
const SelectCorrectAnswer = lazy(() => import("../../page-components/questions/select-correct-answer/select-correct-answer"));
const SelectCorrectOrder = lazy(() => import("../../page-components/questions/select-correct-order/select-correct-order"));
const SingleChoose = lazy(() => import("../../page-components/questions/single-choose/single-choose"));
const TrueFalse = lazy(() => import("../../page-components/questions/true-false/true-false"));
const WaitingForPlayers = lazy(() => import("../../page-components/questions/waiting-for-players/waiting-for-players"));

const calculateTimeUntil = (stateTimeUntil: number, questionTimeSek: number): number  => {
    if (!stateTimeUntil || Date.now() >= stateTimeUntil) {
        return Date.now() + ((questionTimeSek || 10) * 1000);
    }
    return stateTimeUntil;
}

const Game: React.FC = () => {
    let questionScreen: React.ReactNode;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const questionLockRef = useRef(false);
    useGame();
    const currentGame = useSelector(selectCurrentGame);
    const currentLesson = useSelector(selectCurrentLesson);
    const currentQuestionIndex = useSelector(selectCurrentQuestion);
    const currentQuestionSetAt = useSelector(selectCurrentQuestionSetAt);
    const gameMode = useSelector(selectGameMode);
    const isWaitingForPlayers = useSelector(selectWaitingForPlayers);
    const playerRole = useSelector(selectPlayerRole);
    const timeUntil = useSelector(selectWaitingTimeUntil);

    const currentQuestion = currentLesson?.questions?.[currentQuestionIndex[0]];
    const currentSubquestion = currentQuestion?.subquestions?.[currentQuestionIndex[1]];
    const nextQuestionIndex = getNextSubquestionIndex(currentLesson?.questions, currentQuestionIndex);
    const [remainedTime, setRemainedTime] = useState(
        convertTimeUntilToRemainedSeconds(
            calculateTimeUntil(timeUntil, currentSubquestion?.timeInSek)
        )
    );
    const [cmpAnswersVisible, setCmpAnswersVisible] = useState(false);
    const [questionIndexTemp, setQuestionIndexTemp] = useState(currentQuestionIndex.toString());
    const spectatorMode = playerRole === 'spectator';
    useRefreshPrevention();

    const shouldAnswersBeVisible = () => {
        if (playerRole === 'spectator' && gameMode === 'multi') return true;
        if (cmpAnswersVisible) return true;
        return remainedTime === 0;
    };
    
    useEffect(() => {
        if (!currentGame) {
            return;
        } else if (!currentGame?.lesson) {
            setTimeout(() => dispatch(resetGame()), 500);
            navigate(constantsUrls.Main.startLessons);
        }

        if (!currentLesson) {
            dispatch(fetchLessonStart(currentGame?.lesson));
        }
    }, [currentGame, currentLesson, dispatch, navigate ])

    useEffect(() => {
        setCmpAnswersVisible(false);
    }, [currentSubquestion]);

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

    useEffect(() => {
        if (gameMode === "single") setCmpAnswersVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSubquestion]);

    const sendAnswerAction = (answer: string) => {
        dispatch(sendAnswerStart({
            gameId: currentGame._id,
            questionNumber: currentQuestionIndex[0],
            subquestionNumber: currentQuestionIndex[1],
            responseTime: Date.now() - currentQuestionSetAt,
            answer
        }));

        if (gameMode === 'single' || gameTypes.COMPETITION_STAGES.includes(currentQuestion.gameStage)) {
            setCmpAnswersVisible(true);
            if (gameMode === 'multi') {
                if (currentQuestionIndex[1] < currentQuestion.subquestions.length - 1) {
                    const remainedTime = Math.abs(timeUntil - Date.now());
                    const timeout = remainedTime <= constantsGame.FEEDBACK_TIME ? remainedTime : constantsGame.FEEDBACK_TIME;
                    setTimeout(() => {
                        setCmpAnswersVisible(false);
                        dispatch(setCurrentQuestion([currentQuestionIndex[0], currentQuestionIndex[1] + 1]))
                    }, timeout);
                    return;
                } else {
                    if (Date.now() + constantsGame.FEEDBACK_TIME + constantsGame.FEEDBACK_FALLBACK < timeUntil) {
                        setTimeout(() => {
                            setCmpAnswersVisible(false);
                            dispatch(setWaitingForPlayers(true)) 
                        }, constantsGame.FEEDBACK_TIME);
                    }
                }
            }
        }
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
            questionScreen = <FillCorrectOrder {...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction, spectatorMode }} />;
            break;
        case QUESTION_TYPES_ENUM.FIT_TILES:
            questionScreen = <FitTiles {...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction, spectatorMode }} />;
            break;
        case QUESTION_TYPES_ENUM.FINAL:
            questionScreen = <Final />
            break;
        case QUESTION_TYPES_ENUM.LEADERBOARD:
            questionScreen = <Leaderboard />;
            break;
        case QUESTION_TYPES_ENUM.LEFT_RIGHT:
            questionScreen = <LeftRight { ...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction, spectatorMode }} />;
            break;
        case QUESTION_TYPES_ENUM.MULTI_CHOOSE:
            questionScreen = <MultiChoose { ...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction, spectatorMode }} />;
            break;
        case QUESTION_TYPES_ENUM.SELECT_CORRECT_ANSWER:
            questionScreen = <SelectCorrectAnswer { ...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction, spectatorMode }} />;
            break;
        case QUESTION_TYPES_ENUM.SELECT_CORRECT_ORDER:
            questionScreen = <SelectCorrectOrder { ...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction, spectatorMode }} />;
            break;
        case QUESTION_TYPES_ENUM.SINGLE_CHOOSE:
            questionScreen = <SingleChoose { ...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction, spectatorMode }} />;
            break;
        case QUESTION_TYPES_ENUM.TRUE_FALSE:
            questionScreen = <TrueFalse { ...{questionData: currentSubquestion, showAnswers: shouldAnswersBeVisible(), sendAnswerAction, spectatorMode }} />;
            break;
        default: 
            questionScreen = <></>;
            break;
    }

    if (isWaitingForPlayers) questionScreen = <WaitingForPlayers />;

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