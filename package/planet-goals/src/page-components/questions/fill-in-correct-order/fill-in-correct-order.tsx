import React, { useEffect, useState } from "react";
import { useTranslate } from "@tolgee/react";

import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import { getFeedback } from "../../../helpers/game";
import { useTranslatedAnswers } from "../../../hooks/useTranslatedAnswers";

import GameButton, { TFeedbackMode } from "../../../components/game-button/game-button";
import { ISubquestionComponent } from "../questions.types";
import { constantsGame } from "../../../helpers/constants";

const mapAnswersToDescription = (description: string, answers: string[], answersCorrect: string) => {
    let final = description;
    for (const answer of answersCorrect.split('')) final = final.replace('...', answers[Number(answer)]);
    return final;
};

const setInitialDescription = (descriptionTranslated: string, translatedAnswers: string[], answersCorrect: string, spectatorMode: boolean) => (
    spectatorMode 
        ? mapAnswersToDescription(descriptionTranslated, translatedAnswers, answersCorrect) 
        : descriptionTranslated
);

const FillCorrectOrder: React.FC<ISubquestionComponent> = ({questionData, showAnswers, sendAnswerAction, spectatorMode}) => {
    const { t } = useTranslate();
    const translatedAnswers = useTranslatedAnswers(questionData.answers);
    const questionTranslated = t(questionData?.question);
    const [answers, setAnswers] = useState(new Array(questionData.answers.length).fill(0));
    const [currentAnswer, setCurrentAnswer] = useState(0);
    const [description, setDescription] = useState(setInitialDescription(questionTranslated, translatedAnswers, questionData?.correctAnswer, spectatorMode));
    const [finalAnswer, setFinalAnswer] = useState("");
    const [showFeedbackCorrect, setShowFeedbackCorrect] = useState(false);
    const [smallFontInButtons, setSmallFontInButtons] = useState(false);
    
    useEffect(() => {
        if (!questionData) return;
        setAnswers(new Array(questionData.answers.length).fill(0));
        setCurrentAnswer(0);
        setDescription(setInitialDescription(questionTranslated, translatedAnswers, questionData?.correctAnswer, spectatorMode));
        setFinalAnswer("");
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
    
    const check = (index: number) => (answers[index] - 1).toString() === questionData.correctAnswer[index];
    
    const markTile = (index: number) => {
        if (finalAnswer.length >= answers.length || spectatorMode) return;
        const tempAnswers = [...answers];
        let tempCurrentAnswers = currentAnswer;
        let tempFinalAnswer = finalAnswer;
        if (!answers[index]) {
            tempCurrentAnswers++;
            tempAnswers[index] = tempCurrentAnswers;
            tempFinalAnswer = `${tempFinalAnswer}${index}`;
            setDescription(description.replace("...", translatedAnswers[index]));
        }
        
        setFinalAnswer(tempFinalAnswer);
        setAnswers(tempAnswers);
        setCurrentAnswer(tempCurrentAnswers);

        if (tempFinalAnswer.length >= answers.length) sendAnswerAction(tempFinalAnswer);
    }

    const getCurrentColor = (index: number) => {
        if (finalAnswer.includes(index.toString()) || spectatorMode) return constantsGame.DEFAULT_BTN_COLOR;
        return "white"; 
    }

    const calculateFeedback = (index: number): TFeedbackMode => {
        if (spectatorMode) return "none";
        return getFeedback(showFeedbackCorrect, showAnswers, index, check);
    }

    return <div className={styles.questionContainer}>
        <p className={`${commonStyles.basicHeader3} ${commonStyles.justifiedText}`}>{description}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                translatedAnswers?.map((ans, index) => {
                    let tileIndex = answers[index] ? `${answers[index]}. ` : "";
                    if (showAnswers) tileIndex = `${Number(questionData.correctAnswer[index]) + 1}. `;
                    return (
                        <div className={styles.buttonContainer} key={index}>
                            <GameButton 
                                color={getCurrentColor(index)} 
                                size="thin" 
                                onClick={() => markTile(index)} 
                                feedback={calculateFeedback(index)}
                                font={{
                                    isSmallFont: smallFontInButtons,
                                    setIsSmallFont: setSmallFontInButtons
                                }}
                                > 
                                {`${tileIndex}${ans}`}
                            </GameButton>
                        </div>
                    )
                })
            }
        </div>
    </div>
}

export default FillCorrectOrder;