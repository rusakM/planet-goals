import React, { useState, useEffect } from "react";
import { useTranslate } from "@tolgee/react";
import styles from "../questions.module.scss";
import commonStyles from "../../../styles/common.module.scss";
import { ISubquestionComponent } from "../questions.types";
import { getFeedback } from "../../../helpers/game";
import { useTranslatedAnswers } from "../../../hooks/useTranslatedAnswers";

import GameButton, { TButtonColor } from "../../../components/game-button/game-button";
import { constantsGame } from "../../../helpers/constants";

const MultiChoose: React.FC<ISubquestionComponent> = ({ questionData, sendAnswerAction, showAnswers, spectatorMode }) => {
    const { t } = useTranslate();
    const translatedAnswers = useTranslatedAnswers(questionData?.answers);
    const answersLength = questionData.answers.length;
    const correctAnswersParsed: number[] = JSON.parse(questionData.correctAnswer);
    const [ answers, setAnswers ] = useState(new Array<number>(answersLength).fill(-1));
    const [ answersResults, setAnswersResults ] = useState(new Array<number>(questionData.answers.length).fill(-1));
    const [answerNo, setAnswerNo] = useState(0);
    const [showFeedbackCorrect, setShowFeedbackCorrect] = useState(false);
    const [smallFontInButtons, setSmallFontInButtons] = useState(false);

    useEffect(() => {
        if (!questionData) return;
        const correctAnswersCount = questionData.correctAnswer.split(",").length;
        setAnswers(new Array<number>(correctAnswersCount).fill(-1));
        setAnswersResults(new Array<number>(questionData.answers.length).fill(-1));
        setAnswerNo(0);
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
    
    const check = (index: number) => {
        return correctAnswersParsed.includes(index);
    }

    const mark = (index: number) => {
        if (spectatorMode || answers.includes(index)) return;
        if (answerNo >= correctAnswersParsed.length) return;

        const tempAnswers = [...answers];
        const tempAnswersResults = [...answersResults];
        tempAnswers[answerNo] = index;
        tempAnswersResults[index] = Number(check(index));
        const tempAnswerNo = answerNo + 1;
        setAnswers(tempAnswers);
        setAnswerNo(tempAnswerNo);
        setAnswersResults(tempAnswersResults);

        if (tempAnswerNo >= correctAnswersParsed.length) sendAnswerAction(JSON.stringify(tempAnswers.filter(ans => ans != -1)));
    }   

    const getCurrentColor = (index: number): TButtonColor => {
        if (showAnswers && spectatorMode) return check(index) ? constantsGame.DEFAULT_BTN_COLOR : "white";
        return (!answers.includes(index)) ? "white" : constantsGame.DEFAULT_BTN_COLOR;
    }

    return <div className={styles.questionContainer}>
        <p className={`${styles.headerText} ${commonStyles.centeredText}`}>{t(questionData?.question)}</p>
        <div className={`${styles.buttonsContainer}`}>
            {
                translatedAnswers?.map((ans, index) => {
                    const feedback = getFeedback(showFeedbackCorrect, showAnswers, index, check);
                    return <div className={styles.buttonContainer} key={index}>
                        <GameButton 
                            color={getCurrentColor(index)} 
                            size="thin" 
                            additionalClasses={commonStyles.leftSideText} 
                            onClick={() => mark(index)} feedback={feedback}
                            font={{
                                isSmallFont: smallFontInButtons,
                                setIsSmallFont: setSmallFontInButtons
                            }}
                        > 
                            {`${String.fromCharCode(65 + index)}. ${ans}`}
                        </GameButton>
                    </div>
                })
            }
        </div>
    </div>
}

export default MultiChoose;