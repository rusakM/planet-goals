import React, { useEffect, useState } from "react";
import { ISubquestionComponent } from "../questions.types";
import { getFeedback } from "../../../helpers/game";

import styles from "../questions.module.scss";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";

const colorsMap: { [key: number]: TButtonColor } = {
    "-1": "red",
    0: "white",
    1: "green",
    2: "blue"
};

const colors: TButtonColor[] = ["green", "blue", "orange"];

const FitTiles: React.FC<ISubquestionComponent> = ({questionData, showAnswers}) => {
    // correct answers JSON.parse("[[1,3], [0,2], [4,5]]")
    const [answers, setAnswers] = useState(new Array(Math.floor(questionData.answers.length / 2)).fill(new Array(2).fill(0)));
    const [results, setResults] = useState(new Array(questionData.answers.length).fill(0));
    const [currentAnswer, setCurrentAnswer] = useState(0);
    const [currentPair, setCurrentPair] = useState(0);
    const [lastClickedIndex, setLastClickedIndex] = useState(-1);
    const correctAnswers: Array<Array<number>> = JSON.parse(questionData.correctAnswer);

    useEffect(() => {
        if (!questionData) return;
        setAnswers(new Array(Math.floor(questionData.answers.length / 2)).fill(new Array(2).fill(0)));
        setResults(new Array(questionData.answers.length).fill(0));
        setCurrentAnswer(0);
        setCurrentPair(0);
        setLastClickedIndex(-1);
    }, [questionData]);

    const checkPair = (pair: Array<number>) => {
        return correctAnswers.some(correctPair => correctPair.includes(pair[0]) && correctPair.includes(pair[1]));
    }

    const check = (index: number) => results[index] > 0;

    const markTile = (index: number) => {
        if (currentPair >= answers.length || currentAnswer >= questionData.answers.length) return;
        if (results[index] !== 0) return;
        const tempAnswers = [...answers];
        const tempResults = [...results];
        const mod = currentAnswer % 2;
        
        tempAnswers[currentPair][mod] = index;
        if (!mod) {
            tempResults[index] = 2;
        } else {
            tempResults[index] = tempResults[lastClickedIndex] = checkPair(tempAnswers[currentPair]) ? 1 : -1;
            setCurrentPair(currentPair + 1);
        }
        
        setAnswers(tempAnswers);
        setResults(tempResults);
        setCurrentAnswer(currentAnswer + 1);
        setLastClickedIndex(index);
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
                        <GameButton color={getCurrentColor(index)} size="thin" onClick={() => markTile(index)} feedback={getFeedback(showAnswers, results[index] !== 0, index, check)}> 
                            {`${ans}`}
                        </GameButton>
                    </div>
                )
            }
        </div>
    </div>
}

export default FitTiles;