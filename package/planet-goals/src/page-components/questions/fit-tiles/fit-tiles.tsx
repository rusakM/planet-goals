import React, { useEffect, useState } from "react";
import { ISubquestionComponent } from "../questions.types";
import { getFeedback2 } from "../../../helpers/game";

import styles from "../questions.module.scss";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";
import { constantsGame } from "../../../helpers/constants";

const colorsMap: { [key: number]: TButtonColor } = {
    "-1": "red",
    0: "white",
    1: "green",
    2: "blue"
};

const colors: TButtonColor[] = ["green", "blue", "orange"];

const FitTiles: React.FC<ISubquestionComponent> = ({questionData, sendAnswerAction, showAnswers, spectatorMode}) => {
    // correct answers JSON.parse("[[1,3], [0,2], [4,5]]")
    const [answers, setAnswers] = useState(new Array(Math.floor(questionData.answers.length / 2)).fill(new Array(2).fill(0)));
    const [results, setResults] = useState(new Array(questionData.answers.length).fill(0));
    const [currentAnswer, setCurrentAnswer] = useState(0);
    const [currentPair, setCurrentPair] = useState(0);
    const [lastClickedIndex, setLastClickedIndex] = useState(-1);
    const correctAnswers: Array<Array<number>> = JSON.parse(questionData.correctAnswer);
    const [showFeedbackCorrect, setShowFeedbackCorrect] = useState(false);

    useEffect(() => {
        if (!questionData) return;
        setAnswers(new Array(Math.floor(questionData.answers.length / 2)).fill(new Array(2).fill(0)));
        setResults(new Array(questionData.answers.length).fill(0));
        setCurrentAnswer(0);
        setCurrentPair(0);
        setLastClickedIndex(-1);
        setShowFeedbackCorrect(false);
    }, [questionData]);

    useEffect(() => {
        if (!showAnswers) {
            setShowFeedbackCorrect(false); 
            return;
        }
        if (showFeedbackCorrect) return;
        const timer = setTimeout(() => {
            setShowFeedbackCorrect(true);
        }, constantsGame.FEEDBACK_INCORRECT_TIME);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAnswers]);

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

    const getCurrentColor = (index: number) => {
        if (!showAnswers) return colorsMap[results[index]];
        return colors[correctAnswers.findIndex((pair) => pair.includes(index))];
    }

    return <div>
        <div className={`${styles.buttonsContainer}`}>
            {
                questionData.answers?.map((ans, index) => 
                    <div className={styles.buttonContainer} key={index}>
                        <GameButton color={getCurrentColor(index)} size="thin" onClick={() => markTile(index)} feedback={getFeedback2(showFeedbackCorrect, showAnswers, index, check)}> 
                            {`${ans}`}
                        </GameButton>
                    </div>
                )
            }
        </div>
    </div>
}

export default FitTiles;