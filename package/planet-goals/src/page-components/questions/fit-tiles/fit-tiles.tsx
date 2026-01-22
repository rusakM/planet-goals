import React, { useEffect, useState } from "react";
import { ISubquestionComponent } from "../questions.types";
import { getFeedback } from "../../../helpers/game";

import styles from "../questions.module.scss";

import GameButton, { TButtonColor, TFeedbackMode } from "../../../components/game-button/game-button";
import { constantsGame } from "../../../helpers/constants";
import { useTranslatedAnswers } from "../../../hooks/useTranslatedAnswers";

const colorsMap: { [key: number]: TButtonColor } = {
    "-1": "red",
    0: "white",
    1: "green",
    2: "blue"
};

const colors: TButtonColor[] = ["green", "blue", "orange"];

const FitTiles: React.FC<ISubquestionComponent> = ({questionData, sendAnswerAction, showAnswers, spectatorMode}) => {
    const answersTranslated = useTranslatedAnswers(questionData?.answers);
    // correct answers JSON.parse("[[1,3], [0,2], [4,5]]")
    const [answers, setAnswers] = useState(new Array(Math.floor(questionData.answers.length / 2)).fill(new Array(2).fill(0)));
    const [results, setResults] = useState(new Array(questionData.answers.length).fill(0));
    const [currentAnswer, setCurrentAnswer] = useState(0);
    const [currentPair, setCurrentPair] = useState(0);
    const [lastClickedIndex, setLastClickedIndex] = useState(-1);
    const correctAnswers: Array<Array<number>> = JSON.parse(questionData.correctAnswer);
    const [showFeedbackCorrect, setShowFeedbackCorrect] = useState(false);
    const [smallFontInButtons, setSmallFontInButtons] = useState(false);

    useEffect(() => {
        if (!questionData) return;
        setAnswers(new Array(Math.floor(questionData.answers.length / 2)).fill(new Array(2).fill(0)));
        setResults(new Array(questionData.answers.length).fill(0));
        setCurrentAnswer(0);
        setCurrentPair(0);
        setLastClickedIndex(-1);
        setShowFeedbackCorrect(false);
        setSmallFontInButtons(false);
    }, [questionData]);

    useEffect(() => {
        if (!showAnswers) {
            setShowFeedbackCorrect(false); 
            return;
        }
        if (showFeedbackCorrect && !spectatorMode) return;
        const timer = setTimeout(() => {
            setShowFeedbackCorrect(true);
        }, constantsGame.FEEDBACK_INCORRECT_TIME);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAnswers, questionData]);

    const checkPair = (pair: Array<number>) => {
        return correctAnswers.some(correctPair => correctPair.includes(pair[0]) && correctPair.includes(pair[1]));
    }

    const check = (index: number) => results[index] > 0;

    const markTile = (index: number) => {
        if (spectatorMode || (currentPair >= answers.length || currentAnswer >= questionData.answers.length)) return;
        if (results[index] !== 0) return;
        const tempAnswers = JSON.parse(JSON.stringify(answers));
        const tempResults = structuredClone(results);
        const mod = currentAnswer % 2;
        let tempCurrentPair = currentPair;
        
        tempAnswers[currentPair][mod] = index;
        if (!mod) {
            tempResults[index] = 2;
        } else {
            tempResults[index] = tempResults[lastClickedIndex] = checkPair(tempAnswers[currentPair]) ? 1 : -1;
            tempCurrentPair++;
            setCurrentPair(tempCurrentPair);
        }
        
        setAnswers(tempAnswers);
        setResults(tempResults);
        setCurrentAnswer(currentAnswer + 1);
        setLastClickedIndex(index);

        if (tempCurrentPair >= answers.length) sendAnswerAction(JSON.stringify(tempAnswers));
    }

    const findPairNumber = (index: number) => {
        return correctAnswers.findIndex((pair) => pair.includes(index));
    }

    const getCurrentColor = (index: number) => {
        if (spectatorMode) return colors[findPairNumber(index)];
        if (!showAnswers) return colorsMap[results[index]];
        return colors[correctAnswers.findIndex((pair) => pair.includes(index))];
    }

    const calculateFeedback = (showCorrectAnswers: boolean, showIncorrectAnswers: boolean, index: number): TFeedbackMode => {
        if (spectatorMode) return "none";
        if (results[index] === 1) return "correct";
        else if (results[index] === -1) return "incorrect"
        return getFeedback(showCorrectAnswers, showIncorrectAnswers, index, check);
    }


    return <div className={styles.questionContainer}>
        <div className={`${styles.buttonsContainer}`}>
            {
                answersTranslated?.map((ans, index) => 
                    <div className={styles.buttonContainer} key={index}>
                        <GameButton 
                            color={getCurrentColor(index)} 
                            size="thin" 
                            onClick={() => markTile(index)} 
                            feedback={calculateFeedback(showFeedbackCorrect, showAnswers, index)}
                            font={{
                                isSmallFont: smallFontInButtons,
                                setIsSmallFont: setSmallFontInButtons
                            }}
                        > 
                            {`${ans}`}
                        </GameButton>
                    </div>
                )
            }
        </div>
    </div>
}

export default FitTiles;